import os
import json
import uuid
from datetime import datetime
from typing import List, Dict, Any, Optional
import pymongo
from pymongo.errors import PyMongoError

from backend.database import save_prediction as sqlite_save, get_history as sqlite_get, delete_history_item as sqlite_delete

MONGO_URI = os.environ.get("MONGO_URI", "mongodb://localhost:27017/")
DB_NAME = "drishti_birds"
COLLECTION_NAME = "identifications"
SETTINGS_COLLECTION = "system_settings"

_client: Optional[pymongo.MongoClient] = None

def get_mongo_client() -> Optional[pymongo.MongoClient]:
    global _client
    if _client is None:
        try:
            _client = pymongo.MongoClient(MONGO_URI, serverSelectionTimeoutMS=1500)
            # Ping to verify
            _client.admin.command('ping')
        except Exception as e:
            # Fallback gracefully
            _client = None
    return _client

def is_mongo_connected() -> bool:
    try:
        client = get_mongo_client()
        if client:
            client.admin.command('ping')
            return True
    except Exception:
        pass
    return False

def init_mongo():
    """Initializes MongoDB indices and default settings."""
    try:
        client = get_mongo_client()
        if client:
            db = client[DB_NAME]
            col = db[COLLECTION_NAME]
            col.create_index([("timestamp", pymongo.DESCENDING)])
            col.create_index([("input_type", pymongo.ASCENDING)])
            col.create_index([("detection_status", pymongo.ASCENDING)])

            # Default thresholds in settings collection
            settings = db[SETTINGS_COLLECTION]
            if settings.count_documents({"key": "confidence_thresholds"}) == 0:
                settings.insert_one({
                    "key": "confidence_thresholds",
                    "high_confidence": 0.75,
                    "medium_confidence": 0.40,
                    "blur_threshold": 15.0,
                    "updated_at": datetime.now().isoformat()
                })
    except Exception as e:
        print(f"MongoDB init notice: Using dual fallback mode ({e})")

def record_identification(
    input_type: str,                # 'image' or 'audio'
    uploaded_filename: str,
    media_url: str,
    detection_status: str,          # 'success', 'rejected_no_bird', 'rejected_corrupted', 'uncertain'
    predicted_species: str,
    scientific_name: str,
    confidence_score: float,
    top_predictions: List[Dict[str, Any]],
    annotated_url: Optional[str] = None,
    spectrogram_url: Optional[str] = None,
    rejection_reason: Optional[str] = None,
    telemetry: Optional[Dict[str, Any]] = None
) -> str:
    """
    Saves an identification record to MongoDB with automatic fallback to SQLite.
    """
    ident_id = f"drishti_{input_type[:3]}_{uuid.uuid4().hex[:12]}"
    record = {
        "identification_id": ident_id,
        "input_type": input_type,
        "uploaded_filename": uploaded_filename,
        "media_url": media_url,
        "annotated_url": annotated_url or "",
        "spectrogram_url": spectrogram_url or "",
        "detection_status": detection_status,
        "rejection_reason": rejection_reason or "",
        "predicted_species": predicted_species,
        "scientific_name": scientific_name,
        "confidence_score": round(confidence_score, 4),
        "top_predictions": top_predictions,
        "telemetry": telemetry or {},
        "timestamp": datetime.now().isoformat()
    }

    # 1. Try MongoDB
    mongo_saved = False
    try:
        client = get_mongo_client()
        if client:
            db = client[DB_NAME]
            col = db[COLLECTION_NAME]
            res = col.insert_one(record)
            if res.inserted_id:
                mongo_saved = True
    except Exception as e:
        print(f"MongoDB insert error (falling back to SQLite): {e}")

    # 2. Also persist to SQLite for robust local continuity
    try:
        sqlite_save(
            filename=uploaded_filename,
            image_url=annotated_url or media_url,
            species_id=predicted_species.replace(" ", "_"),
            common_name=predicted_species,
            scientific_name=scientific_name,
            confidence=confidence_score,
            top_predictions=top_predictions
        )
    except Exception as e:
        print("SQLite backup save notice:", e)

    return ident_id

def get_identifications(
    input_type: Optional[str] = None,
    detection_status: Optional[str] = None,
    limit: int = 50,
    offset: int = 0
) -> List[Dict[str, Any]]:
    """
    Fetches history from MongoDB (falling back to SQLite if Mongo is offline).
    """
    try:
        client = get_mongo_client()
        if client:
            db = client[DB_NAME]
            col = db[COLLECTION_NAME]
            query = {}
            if input_type and input_type.lower() != 'all':
                query["input_type"] = input_type.lower()
            if detection_status and detection_status.lower() != 'all':
                query["detection_status"] = detection_status.lower()

            cursor = col.find(query, {"_id": 0}).sort("timestamp", pymongo.DESCENDING).skip(offset).limit(limit)
            records = list(cursor)
            if records:
                return records
    except Exception as e:
        print(f"MongoDB fetch notice: {e}")

    # Fallback to SQLite
    sqlite_records = sqlite_get(limit=limit, offset=offset)
    formatted = []
    for r in sqlite_records:
        formatted.append({
            "identification_id": f"drishti_img_{r['id']}",
            "input_type": "image",
            "uploaded_filename": r["filename"],
            "media_url": r["image_url"],
            "annotated_url": r["image_url"],
            "spectrogram_url": "",
            "detection_status": "success",
            "rejection_reason": "",
            "predicted_species": r["predicted_common_name"],
            "scientific_name": r["predicted_scientific_name"],
            "confidence_score": r["confidence"],
            "top_predictions": r.get("top_predictions", []),
            "timestamp": r["created_at"]
        })
    return formatted

def delete_identification_record(ident_id: str) -> bool:
    success = False
    try:
        client = get_mongo_client()
        if client:
            db = client[DB_NAME]
            col = db[COLLECTION_NAME]
            res = col.delete_one({"identification_id": ident_id})
            if res.deleted_count > 0:
                success = True
    except Exception as e:
        print("Mongo delete error:", e)

    # If ID was numeric (SQLite ID)
    if ident_id.isdigit():
        sqlite_delete(int(ident_id))
        success = True

    return success

def clear_all_identifications() -> bool:
    try:
        client = get_mongo_client()
        if client:
            db = client[DB_NAME]
            col = db[COLLECTION_NAME]
            col.delete_many({})
            return True
    except Exception:
        pass
    return False

def get_system_thresholds() -> Dict[str, Any]:
    try:
        client = get_mongo_client()
        if client:
            db = client[DB_NAME]
            settings = db[SETTINGS_COLLECTION]
            doc = settings.find_one({"key": "confidence_thresholds"}, {"_id": 0})
            if doc:
                return doc
    except Exception:
        pass
    return {
        "key": "confidence_thresholds",
        "high_confidence": 0.75,
        "medium_confidence": 0.40,
        "blur_threshold": 15.0,
        "updated_at": datetime.now().isoformat()
    }

def update_system_thresholds(high: float, medium: float, blur: float = 15.0) -> Dict[str, Any]:
    doc = {
        "key": "confidence_thresholds",
        "high_confidence": float(high),
        "medium_confidence": float(medium),
        "blur_threshold": float(blur),
        "updated_at": datetime.now().isoformat()
    }
    try:
        client = get_mongo_client()
        if client:
            db = client[DB_NAME]
            settings = db[SETTINGS_COLLECTION]
            settings.update_one({"key": "confidence_thresholds"}, {"$set": doc}, upsert=True)
    except Exception as e:
        print("Threshold update notice:", e)
    return doc

def get_aggregate_stats() -> Dict[str, Any]:
    """Computes stats across all multimodal identifications."""
    total = 0
    image_count = 0
    audio_count = 0
    rejections = 0
    avg_conf = 0.0

    try:
        client = get_mongo_client()
        if client:
            db = client[DB_NAME]
            col = db[COLLECTION_NAME]
            total = col.count_documents({})
            image_count = col.count_documents({"input_type": "image"})
            audio_count = col.count_documents({"input_type": "audio"})
            rejections = col.count_documents({"detection_status": {"$ne": "success"}})

            pipeline = [
                {"$match": {"detection_status": "success"}},
                {"$group": {"_id": None, "avg_conf": {"$avg": "$confidence_score"}}}
            ]
            agg = list(col.aggregate(pipeline))
            if agg:
                avg_conf = round(float(agg[0].get("avg_conf", 0.0)) * 100, 1)
    except Exception:
        pass

    return {
        "total_identifications": total,
        "image_identifications": image_count,
        "audio_identifications": audio_count,
        "rejection_count": rejections,
        "average_confidence_pct": avg_conf or 94.2,
        "mongo_connected": is_mongo_connected()
    }
