import sqlite3
import os
import json
from datetime import datetime

DB_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'data')
os.makedirs(DB_DIR, exist_ok=True)
DB_PATH = os.path.join(DB_DIR, 'history.db')

def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS classification_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            filename TEXT NOT NULL,
            image_url TEXT NOT NULL,
            predicted_species_id TEXT NOT NULL,
            predicted_common_name TEXT NOT NULL,
            predicted_scientific_name TEXT,
            confidence REAL NOT NULL,
            top_predictions_json TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    conn.commit()
    conn.close()

def save_prediction(filename: str, image_url: str, species_id: str, common_name: str, 
                    scientific_name: str, confidence: float, top_predictions: list):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO classification_history 
        (filename, image_url, predicted_species_id, predicted_common_name, predicted_scientific_name, confidence, top_predictions_json, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        filename,
        image_url,
        species_id,
        common_name,
        scientific_name,
        confidence,
        json.dumps(top_predictions),
        datetime.now().isoformat()
    ))
    record_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return record_id

def get_history(limit: int = 50, offset: int = 0):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT * FROM classification_history 
        ORDER BY id DESC 
        LIMIT ? OFFSET ?
    """, (limit, offset))
    rows = cursor.fetchall()
    
    result = []
    for r in rows:
        result.append({
            "id": r["id"],
            "filename": r["filename"],
            "image_url": r["image_url"],
            "predicted_species_id": r["predicted_species_id"],
            "predicted_common_name": r["predicted_common_name"],
            "predicted_scientific_name": r["predicted_scientific_name"],
            "confidence": r["confidence"],
            "top_predictions": json.loads(r["top_predictions_json"]),
            "created_at": r["created_at"]
        })
    conn.close()
    return result

def delete_history_item(history_id: int):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT filename FROM classification_history WHERE id = ?", (history_id,))
    row = cursor.fetchone()
    if row:
        cursor.execute("DELETE FROM classification_history WHERE id = ?", (history_id,))
        conn.commit()
    conn.close()
    return bool(row)

def clear_all_history():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM classification_history")
    conn.commit()
    conn.close()

def get_stats():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT COUNT(*), AVG(confidence) FROM classification_history")
    total, avg_conf = cursor.fetchone()
    
    cursor.execute("""
        SELECT predicted_common_name, COUNT(*) as cnt 
        FROM classification_history 
        GROUP BY predicted_common_name 
        ORDER BY cnt DESC LIMIT 1
    """)
    most_common = cursor.fetchone()
    
    conn.close()
    return {
        "total_classifications": total or 0,
        "avg_confidence": round((avg_conf or 0) * 100, 1),
        "most_identified": most_common[0] if most_common else "None yet",
        "supported_species_count": 100
    }

def create_user(name: str, email: str, password_hash: str):
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            INSERT INTO users (name, email, password_hash, created_at)
            VALUES (?, ?, ?, ?)
        """, (name, email.lower().strip(), password_hash, datetime.now().isoformat()))
        user_id = cursor.lastrowid
        conn.commit()
        return {"id": user_id, "name": name, "email": email.lower().strip()}
    except sqlite3.IntegrityError:
        return None
    finally:
        conn.close()

def get_user_by_email(email: str):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id, name, email, password_hash, created_at FROM users WHERE email = ?", (email.lower().strip(),))
    row = cursor.fetchone()
    conn.close()
    if row:
        return {
            "id": row["id"],
            "name": row["name"],
            "email": row["email"],
            "password_hash": row["password_hash"],
            "created_at": row["created_at"]
        }
    return None

def get_user_by_id(user_id: int):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id, name, email, created_at FROM users WHERE id = ?", (user_id,))
    row = cursor.fetchone()
    conn.close()
    if row:
        return {
            "id": row["id"],
            "name": row["name"],
            "email": row["email"],
            "created_at": row["created_at"]
        }
    return None
