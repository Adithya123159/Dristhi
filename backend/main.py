import os
import sys
import uuid
import json
import shutil
import base64
from typing import Optional, List
from contextlib import asynccontextmanager

from fastapi import FastAPI, File, UploadFile, HTTPException, Query, Form, Header
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse, FileResponse
import requests

# Add project root to sys.path so src modules can be imported
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

import src.config
from src.predict import BirdClassifier
from src.config import BIRD_INFO_FILE, RAW_DATA_DIR
from backend.database import (
    init_db, save_prediction, get_history, 
    delete_history_item, clear_all_history, get_stats
)

# Upload directory
UPLOADS_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'uploads')
os.makedirs(UPLOADS_DIR, exist_ok=True)

classifier_instance: Optional[BirdClassifier] = None
bird_database: List[dict] = []

def load_species_database():
    global bird_database
    if os.path.exists(BIRD_INFO_FILE):
        with open(BIRD_INFO_FILE, 'r', encoding='utf-8') as f:
            bird_database = json.load(f)
    else:
        bird_database = []

def find_bird_details(species_id: str):
    for bird in bird_database:
        if bird.get('species_id') == species_id:
            return bird
    # Fallback by clean name
    clean_id = species_id.split('.')[-1].lower()
    for bird in bird_database:
        if bird.get('species_id', '').split('.')[-1].lower() == clean_id:
            return bird
        if bird.get('common_name', '').lower().replace(' ', '_') == clean_id:
            return bird
    return None

def validate_and_identify_with_gemini(image_path: str, api_key: str):
    """Uses Google Gemini Vision API to validate whether image is a bird and extract details."""
    try:
        with open(image_path, "rb") as f:
            img_bytes = f.read()
        b64_img = base64.b64encode(img_bytes).decode("utf-8")
        
        ext = os.path.splitext(image_path)[1].lower()
        mime_type = "image/jpeg"
        if ext == ".png":
            mime_type = "image/png"
        elif ext == ".webp":
            mime_type = "image/webp"

        models_to_try = ["gemini-1.5-flash", "gemini-2.0-flash", "gemini-2.5-flash"]
        res = None
        for model_name in models_to_try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent?key={api_key}"
            headers = {"Content-Type": "application/json"}
            prompt = (
                "You are an expert avian biologist and visual classifier.\n"
                "Analyze this image carefully:\n"
                "1. Does this image clearly show a bird? (Return is_bird: true ONLY if a live or taxidermy bird is visible). "
                "If the image contains a human, dog, cat, car, vehicle, phone, building, random object, furniture, food, landscape without birds, or anything else that is NOT a bird, you MUST set is_bird to false.\n"
                "2. If is_bird is false, provide a short 1-3 word description of what is actually in the image in 'detected_object' (e.g. 'sports car', 'person portrait', 'cat', 'furniture').\n"
                "3. If is_bird is true, identify the species accurately. Provide common name, scientific name, confidence score (0.0 to 1.0), family, habitat, diet, physical characteristics, geographical distribution, conservation status, and a 2-sentence description.\n\n"
                "Output valid JSON ONLY with this exact schema:\n"
                "{\n"
                '  "is_bird": boolean,\n'
                '  "detected_object": string or null,\n'
                '  "common_name": string or null,\n'
                '  "scientific_name": string or null,\n'
                '  "confidence": float,\n'
                '  "family": string or null,\n'
                '  "habitat": string or null,\n'
                '  "diet": string or null,\n'
                '  "physical_characteristics": string or null,\n'
                '  "geographical_distribution": string or null,\n'
                '  "conservation_status": string or null,\n'
                '  "description": string or null\n'
                "}"
            )
            payload = {
                "contents": [{
                    "parts": [
                        {"text": prompt},
                        {"inline_data": {"mime_type": mime_type, "data": b64_img}}
                    ]
                }],
                "generationConfig": {
                    "response_mime_type": "application/json"
                }
            }
            res = requests.post(url, headers=headers, json=payload, timeout=20)
            if res.status_code == 200:
                break
            elif res.status_code in (400, 401, 403):
                # Check for invalid key specifically
                err_data = res.json() if res.headers.get("content-type", "").startswith("application/json") else {}
                msg = err_data.get("error", {}).get("message", res.text)
                if "API_KEY_INVALID" in msg or "API key not valid" in msg or res.status_code in (401, 403):
                    return {"error": f"Invalid Gemini API Key: {msg}"}
                return {"error": f"Gemini API Error: {msg}"}

        if res and res.status_code == 200:
            data = res.json()
            raw_text = data["candidates"][0]["content"]["parts"][0]["text"].strip()
            # Remove any markdown code fences if present
            if raw_text.startswith("```json"):
                raw_text = raw_text[7:]
            if raw_text.startswith("```"):
                raw_text = raw_text[3:]
            if raw_text.endswith("```"):
                raw_text = raw_text[:-3]
            raw_text = raw_text.strip()
            return json.loads(raw_text)
        else:
            print("Gemini API error after trying models:", res.status_code if res else "No response", res.text if res else "")
            return None
    except Exception as e:
        print("Gemini validation call error:", e)
        return {"error": f"Validation failed: {str(e)}"}

@asynccontextmanager
async def lifespan(app: FastAPI):
    global classifier_instance
    print("Initializing SQLite Database...")
    init_db()
    print("Loading Species Database...")
    load_species_database()
    print("Preloading Deep Learning Model (MobileNetV2)...")
    try:
        classifier_instance = BirdClassifier()
        print("Model preloaded and ready for inference!")
    except Exception as e:
        print(f"Warning: Could not preload model on startup: {e}")
        classifier_instance = None
    yield
    print("Shutting down backend...")

app = FastAPI(
    title="AvianAI API",
    description="Bird Species Classification and Information System API powered by Deep Learning",
    version="2.1.0",
    lifespan=lifespan
)

# Allow CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve uploaded files for history previews
app.mount("/uploads", StaticFiles(directory=UPLOADS_DIR), name="uploads")

# Serve sample images if available
if os.path.exists(RAW_DATA_DIR):
    app.mount("/samples", StaticFiles(directory=RAW_DATA_DIR), name="samples")

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "model_loaded": classifier_instance is not None,
        "model_architecture": "MobileNetV2 (Transfer Learning)",
        "supported_species_count": len(bird_database),
        "tensorflow_version": "2.21.0"
    }

@app.post("/api/predict")
async def predict_bird(
    file: UploadFile = File(...),
    api_key: Optional[str] = Form(None),
    x_api_key: Optional[str] = Header(None)
):
    global classifier_instance
    effective_api_key = api_key or x_api_key or os.environ.get("GEMINI_API_KEY", "")

    # Validate file extension
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in ['.jpg', '.jpeg', '.png', '.webp']:
        raise HTTPException(
            status_code=400, 
            detail="Unsupported format. Please upload JPG, JPEG, or PNG."
        )

    # Save uploaded file
    file_id = f"{uuid.uuid4().hex}{ext}"
    saved_path = os.path.join(UPLOADS_DIR, file_id)
    with open(saved_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    image_url = f"/uploads/{file_id}"

    # 1. AI API Key Validation (If provided)
    if effective_api_key and effective_api_key.strip():
        gemini_result = validate_and_identify_with_gemini(saved_path, effective_api_key.strip())
        if gemini_result:
            if "error" in gemini_result:
                raise HTTPException(
                    status_code=400,
                    detail=gemini_result["error"]
                )
            if not gemini_result.get("is_bird"):
                detected = gemini_result.get("detected_object") or "non-bird object"
                raise HTTPException(
                    status_code=400,
                    detail=f"Invalid Image: No bird detected in this image (detected: {detected}). Please upload an image of a bird."
                )

            # Image is verified to be a bird!
            common_name = gemini_result.get("common_name") or "Unknown Bird"
            scientific_name = gemini_result.get("scientific_name") or "Aves"
            confidence = float(gemini_result.get("confidence") or 0.95)

            # Match with local database if species exists
            local_details = None
            for b in bird_database:
                if b.get("common_name", "").lower() == common_name.lower():
                    local_details = b
                    break

            species_id = local_details.get("species_id") if local_details else f"custom.{common_name.replace(' ', '_')}"

            top_predictions = [
                {
                    "species_id": species_id,
                    "confidence": round(confidence, 4),
                    "common_name": common_name,
                    "scientific_name": scientific_name
                }
            ]

            # Save to SQLite history
            record_id = save_prediction(
                filename=file_id,
                image_url=image_url,
                species_id=species_id,
                common_name=common_name,
                scientific_name=scientific_name,
                confidence=round(confidence, 4),
                top_predictions=top_predictions
            )

            return {
                "success": True,
                "id": record_id,
                "validated_by": "Gemini AI Vision",
                "prediction": {
                    "species_id": species_id,
                    "common_name": common_name,
                    "scientific_name": scientific_name,
                    "confidence": round(confidence, 4),
                    "family": gemini_result.get("family") or (local_details.get("family") if local_details else "Aves"),
                    "conservation_status": gemini_result.get("conservation_status") or (local_details.get("conservation_status") if local_details else "Least Concern (LC)"),
                    "habitat": gemini_result.get("habitat") or (local_details.get("habitat") if local_details else "Natural habitat"),
                    "diet": gemini_result.get("diet") or (local_details.get("diet") if local_details else "Omnivorous / Varies"),
                    "physical_characteristics": gemini_result.get("physical_characteristics") or (local_details.get("physical_characteristics") if local_details else ""),
                    "geographical_distribution": gemini_result.get("geographical_distribution") or (local_details.get("geographical_distribution") if local_details else "Found across India"),
                    "description": gemini_result.get("description") or (local_details.get("description") if local_details else ""),
                    "image_url": local_details.get("image_url", "") if local_details else image_url
                },
                "top_predictions": top_predictions,
                "uploaded_image_url": image_url
            }

    # 2. Local MobileNetV2 Inference & Validation
    if classifier_instance is None:
        try:
            classifier_instance = BirdClassifier()
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Model failed to initialize: {str(e)}")

    try:
        results = classifier_instance.predict(saved_path, top_k=3)
        if not results:
            raise HTTPException(status_code=500, detail="Prediction returned empty results.")

        top_match = results[0]
        species_id = top_match["species_id"]
        confidence = float(top_match["confidence"])

        # Local validation threshold: If max confidence is lower than 0.15, the image is non-bird or uncertain
        if confidence < 0.15:
            raise HTTPException(
                status_code=400,
                detail="Invalid Image: No bird recognized in this image. Please upload a clear photo of a bird."
            )

        details = find_bird_details(species_id) or {}
        common_name = details.get("common_name", species_id)
        scientific_name = details.get("scientific_name", "Unknown")

        enriched_top = []
        for r in results:
            r_details = find_bird_details(r["species_id"])
            enriched_top.append({
                "species_id": r["species_id"],
                "confidence": round(float(r["confidence"]), 4),
                "common_name": r_details.get("common_name", r["species_id"]) if r_details else r["species_id"],
                "scientific_name": r_details.get("scientific_name", "Unknown") if r_details else "Unknown"
            })

        # Persist to database history
        record_id = save_prediction(
            filename=file_id,
            image_url=image_url,
            species_id=species_id,
            common_name=common_name,
            scientific_name=scientific_name,
            confidence=round(confidence, 4),
            top_predictions=enriched_top
        )

        return {
            "success": True,
            "id": record_id,
            "validated_by": "MobileNetV2 Neural Classifier",
            "prediction": {
                "species_id": species_id,
                "common_name": common_name,
                "scientific_name": scientific_name,
                "confidence": round(confidence, 4),
                "family": details.get("family", "Aves"),
                "conservation_status": details.get("conservation_status", "Least Concern (LC)"),
                "habitat": details.get("habitat", "Distributed across suitable habitats in India."),
                "diet": details.get("diet", "Omnivorous / Varies with habitat."),
                "physical_characteristics": details.get("physical_characteristics", "Distinctive plumage and morphological attributes."),
                "geographical_distribution": details.get("geographical_distribution", "Found across the Indian subcontinent."),
                "description": details.get("description", ""),
                "image_url": details.get("image_url", "")
            },
            "top_predictions": enriched_top,
            "uploaded_image_url": image_url
        }
    except HTTPException:
        raise
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Inference error: {str(e)}")

@app.get("/api/species")
def get_species(
    search: Optional[str] = Query(None, description="Search by common or scientific name"),
    family: Optional[str] = Query(None, description="Filter by taxonomic family"),
    status: Optional[str] = Query(None, description="Filter by conservation status"),
    letter: Optional[str] = Query(None, description="Filter by starting letter"),
    limit: int = 100,
    offset: int = 0
):
    filtered = bird_database
    if search:
        s = search.lower().strip()
        filtered = [
            b for b in filtered 
            if s in b.get('common_name', '').lower() 
            or s in b.get('scientific_name', '').lower()
            or s in b.get('family', '').lower()
        ]
    if family and family.lower() != 'all':
        filtered = [b for b in filtered if b.get('family', '').lower() == family.lower()]
    if status and status.lower() != 'all':
        filtered = [b for b in filtered if status.lower() in b.get('conservation_status', '').lower()]
    if letter and letter.lower() != 'all':
        filtered = [b for b in filtered if b.get('common_name', '').upper().startswith(letter.upper())]

    total = len(filtered)
    paged = filtered[offset: offset + limit]
    return {
        "total": total,
        "limit": limit,
        "offset": offset,
        "species": paged
    }

@app.get("/api/species/{species_id}")
def get_single_species(species_id: str):
    details = find_bird_details(species_id)
    if not details:
        raise HTTPException(status_code=404, detail=f"Species '{species_id}' not found.")
    return details

@app.get("/api/history")
def get_classification_history(limit: int = 50, offset: int = 0):
    records = get_history(limit=limit, offset=offset)
    return {"history": records, "count": len(records)}

@app.delete("/api/history/{history_id}")
def delete_single_history(history_id: int):
    success = delete_history_item(history_id)
    if not success:
        raise HTTPException(status_code=404, detail="History record not found.")
    return {"success": True, "message": f"Record {history_id} deleted."}

@app.delete("/api/history")
def clear_history():
    clear_all_history()
    return {"success": True, "message": "All classification history cleared."}

@app.get("/api/stats")
def get_system_stats():
    stats = get_stats()
    families = set(b.get('family', '') for b in bird_database if b.get('family'))
    endangered = sum(1 for b in bird_database if any(k in b.get('conservation_status', '') for k in ['Endangered', 'Vulnerable', 'Threatened']))
    stats.update({
        "taxonomic_families": len(families),
        "threatened_species": endangered,
        "model_name": "MobileNetV2"
    })
    return stats

@app.get("/api/sample-images")
def get_sample_images():
    samples = []
    if os.path.exists(RAW_DATA_DIR):
        for folder in sorted(os.listdir(RAW_DATA_DIR)):
            folder_path = os.path.join(RAW_DATA_DIR, folder)
            if os.path.isdir(folder_path):
                imgs = [f for f in os.listdir(folder_path) if f.lower().endswith(('.jpg', '.jpeg', '.png'))]
                if imgs:
                    details = find_bird_details(folder)
                    samples.append({
                        "species_id": folder,
                        "common_name": details.get("common_name", folder) if details else folder,
                        "image_path": f"/samples/{folder}/{imgs[0]}",
                        "local_rel_path": f"data/raw/{folder}/{imgs[0]}"
                    })
    return {"samples": samples[:10]}

# Mount and serve built React frontend assets if present
FRONTEND_DIST = os.path.join(PROJECT_ROOT, 'frontend', 'dist')
if os.path.exists(FRONTEND_DIST):
    assets_dir = os.path.join(FRONTEND_DIST, 'assets')
    if os.path.exists(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        if (full_path.startswith("api/") or 
            full_path.startswith("uploads/") or 
            full_path.startswith("samples/") or 
            full_path.startswith("docs") or 
            full_path.startswith("openapi.json")):
            raise HTTPException(status_code=404, detail="Not Found")
        
        file_path = os.path.join(FRONTEND_DIST, full_path)
        if os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse(os.path.join(FRONTEND_DIST, "index.html"))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
