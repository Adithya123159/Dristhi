import os
import sys
import uuid
import json
import shutil
import base64
import hashlib
from typing import Optional, List, Dict, Any
from contextlib import asynccontextmanager
from pydantic import BaseModel

from fastapi import FastAPI, File, UploadFile, HTTPException, Query, Form, Header, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse, FileResponse
import requests

# Add project root to sys.path so modules can be imported
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

# Ensure Keras, Matplotlib and Ultralytics stay within workspace
os.environ.setdefault("KERAS_HOME", os.path.join(PROJECT_ROOT, '.keras'))
os.environ.setdefault("YOLO_CONFIG_DIR", os.path.join(PROJECT_ROOT, '.yolo'))
os.environ.setdefault("MPLCONFIGDIR", os.path.join(PROJECT_ROOT, '.matplotlib'))

from src.predict import BirdClassifier
from src.config import BIRD_INFO_FILE, RAW_DATA_DIR
from backend.database import (
    init_db, create_user, get_user_by_email, get_user_by_id
)
from backend.validation_service import ImageValidationService
from backend.audio_service import AudioValidationService, AudioClassificationService
from backend.gradcam_service import GradCAMService
from backend.mongo_db import (
    init_mongo, record_identification, get_identifications,
    delete_identification_record, clear_all_identifications,
    get_system_thresholds, update_system_thresholds, get_aggregate_stats,
    is_mongo_connected
)

# Upload directory
UPLOADS_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'uploads')
os.makedirs(UPLOADS_DIR, exist_ok=True)

# Load optional .env file
def load_env_file():
    env_path = os.path.join(PROJECT_ROOT, '.env')
    if os.path.exists(env_path):
        with open(env_path, 'r', encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    k, v = line.split('=', 1)
                    k = k.strip()
                    v = v.strip().strip('"').strip("'")
                    if k and not os.environ.get(k):
                        os.environ[k] = v

load_env_file()

# Core Services
classifier_instance: Optional[BirdClassifier] = None
image_validator: Optional[ImageValidationService] = None
audio_validator: Optional[AudioValidationService] = None
audio_classifier: Optional[AudioClassificationService] = None
gradcam_service: Optional[GradCAMService] = None
bird_database: List[dict] = []

def load_species_database():
    global bird_database
    if os.path.exists(BIRD_INFO_FILE):
        with open(BIRD_INFO_FILE, 'r', encoding='utf-8') as f:
            bird_database = json.load(f)
    else:
        bird_database = []

def find_bird_details(species_id: str) -> Optional[dict]:
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

def determine_confidence_level(score: float, thresholds: dict) -> str:
    high = thresholds.get("high_confidence", 0.75)
    medium = thresholds.get("medium_confidence", 0.40)
    if score >= high:
        return "high"
    elif score >= medium:
        return "medium"
    return "low"

@asynccontextmanager
async def lifespan(app: FastAPI):
    global classifier_instance, image_validator, audio_validator, audio_classifier, gradcam_service
    print("Initializing Databases (MongoDB + SQLite)...")
    init_db()
    init_mongo()
    
    print("Loading Species Database...")
    load_species_database()

    print("Initializing Image Validation & YOLO Service...")
    image_validator = ImageValidationService()

    print("Initializing Audio Validation & Classification Services...")
    audio_validator = AudioValidationService()
    audio_classifier = AudioClassificationService(species_database=bird_database)

    print("Preloading MobileNetV2 Vision Classifier...")
    try:
        classifier_instance = BirdClassifier()
        if classifier_instance and classifier_instance.model:
            gradcam_service = GradCAMService(classifier_instance.model)
        print("Vision Classifier & Grad-CAM initialized!")
    except Exception as e:
        print(f"Vision model preload warning: {e}")
        classifier_instance = None

    yield
    print("Shutting down Drishti backend...")

app = FastAPI(
    title="Drishti Avian Intelligence API",
    description="Multimodal AI Bird Species Identification Platform (Vision + Bioacoustics)",
    version="3.0.0",
    lifespan=lifespan
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static file serving
app.mount("/uploads", StaticFiles(directory=UPLOADS_DIR), name="uploads")
if os.path.exists(RAW_DATA_DIR):
    app.mount("/samples", StaticFiles(directory=RAW_DATA_DIR), name="samples")

# ─────────────────────────────────────────────────────────────────────────────
# 1. HEALTH CHECK & SYSTEM TELEMETRY
# ─────────────────────────────────────────────────────────────────────────────

@app.get("/api/health")
def health_check():
    thresholds = get_system_thresholds()
    return {
        "status": "healthy",
        "vision_model_loaded": classifier_instance is not None,
        "yolo_detector_loaded": image_validator is not None,
        "audio_pipeline_ready": audio_validator is not None and audio_classifier is not None,
        "mongodb_connected": is_mongo_connected(),
        "species_count": len(bird_database),
        "thresholds": thresholds,
        "tensorflow_version": "2.21.0"
    }

# ─────────────────────────────────────────────────────────────────────────────
# 2. IMAGE-BASED BIRD IDENTIFICATION PIPELINE
# ─────────────────────────────────────────────────────────────────────────────

@app.post("/api/identify/image")
@app.post("/api/identify-bird")
@app.post("/api/predict")
async def identify_bird_image(
    file: UploadFile = File(...),
    api_key: Optional[str] = Form(None),
    x_api_key: Optional[str] = Header(None)
):
    """
    Complete 6-Step Image Bird Identification Pipeline:
    1. Upload & validate file properties (format, size, blur)
    2. Run YOLOv8 bird detection
    3. Strictly reject non-bird images (humans, vehicles, dogs, buildings)
    4. Crop detected bird bounding box
    5. MobileNetV2 fine-grained species classification (top-5)
    6. Generate Grad-CAM explainability heatmap overlay
    7. Record session in MongoDB
    """
    global classifier_instance, image_validator, gradcam_service
    thresholds = get_system_thresholds()

    # Step 1: Save upload
    ext = os.path.splitext(file.filename)[1].lower()
    file_id = f"{uuid.uuid4().hex}{ext}"
    saved_path = os.path.join(UPLOADS_DIR, file_id)
    with open(saved_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    media_url = f"/uploads/{file_id}"

    # Step 2: Validate file properties
    valid, reason, meta = image_validator.validate_file_properties(saved_path)
    if not valid:
        # Record corrupted or invalid upload
        record_identification(
            input_type="image",
            uploaded_filename=file.filename or file_id,
            media_url=media_url,
            detection_status="rejected_invalid_file",
            predicted_species="None",
            scientific_name="None",
            confidence_score=0.0,
            top_predictions=[],
            rejection_reason=reason
        )
        raise HTTPException(status_code=400, detail=reason)

    # Step 3: YOLO Bird Detection
    detection = image_validator.detect_birds(saved_path, conf_threshold=0.25)
    
    if not detection.get("is_bird"):
        rejection_msg = detection.get("rejection_message", "Invalid Image: No bird detected. Please upload an image containing a bird.")
        # Log to MongoDB
        record_identification(
            input_type="image",
            uploaded_filename=file.filename or file_id,
            media_url=media_url,
            detection_status="rejected_no_bird",
            predicted_species="None",
            scientific_name="None",
            confidence_score=0.0,
            top_predictions=[],
            annotated_url=f"/uploads/{os.path.basename(detection.get('annotated_image_path', ''))}" if detection.get('annotated_image_path') else "",
            rejection_reason=rejection_msg,
            telemetry={"detected_objects": detection.get("detected_objects", [])}
        )
        raise HTTPException(
            status_code=400,
            detail=rejection_msg
        )

    # Step 4: Classification on cropped bird region
    cropped_path = detection.get("cropped_image_path", saved_path)
    annotated_path = detection.get("annotated_image_path", saved_path)
    annotated_url = f"/uploads/{os.path.basename(annotated_path)}"
    cropped_url = f"/uploads/{os.path.basename(cropped_path)}"

    if classifier_instance is None:
        try:
            classifier_instance = BirdClassifier()
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Vision model initialization failed: {e}")

    try:
        results = classifier_instance.predict(cropped_path, top_k=5)
        if not results:
            raise HTTPException(status_code=500, detail="Inference returned empty results.")

        top_match = results[0]
        species_id = top_match["species_id"]
        confidence = float(top_match["confidence"])

        # Step 5: Generate Grad-CAM Explainability Heatmap
        gradcam_filename = f"{os.path.splitext(file_id)[0]}_gradcam.jpg"
        gradcam_path = os.path.join(UPLOADS_DIR, gradcam_filename)
        gradcam_url = None

        if gradcam_service:
            try:
                gradcam_service.save_gradcam_overlay(cropped_path, gradcam_path)
                gradcam_url = f"/uploads/{gradcam_filename}"
            except Exception as e:
                print("Grad-CAM generation notice:", e)

        # Enriched top-5 predictions
        enriched_top = []
        for r in results:
            d = find_bird_details(r["species_id"])
            enriched_top.append({
                "species_id": r["species_id"],
                "confidence": round(float(r["confidence"]), 4),
                "common_name": d.get("common_name", r["species_id"]) if d else r["species_id"],
                "scientific_name": d.get("scientific_name", "Unknown") if d else "Unknown",
                "family": d.get("family", "") if d else "",
                "conservation_status": d.get("conservation_status", "Least Concern (LC)") if d else "Least Concern (LC)"
            })

        top_details = find_bird_details(species_id) or {}
        common_name = top_details.get("common_name", species_id)
        scientific_name = top_details.get("scientific_name", "Aves")

        confidence_tier = determine_confidence_level(confidence, thresholds)
        detection_status = "success" if confidence_tier != "low" else "uncertain"

        # Step 6: Store in MongoDB
        ident_id = record_identification(
            input_type="image",
            uploaded_filename=file.filename or file_id,
            media_url=media_url,
            detection_status=detection_status,
            predicted_species=common_name,
            scientific_name=scientific_name,
            confidence_score=confidence,
            top_predictions=enriched_top,
            annotated_url=annotated_url,
            telemetry={
                "bird_boxes": detection.get("boxes", []),
                "image_meta": meta,
                "confidence_tier": confidence_tier
            }
        )

        return {
            "success": True,
            "status": detection_status,
            "identification_id": ident_id,
            "input_type": "image",
            "is_bird": True,
            "bird_count": detection.get("bird_count", 1),
            "confidence_tier": confidence_tier,
            "prediction": {
                "species_id": species_id,
                "common_name": common_name,
                "scientific_name": scientific_name,
                "confidence": round(confidence, 4),
                "family": top_details.get("family", "Aves"),
                "order": top_details.get("order", "Passeriformes"),
                "conservation_status": top_details.get("conservation_status", "Least Concern (LC)"),
                "habitat": top_details.get("habitat", "Grasslands, scrublands, tropical deciduous forests"),
                "diet": top_details.get("diet", "Insects, seeds, small invertebrates"),
                "geographical_distribution": top_details.get("geographical_distribution", "Widespread across India"),
                "physical_characteristics": top_details.get("physical_characteristics", ""),
                "description": top_details.get("description", "Documented avian species in Drishti Encyclopedia."),
                "image_url": top_details.get("image_url", "") or annotated_url
            },
            "top_predictions": enriched_top,
            "uploaded_image_url": media_url,
            "annotated_image_url": annotated_url,
            "cropped_image_url": cropped_url,
            "gradcam_url": gradcam_url,
            "bounding_boxes": detection.get("boxes", []),
            "image_quality": meta
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Image classification error: {str(e)}")

# ─────────────────────────────────────────────────────────────────────────────
# 3. AUDIO-BASED BIRD IDENTIFICATION PIPELINE
# ─────────────────────────────────────────────────────────────────────────────

@app.post("/api/identify/audio")
async def identify_bird_audio(
    file: UploadFile = File(...)
):
    """
    Complete 6-Step Audio Bird Identification Pipeline:
    1. Upload & validate audio format (WAV, MP3, FLAC)
    2. Check audio readability, duration, and silence (RMS energy)
    3. Bioacoustic bird sound detection: verify presence of avian vocalizations (1.5 - 8.5 kHz)
       and reject human speech, dog barking, engine traffic rumble, or empty silence.
    4. Librosa Mel Spectrogram generation & plot rendering
    5. Acoustic CNN species classification with calibrated confidence (top-5)
    6. Record session in MongoDB
    """
    global audio_validator, audio_classifier
    thresholds = get_system_thresholds()

    # Step 1: Save audio file
    ext = os.path.splitext(file.filename)[1].lower()
    file_id = f"{uuid.uuid4().hex}{ext}"
    saved_path = os.path.join(UPLOADS_DIR, file_id)
    with open(saved_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    media_url = f"/uploads/{file_id}"

    # Step 2: Validate audio file & silence check
    valid, reason, meta = audio_validator.validate_file(saved_path)
    if not valid:
        record_identification(
            input_type="audio",
            uploaded_filename=file.filename or file_id,
            media_url=media_url,
            detection_status="rejected_invalid_audio",
            predicted_species="None",
            scientific_name="None",
            confidence_score=0.0,
            top_predictions=[],
            rejection_reason=reason
        )
        raise HTTPException(status_code=400, detail=reason)

    # Step 3: Bird Sound Detection (Bioacoustics)
    detection = audio_validator.detect_bird_sound(saved_path)
    if not detection.get("is_bird_sound"):
        rejection_msg = detection.get("rejection_message", "Invalid Audio: No bird sound detected. Please upload an audio recording containing bird sounds.")
        record_identification(
            input_type="audio",
            uploaded_filename=file.filename or file_id,
            media_url=media_url,
            detection_status="rejected_no_bird_sound",
            predicted_species="None",
            scientific_name="None",
            confidence_score=0.0,
            top_predictions=[],
            rejection_reason=rejection_msg,
            telemetry=detection.get("telemetry", {})
        )
        raise HTTPException(status_code=400, detail=rejection_msg)

    # Step 4: Mel Spectrogram Generation
    spectrogram_filename = f"{os.path.splitext(file_id)[0]}_spectrogram.png"
    spectrogram_path = os.path.join(UPLOADS_DIR, spectrogram_filename)
    try:
        spec_info = audio_classifier.generate_mel_spectrogram(saved_path, spectrogram_path)
        spectrogram_url = f"/uploads/{spectrogram_filename}"
    except Exception as e:
        print("Spectrogram generation error:", e)
        spectrogram_url = None

    # Step 5: Bioacoustic Species Classification (Top-5)
    try:
        top_predictions = audio_classifier.classify_audio_spectrogram(saved_path, top_k=5)
        if not top_predictions:
            raise HTTPException(status_code=500, detail="Audio classification returned empty results.")

        top_match = top_predictions[0]
        confidence = float(top_match["confidence"])
        common_name = top_match["common_name"]
        scientific_name = top_match["scientific_name"]
        species_id = top_match["species_id"]

        top_details = find_bird_details(species_id) or {}
        confidence_tier = determine_confidence_level(confidence, thresholds)
        detection_status = "success" if confidence_tier != "low" else "uncertain"

        # Step 6: Persist in MongoDB
        ident_id = record_identification(
            input_type="audio",
            uploaded_filename=file.filename or file_id,
            media_url=media_url,
            detection_status=detection_status,
            predicted_species=common_name,
            scientific_name=scientific_name,
            confidence_score=confidence,
            top_predictions=top_predictions,
            spectrogram_url=spectrogram_url,
            telemetry={
                "acoustic": detection.get("telemetry", {}),
                "audio_meta": meta,
                "confidence_tier": confidence_tier
            }
        )

        return {
            "success": True,
            "status": detection_status,
            "identification_id": ident_id,
            "input_type": "audio",
            "is_bird_sound": True,
            "confidence_tier": confidence_tier,
            "prediction": {
                "species_id": species_id,
                "common_name": common_name,
                "scientific_name": scientific_name,
                "confidence": round(confidence, 4),
                "family": top_details.get("family", top_match.get("family", "Aves")),
                "order": top_details.get("order", "Passeriformes"),
                "conservation_status": top_details.get("conservation_status", "Least Concern (LC)"),
                "habitat": top_details.get("habitat", "Forests, scrublands, open woodlands"),
                "diet": top_details.get("diet", "Insects, seeds, berries"),
                "geographical_distribution": top_details.get("geographical_distribution", "Native to India"),
                "physical_characteristics": top_details.get("physical_characteristics", ""),
                "description": top_details.get("description", "Documented avian species in Drishti Encyclopedia."),
                "image_url": top_details.get("image_url", "")
            },
            "top_predictions": top_predictions,
            "audio_url": media_url,
            "spectrogram_url": spectrogram_url,
            "acoustic_telemetry": detection.get("telemetry", {}),
            "audio_metadata": meta
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Audio classification error: {str(e)}")

# ─────────────────────────────────────────────────────────────────────────────
# 4. SPECIES ENCYCLOPEDIA & CATALOG ENDPOINTS
# ─────────────────────────────────────────────────────────────────────────────

@app.get("/api/birds")
@app.get("/api/species")
def get_species_catalog(
    search: Optional[str] = Query(None, description="Search by common, scientific or family name"),
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
        "species": paged,
        "birds": paged  # Alias for requirement compatibility
    }

@app.get("/api/birds/{species_id}")
@app.get("/api/species/{species_id}")
def get_species_detail(species_id: str):
    details = find_bird_details(species_id)
    if not details:
        raise HTTPException(status_code=404, detail=f"Species '{species_id}' not found.")
    return details

# ─────────────────────────────────────────────────────────────────────────────
# 5. MULTIMODAL IDENTIFICATION HISTORY ENDPOINTS
# ─────────────────────────────────────────────────────────────────────────────

@app.get("/api/history")
def get_history(
    input_type: Optional[str] = Query(None, description="Filter: all, image, or audio"),
    detection_status: Optional[str] = Query(None, description="Filter: all, success, or rejected"),
    limit: int = 50,
    offset: int = 0
):
    records = get_identifications(
        input_type=input_type,
        detection_status=detection_status,
        limit=limit,
        offset=offset
    )
    return {"history": records, "count": len(records)}

@app.get("/api/history/{id}")
def get_single_history(id: str):
    records = get_identifications(limit=100)
    for r in records:
        if r.get("identification_id") == id or str(r.get("id")) == id:
            return r
    raise HTTPException(status_code=404, detail="History record not found.")

@app.delete("/api/history/{id}")
def delete_history_record(id: str):
    success = delete_identification_record(id)
    if not success:
        raise HTTPException(status_code=404, detail="History record not found.")
    return {"success": True, "message": f"Record {id} removed."}

@app.delete("/api/history")
def clear_history_records():
    clear_all_identifications()
    return {"success": True, "message": "All identification records cleared."}

# ─────────────────────────────────────────────────────────────────────────────
# 6. ADMIN DASHBOARD & SYSTEM METRICS
# ─────────────────────────────────────────────────────────────────────────────

@app.get("/api/admin/metrics")
def get_admin_metrics():
    stats = get_aggregate_stats()
    families = set(b.get('family', '') for b in bird_database if b.get('family'))
    endangered = sum(1 for b in bird_database if any(k in b.get('conservation_status', '') for k in ['Endangered', 'Vulnerable', 'Threatened', 'Critically Endangered']))
    
    thresholds = get_system_thresholds()

    return {
        **stats,
        "supported_species_count": len(bird_database),
        "taxonomic_families": len(families),
        "threatened_species": endangered,
        "vision_model": "YOLOv8n (Detection) + MobileNetV2 (Classification)",
        "audio_model": "Librosa Bioacoustics + Mel Spectrogram CNN",
        "thresholds": thresholds
    }

class ThresholdUpdate(BaseModel):
    high_confidence: float
    medium_confidence: float
    blur_threshold: Optional[float] = 15.0

@app.get("/api/admin/thresholds")
def get_thresholds():
    return get_system_thresholds()

@app.put("/api/admin/thresholds")
def update_thresholds(data: ThresholdUpdate):
    if not (0.1 <= data.medium_confidence < data.high_confidence <= 1.0):
        raise HTTPException(status_code=400, detail="Invalid thresholds: medium must be less than high and within 0.1-1.0.")
    updated = update_system_thresholds(
        high=data.high_confidence,
        medium=data.medium_confidence,
        blur=data.blur_threshold or 15.0
    )
    return {"success": True, "thresholds": updated}

# ─────────────────────────────────────────────────────────────────────────────
# 7. SAMPLES & AUTHENTICATION ENDPOINTS
# ─────────────────────────────────────────────────────────────────────────────

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

class UserRegister(BaseModel):
    name: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

def hash_password(password: str) -> str:
    salt = "drishti_secure_salt_2026"
    return hashlib.sha256(f"{salt}:{password}".encode("utf-8")).hexdigest()

@app.post("/api/auth/register")
def register_user(data: UserRegister):
    if not data.name or len(data.name.strip()) < 2:
        raise HTTPException(status_code=400, detail="Name must be at least 2 characters long.")
    if not data.email or "@" not in data.email:
        raise HTTPException(status_code=400, detail="A valid email address is required.")
    if not data.password or len(data.password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters.")
    
    existing = get_user_by_email(data.email)
    if existing:
        raise HTTPException(status_code=400, detail="An account with this email already exists.")
    
    pwd_hash = hash_password(data.password)
    user = create_user(name=data.name.strip(), email=data.email, password_hash=pwd_hash)
    if not user:
        raise HTTPException(status_code=400, detail="Registration could not be completed.")
    
    return {
        "success": True,
        "message": "Registration successful!",
        "user": user,
        "token": f"user_tok_{user['id']}_{hash_password(user['email'])[:16]}"
    }

@app.post("/api/auth/login")
def login_user(data: UserLogin):
    user = get_user_by_email(data.email)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password.")
    
    if user["password_hash"] != hash_password(data.password):
        raise HTTPException(status_code=401, detail="Invalid email or password.")
    
    return {
        "success": True,
        "message": "Login successful!",
        "user": {
            "id": user["id"],
            "name": user["name"],
            "email": user["email"],
            "created_at": user["created_at"]
        },
        "token": f"user_tok_{user['id']}_{hash_password(user['email'])[:16]}"
    }

# ─────────────────────────────────────────────────────────────────────────────
# 8. SERVE BUILT REACT FRONTEND SPA
# ─────────────────────────────────────────────────────────────────────────────

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
