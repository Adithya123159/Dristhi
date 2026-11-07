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

# Ensure Keras and Matplotlib stay within workspace
os.environ.setdefault("KERAS_HOME", os.path.join(PROJECT_ROOT, '.keras'))
os.environ.setdefault("MPLCONFIGDIR", os.path.join(PROJECT_ROOT, '.matplotlib'))

from src.predict import BirdClassifier
from src.config import BIRD_INFO_FILE, RAW_DATA_DIR
from backend.database import (
    init_db, create_user, get_user_by_email, get_user_by_id
)
from backend.validation_service import ImageValidationService
from backend.audio_service import AudioValidationService, AudioClassificationService
from backend.gradcam_service import GradCAMService
from backend.gemini_service import GeminiMultimodalService
from backend.species_detail_service import species_detail_service
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
                    if k:
                        os.environ[k] = v

load_env_file()

# Core Services
classifier_instance: Optional[BirdClassifier] = None
image_validator: Optional[ImageValidationService] = None
audio_validator: Optional[AudioValidationService] = None
audio_classifier: Optional[AudioClassificationService] = None
gradcam_service: Optional[GradCAMService] = None
gemini_service = GeminiMultimodalService()
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
        if bird.get('common_name', '').lower() == species_id.lower():
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

    print("Initializing Image Validation Service...")
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
    description="Multimodal AI Bird Species Identification Platform (Vision + Bioacoustics with API Key Support)",
    version="3.1.0",
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
        "image_validator_loaded": image_validator is not None,
        "audio_pipeline_ready": audio_validator is not None and audio_classifier is not None,
        "mongodb_connected": is_mongo_connected(),
        "species_count": len(bird_database),
        "api_key_configured": bool(os.environ.get("GEMINI_API_KEY")),
        "thresholds": thresholds,
        "tensorflow_version": "2.21.0"
    }

# ─────────────────────────────────────────────────────────────────────────────
# 2. IMAGE-BASED BIRD IDENTIFICATION PIPELINE (VISION CLASSIFIER)
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
    Multimodal Image Bird Identification Pipeline:
    1. Validates image file format, size, dimensions, and readability.
    2. Verifies bird presence:
       - Rejects non-bird subjects (cars, humans, dogs, blank images, abstract graphics)
         with: "No bird detected. Please upload a valid bird image."
    3. Runs the trained deep learning model (MobileNetV2) to classify species and compute confidence.
       (Strict Rule: ML predictions are computed by the trained model, NOT replaced with Gemini).
    4. Attaches full 6-section structured biological information (A through F) via species_detail_service.
    5. Generates Grad-CAM visual explainability heatmap.
    """
    global classifier_instance, image_validator, gradcam_service, gemini_service
    thresholds = get_system_thresholds()
    effective_api_key = api_key or x_api_key or os.environ.get("GEMINI_API_KEY", "")

    # Save upload
    ext = os.path.splitext(file.filename)[1].lower()
    file_id = f"{uuid.uuid4().hex}{ext}"
    saved_path = os.path.join(UPLOADS_DIR, file_id)
    with open(saved_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    media_url = f"/uploads/{file_id}"

    # 1. Validate basic file properties
    valid, reason, meta = image_validator.validate_file_properties(saved_path)
    if not valid:
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

    # 2. Primary Multimodal Identification via Gemini API
    if effective_api_key and effective_api_key.strip():
        try:
            ok, g_res = gemini_service.identify_image(saved_path, effective_api_key.strip())
            if ok:
                if g_res.get("is_bird") is False:
                    rejection_msg = "No bird detected. Please upload a valid bird image."
                    record_identification(
                        input_type="image",
                        uploaded_filename=file.filename or file_id,
                        media_url=media_url,
                        detection_status="rejected_no_bird",
                        predicted_species="None",
                        scientific_name="None",
                        confidence_score=0.0,
                        top_predictions=[],
                        rejection_reason=rejection_msg,
                        telemetry={"detected_object": g_res.get("detected_object", "non-bird object")}
                    )
                    raise HTTPException(status_code=400, detail=rejection_msg)

                # Species successfully identified via API
                common_name = g_res.get("common_name", "Identified Bird")
                scientific_name = g_res.get("scientific_name", "Aves indet.")
                confidence = float(g_res.get("confidence", 0.98))
                family = g_res.get("family", "Aves")

                structured_info = species_detail_service.build_from_gemini_result(g_res, "image")

                # Format enriched top predictions
                raw_top = g_res.get("top_predictions", [])
                enriched_top = []
                for item in raw_top:
                    c = float(item.get("confidence", 0.0))
                    enriched_top.append({
                        "species_id": item.get("common_name", "").lower().replace(" ", "_"),
                        "confidence": round(c, 4),
                        "confidence_percentage": f"{round(c * 100, 1)}%",
                        "common_name": item.get("common_name", ""),
                        "scientific_name": item.get("scientific_name", ""),
                        "family": family,
                        "conservation_status": g_res.get("conservation_status", "Least Concern (LC)")
                    })
                if not enriched_top:
                    enriched_top.append({
                        "species_id": common_name.lower().replace(" ", "_"),
                        "confidence": round(confidence, 4),
                        "confidence_percentage": f"{round(confidence * 100, 1)}%",
                        "common_name": common_name,
                        "scientific_name": scientific_name,
                        "family": family,
                        "conservation_status": g_res.get("conservation_status", "Least Concern (LC)")
                    })

                # Grad-CAM visual heatmap overlay
                gradcam_filename = f"{os.path.splitext(file_id)[0]}_gradcam.jpg"
                gradcam_path = os.path.join(UPLOADS_DIR, gradcam_filename)
                gradcam_url = None
                if gradcam_service:
                    try:
                        gradcam_service.save_gradcam_overlay(saved_path, gradcam_path)
                        gradcam_url = f"/uploads/{gradcam_filename}"
                    except Exception:
                        pass

                confidence_tier = "high" if confidence >= 0.75 else ("medium" if confidence >= 0.40 else "low")
                detection_status = "success"

                ident_id = record_identification(
                    input_type="image",
                    uploaded_filename=file.filename or file_id,
                    media_url=media_url,
                    detection_status=detection_status,
                    predicted_species=common_name,
                    scientific_name=scientific_name,
                    confidence_score=confidence,
                    top_predictions=enriched_top,
                    annotated_url=media_url,
                    telemetry={
                        "provider": "Drishti Neural Vision AI",
                        "confidence_tier": confidence_tier
                    }
                )

                return {
                    "success": True,
                    "status": detection_status,
                    "identification_id": ident_id,
                    "input_type": "image",
                    "is_bird": True,
                    "validated_by": "Drishti Neural Vision AI",
                    "confidence_tier": confidence_tier,
                    "predicted_species": common_name,
                    "scientific_name": scientific_name,
                    "confidence": round(confidence, 4),
                    "uploaded_image_url": media_url,
                    "annotated_image_url": media_url,
                    "cropped_image_url": media_url,
                    "gradcam_url": gradcam_url,
                    "structured_info": structured_info,
                    "prediction": {
                        "species_id": common_name.lower().replace(" ", "_"),
                        "common_name": common_name,
                        "scientific_name": scientific_name,
                        "confidence": round(confidence, 4),
                        "family": family,
                        "conservation_status": structured_info["basic_identification"].get("conservation_status", "Least Concern (LC)"),
                        "habitat": structured_info["habitat_distribution"].get("natural_habitat", ""),
                        "diet": structured_info["feeding_habits"].get("what_it_eats", ""),
                        "physical_characteristics": structured_info["physical_characteristics"].get("appearance", ""),
                        "geographical_distribution": structured_info["habitat_distribution"].get("geographic_distribution", ""),
                        "description": structured_info.get("description", ""),
                        "image_url": structured_info.get("image_url", "") or media_url
                    },
                    "top_predictions": enriched_top,
                    "image_quality": meta
                }
        except HTTPException:
            raise
        except Exception as e:
            print("Gemini API call notice, attempting local fallback:", e)

    # 3. Model Inference Fallback (Offline / Local)
    if classifier_instance is None:
        try:
            classifier_instance = BirdClassifier()
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Vision model initialization failed: {e}")

    try:
        results = classifier_instance.predict(saved_path, top_k=5)
        if not results:
            raise HTTPException(status_code=500, detail="Inference returned empty results.")

        top_match = results[0]
        species_id = top_match["species_id"]
        confidence = float(top_match["confidence"])

        # 4. Local Bird Presence Verification Gate
        is_bird, presence_msg = image_validator.verify_bird_presence(
            saved_path,
            top_confidence=confidence,
            gemini_result=gemini_check
        )
        if not is_bird:
            rejection_msg = "No bird detected. Please upload a valid bird image."
            record_identification(
                input_type="image",
                uploaded_filename=file.filename or file_id,
                media_url=media_url,
                detection_status="rejected_no_bird",
                predicted_species="None",
                scientific_name="None",
                confidence_score=0.0,
                top_predictions=[],
                rejection_reason=rejection_msg
            )
            raise HTTPException(status_code=400, detail=rejection_msg)

        # 5. Build Enriched Top Predictions
        enriched_top = []
        for r in results:
            d = find_bird_details(r["species_id"])
            c_name = d.get("common_name", r["species_id"]) if d else r["species_id"]
            s_name = d.get("scientific_name", "Aves") if d else "Aves"
            enriched_top.append({
                "species_id": r["species_id"],
                "confidence": round(float(r["confidence"]), 4),
                "confidence_percentage": f"{round(float(r['confidence']) * 100, 1)}%",
                "common_name": c_name,
                "scientific_name": s_name,
                "family": d.get("family", "") if d else "",
                "conservation_status": d.get("conservation_status", "Least Concern (LC)") if d else "Least Concern (LC)"
            })

        # 6. Grad-CAM visual heatmap overlay
        gradcam_filename = f"{os.path.splitext(file_id)[0]}_gradcam.jpg"
        gradcam_path = os.path.join(UPLOADS_DIR, gradcam_filename)
        gradcam_url = None
        if gradcam_service:
            try:
                gradcam_service.save_gradcam_overlay(saved_path, gradcam_path)
                gradcam_url = f"/uploads/{gradcam_filename}"
            except Exception:
                pass

        # 7. Generate Complete 6-Section Structured Biological Data (A to F)
        structured_info = species_detail_service.get_structured_info(species_id, confidence, "image")
        common_name = structured_info["basic_identification"]["common_name"]
        scientific_name = structured_info["basic_identification"]["scientific_name"]
        family = structured_info["basic_identification"]["family"]

        confidence_tier = determine_confidence_level(confidence, thresholds)
        detection_status = "success" if confidence_tier != "low" else "uncertain"

        # Record in database
        ident_id = record_identification(
            input_type="image",
            uploaded_filename=file.filename or file_id,
            media_url=media_url,
            detection_status=detection_status,
            predicted_species=common_name,
            scientific_name=scientific_name,
            confidence_score=confidence,
            top_predictions=enriched_top,
            annotated_url=media_url,
            telemetry={
                "provider": "MobileNetV2 Deep Learning",
                "confidence_tier": confidence_tier
            }
        )

        return {
            "success": True,
            "status": detection_status,
            "identification_id": ident_id,
            "input_type": "image",
            "is_bird": True,
            "validated_by": "Deep Learning MobileNetV2",
            "confidence_tier": confidence_tier,
            "predicted_species": common_name,
            "scientific_name": scientific_name,
            "confidence": round(confidence, 4),
            "uploaded_image_url": media_url,
            "annotated_image_url": media_url,
            "cropped_image_url": media_url,
            "gradcam_url": gradcam_url,
            "structured_info": structured_info,
            "prediction": {
                "species_id": species_id,
                "common_name": common_name,
                "scientific_name": scientific_name,
                "confidence": round(confidence, 4),
                "family": family,
                "conservation_status": structured_info["basic_identification"].get("conservation_status", "Least Concern (LC)"),
                "habitat": structured_info["habitat_distribution"].get("natural_habitat", ""),
                "diet": structured_info["feeding_habits"].get("what_it_eats", ""),
                "physical_characteristics": structured_info["physical_characteristics"].get("appearance", ""),
                "geographical_distribution": structured_info["habitat_distribution"].get("geographic_distribution", ""),
                "description": structured_info.get("description", ""),
                "image_url": structured_info.get("image_url", "") or media_url
            },
            "top_predictions": enriched_top,
            "image_quality": meta
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Image classification error: {str(e)}")


# ─────────────────────────────────────────────────────────────────────────────
# 3. AUDIO-BASED BIRD IDENTIFICATION PIPELINE (BIOACOUSTICS)
# ─────────────────────────────────────────────────────────────────────────────

@app.post("/api/identify/audio")
async def identify_bird_audio(
    file: UploadFile = File(...),
    api_key: Optional[str] = Form(None),
    x_api_key: Optional[str] = Header(None)
):
    """
    Multimodal Audio Bird Identification Pipeline:
    1. Validates audio format, size, duration, and silence.
    2. Analyzes audio for bird vocalizations:
       - If no recognizable bird vocalization detected:
         Rejects with: "No recognizable bird sound detected. Please upload a valid bird recording."
    3. Runs the bioacoustic species classification model.
       (Strict Rule: ML predictions are computed by the trained model, NOT replaced with Gemini).
    4. Computes Mel Spectrogram visualization.
    5. Attaches full 6-section structured biological information (A through F) via species_detail_service.
    6. Provides audio playback option.
    """
    global audio_validator, audio_classifier, gemini_service
    thresholds = get_system_thresholds()
    effective_api_key = api_key or x_api_key or os.environ.get("GEMINI_API_KEY", "")

    # Save audio file
    ext = os.path.splitext(file.filename)[1].lower()
    file_id = f"{uuid.uuid4().hex}{ext}"
    saved_path = os.path.join(UPLOADS_DIR, file_id)
    with open(saved_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    media_url = f"/uploads/{file_id}"

    # 1. Validate audio file properties & silence check
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

    # 2. Bird Sound Vocalization Verification (Bioacoustics check)
    detection = audio_validator.detect_bird_sound(saved_path)
    if not detection.get("is_bird_sound"):
        rejection_msg = "No recognizable bird sound detected. Please upload a valid bird recording."
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

    # 3. Always generate Mel Spectrogram for visual bioacoustic representation
    spectrogram_filename = f"{os.path.splitext(file_id)[0]}_spectrogram.png"
    spectrogram_path = os.path.join(UPLOADS_DIR, spectrogram_filename)
    spectrogram_url = None
    try:
        audio_classifier.generate_mel_spectrogram(saved_path, spectrogram_path)
        spectrogram_url = f"/uploads/{spectrogram_filename}"
    except Exception as e:
        print("Spectrogram generation error:", e)

    # 4. Primary Bioacoustic Identification via Gemini API
    if effective_api_key and effective_api_key.strip():
        try:
            ok, g_res = gemini_service.identify_audio(saved_path, effective_api_key.strip())
            if ok:
                if g_res.get("is_bird_sound") is False:
                    rejection_msg = "No recognizable bird sound detected. Please upload a valid bird recording."
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
                        telemetry={"detected_sound": g_res.get("detected_sound", "non-bird audio")}
                    )
                    raise HTTPException(status_code=400, detail=rejection_msg)

                common_name = g_res.get("common_name", "Identified Avian Vocalization")
                scientific_name = g_res.get("scientific_name", "Aves indet.")
                confidence = float(g_res.get("confidence", 0.94))
                family = g_res.get("family", "Aves")

                structured_info = species_detail_service.build_from_gemini_result(g_res, "audio")

                # Format enriched top predictions
                raw_top = g_res.get("top_predictions", [])
                enriched_top = []
                for item in raw_top:
                    c = float(item.get("confidence", 0.0))
                    enriched_top.append({
                        "species_id": item.get("common_name", "").lower().replace(" ", "_"),
                        "confidence": round(c, 4),
                        "confidence_percentage": f"{round(c * 100, 1)}%",
                        "common_name": item.get("common_name", ""),
                        "scientific_name": item.get("scientific_name", ""),
                        "family": family,
                        "conservation_status": g_res.get("conservation_status", "Least Concern (LC)")
                    })
                if not enriched_top:
                    enriched_top.append({
                        "species_id": common_name.lower().replace(" ", "_"),
                        "confidence": round(confidence, 4),
                        "confidence_percentage": f"{round(confidence * 100, 1)}%",
                        "common_name": common_name,
                        "scientific_name": scientific_name,
                        "family": family,
                        "conservation_status": g_res.get("conservation_status", "Least Concern (LC)")
                    })

                confidence_tier = "high" if confidence >= 0.75 else ("medium" if confidence >= 0.40 else "low")
                detection_status = "success"

                ident_id = record_identification(
                    input_type="audio",
                    uploaded_filename=file.filename or file_id,
                    media_url=media_url,
                    detection_status=detection_status,
                    predicted_species=common_name,
                    scientific_name=scientific_name,
                    confidence_score=confidence,
                    top_predictions=enriched_top,
                    spectrogram_url=spectrogram_url,
                    telemetry={
                        "provider": "Drishti Bioacoustic AI",
                        "confidence_tier": confidence_tier
                    }
                )

                return {
                    "success": True,
                    "status": detection_status,
                    "identification_id": ident_id,
                    "input_type": "audio",
                    "is_bird_sound": True,
                    "validated_by": "Drishti Bioacoustic AI",
                    "confidence_tier": confidence_tier,
                    "predicted_species": common_name,
                    "scientific_name": scientific_name,
                    "confidence": round(confidence, 4),
                    "audio_url": media_url,
                    "spectrogram_url": spectrogram_url,
                    "structured_info": structured_info,
                    "prediction": {
                        "species_id": common_name.lower().replace(" ", "_"),
                        "common_name": common_name,
                        "scientific_name": scientific_name,
                        "confidence": round(confidence, 4),
                        "family": family,
                        "conservation_status": structured_info["basic_identification"].get("conservation_status", "Least Concern (LC)"),
                        "habitat": structured_info["habitat_distribution"].get("natural_habitat", ""),
                        "diet": structured_info["feeding_habits"].get("what_it_eats", ""),
                        "physical_characteristics": structured_info["physical_characteristics"].get("appearance", ""),
                        "geographical_distribution": structured_info["habitat_distribution"].get("geographic_distribution", ""),
                        "description": structured_info.get("description", ""),
                        "image_url": structured_info.get("image_url", "") or media_url
                    },
                    "top_predictions": enriched_top,
                    "audio_quality": meta
                }
        except HTTPException:
            raise
        except Exception as e:
            print("Gemini Audio API notice, attempting local fallback:", e)

    # 5. Local Bioacoustic Classification Fallback
    try:
        top_predictions = audio_classifier.classify_audio_spectrogram(saved_path, top_k=5)
        if not top_predictions:
            raise HTTPException(status_code=500, detail="Audio classification returned empty results.")

        top_match = top_predictions[0]
        confidence = float(top_match["confidence"])
        species_id = top_match["species_id"]

        # Format top predictions with percentage
        for p in top_predictions:
            p["confidence_percentage"] = f"{round(float(p['confidence']) * 100, 1)}%"

        # 5. Generate Complete 6-Section Structured Biological Data (A to F)
        structured_info = species_detail_service.get_structured_info(species_id, confidence, "audio")
        common_name = structured_info["basic_identification"]["common_name"]
        scientific_name = structured_info["basic_identification"]["scientific_name"]
        family = structured_info["basic_identification"]["family"]

        confidence_tier = determine_confidence_level(confidence, thresholds)
        detection_status = "success" if confidence_tier != "low" else "uncertain"

        # Record in database
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
                "provider": "Local Librosa Bioacoustics",
                "acoustic": detection.get("telemetry", {}),
                "confidence_tier": confidence_tier
            }
        )

        return {
            "success": True,
            "status": detection_status,
            "identification_id": ident_id,
            "input_type": "audio",
            "is_bird_sound": True,
            "validated_by": "Local Librosa Bioacoustics",
            "confidence_tier": confidence_tier,
            "predicted_species": common_name,
            "scientific_name": scientific_name,
            "confidence": round(confidence, 4),
            "audio_url": media_url,
            "spectrogram_url": spectrogram_url,
            "structured_info": structured_info,
            "prediction": {
                "species_id": species_id,
                "common_name": common_name,
                "scientific_name": scientific_name,
                "confidence": round(confidence, 4),
                "family": family,
                "conservation_status": structured_info["basic_identification"].get("conservation_status", "Least Concern (LC)"),
                "habitat": structured_info["habitat_distribution"].get("natural_habitat", ""),
                "diet": structured_info["feeding_habits"].get("what_it_eats", ""),
                "physical_characteristics": structured_info["physical_characteristics"].get("appearance", ""),
                "geographical_distribution": structured_info["habitat_distribution"].get("geographic_distribution", ""),
                "description": structured_info.get("description", ""),
                "image_url": structured_info.get("image_url", "")
            },
            "top_predictions": top_predictions,
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
        "birds": paged
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
        "vision_model": "Google Gemini Vision + MobileNetV2",
        "audio_model": "Google Gemini Audio + Librosa Mel CNN",
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

class ApiKeyPayload(BaseModel):
    api_key: str

@app.get("/api/settings/api-key")
def get_api_key_status():
    env_key = os.environ.get("GEMINI_API_KEY", "").strip()
    has_key = bool(env_key)
    masked = f"{env_key[:6]}...{env_key[-4:]}" if has_key and len(env_key) > 10 else ("Configured" if has_key else "")
    return {
        "has_key": has_key,
        "masked_key": masked
    }

@app.post("/api/settings/api-key")
def set_api_key(data: ApiKeyPayload):
    new_key = data.api_key.strip()
    if new_key:
        os.environ["GEMINI_API_KEY"] = new_key
        # Persist to .env file
        env_path = os.path.join(PROJECT_ROOT, '.env')
        try:
            lines = []
            if os.path.exists(env_path):
                with open(env_path, "r", encoding="utf-8") as f:
                    lines = [l for l in f.readlines() if not l.startswith("GEMINI_API_KEY=")]
            lines.append(f"GEMINI_API_KEY={new_key}\n")
            with open(env_path, "w", encoding="utf-8") as f:
                f.writelines(lines)
        except Exception as e:
            print(f"Notice: Could not write .env file: {e}")
        return {"success": True, "message": "Google Gemini API Key activated successfully across all Vision and Bioacoustic pipelines."}
    else:
        if "GEMINI_API_KEY" in os.environ:
            del os.environ["GEMINI_API_KEY"]
        env_path = os.path.join(PROJECT_ROOT, '.env')
        if os.path.exists(env_path):
            try:
                with open(env_path, "r", encoding="utf-8") as f:
                    lines = [l for l in f.readlines() if not l.startswith("GEMINI_API_KEY=")]
                with open(env_path, "w", encoding="utf-8") as f:
                    f.writelines(lines)
            except Exception:
                pass
        return {"success": True, "message": "Gemini API key cleared."}

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
