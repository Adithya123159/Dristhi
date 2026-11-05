import os
import sys
import numpy as np
import cv2
import soundfile as sf

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

os.environ.setdefault("KERAS_HOME", os.path.join(PROJECT_ROOT, '.keras'))
os.environ.setdefault("YOLO_CONFIG_DIR", os.path.join(PROJECT_ROOT, '.yolo'))
os.environ.setdefault("MPLCONFIGDIR", os.path.join(PROJECT_ROOT, '.matplotlib'))

from backend.validation_service import ImageValidationService
from backend.audio_service import AudioValidationService, AudioClassificationService
from backend.mongo_db import init_mongo, record_identification, get_identifications, is_mongo_connected
import json

test_dir = os.path.join(PROJECT_ROOT, "tests", "test_assets")
os.makedirs(test_dir, exist_ok=True)

print("=== STARTING MULTIMODAL DRISHTI SYSTEM TESTS ===")

# ─────────────────────────────────────────────────────────────
# 1. DATABASE CONNECTION TEST
# ─────────────────────────────────────────────────────────────
print("\n[TEST 1] Testing Database Connection...")
init_mongo()
mongo_ok = is_mongo_connected()
print(f"MongoDB Active Status: {mongo_ok}")

# ─────────────────────────────────────────────────────────────
# 2. IMAGE PIPELINE TESTS
# ─────────────────────────────────────────────────────────────
print("\n[TEST 2] Testing Image Validation & Bird Detection...")
img_validator = ImageValidationService()

# 2A: Non-Bird Image (Black rectangle / random noise - no bird)
non_bird_img_path = os.path.join(test_dir, "non_bird_blank.jpg")
cv2.imwrite(non_bird_img_path, np.zeros((300, 300, 3), dtype=np.uint8))

prop_ok, reason, meta = img_validator.validate_file_properties(non_bird_img_path)
print(f"2A Property Check (Blank Image): valid={prop_ok}, reason={reason}")

detection = img_validator.detect_birds(non_bird_img_path)
print(f"2A Bird Detection (Blank Image): is_bird={detection['is_bird']}")
assert detection['is_bird'] is False, "Error: Blank image should NOT be detected as a bird!"
print(">>> PASS: Non-bird image correctly rejected.")

# 2B: Real Bird Image from data/raw if available
raw_data_dir = os.path.join(PROJECT_ROOT, "data", "raw")
sample_bird_path = None
if os.path.exists(raw_data_dir):
    for sub in os.listdir(raw_data_dir):
        sub_p = os.path.join(raw_data_dir, sub)
        if os.path.isdir(sub_p):
            for f in os.listdir(sub_p):
                if f.lower().endswith(('.jpg', '.jpeg', '.png')):
                    sample_bird_path = os.path.join(sub_p, f)
                    break
        if sample_bird_path: break

if sample_bird_path:
    print(f"2B Testing with available sample image: {os.path.basename(sample_bird_path)}")
    bird_detect = img_validator.detect_birds(sample_bird_path)
    print(f"2B Detection on sample image: is_bird={bird_detect.get('is_bird')}, bird_count={bird_detect.get('bird_count', 0)}")
    print(">>> PASS: Bird detection pipeline completed on sample image.")

# ─────────────────────────────────────────────────────────────
# 3. AUDIO PIPELINE TESTS
# ─────────────────────────────────────────────────────────────
print("\n[TEST 3] Testing Audio Validation & Bioacoustic Detection...")
audio_validator = AudioValidationService()

with open(os.path.join(PROJECT_ROOT, "app", "bird_info.json"), "r", encoding="utf-8") as f:
    birds_data = json.load(f)
audio_classifier = AudioClassificationService(species_database=birds_data)

# 3A: Silent Audio Recording (should be rejected)
silent_audio_path = os.path.join(test_dir, "silent_test.wav")
sr = 22050
duration = 3.0
silent_signal = np.zeros(int(sr * duration), dtype=np.float32)
sf.write(silent_audio_path, silent_signal, sr)

v_ok, v_reason, v_meta = audio_validator.validate_file(silent_audio_path)
print(f"3A Silence Check: valid={v_ok}, reason={v_reason}")
assert v_ok is False, "Error: Silent audio was not rejected!"
print(">>> PASS: Silent audio correctly rejected.")

# 3B: Non-Bird Audio (Low-frequency 200 Hz rumble / engine sound)
rumble_audio_path = os.path.join(test_dir, "rumble_200hz.wav")
t = np.linspace(0, duration, int(sr * duration), endpoint=False)
rumble_signal = 0.5 * np.sin(2 * np.pi * 200 * t).astype(np.float32)
sf.write(rumble_audio_path, rumble_signal, sr)

v_ok, _, _ = audio_validator.validate_file(rumble_audio_path)
detection_rumble = audio_validator.detect_bird_sound(rumble_audio_path)
print(f"3B Low Rumble Detection: is_bird_sound={detection_rumble.get('is_bird_sound')}, reason={detection_rumble.get('rejection_message', '')[:60]}...")
assert detection_rumble.get('is_bird_sound') is False, "Error: Low frequency rumble should NOT be detected as bird sound!"
print(">>> PASS: Non-bird low rumble correctly rejected.")

# 3C: Avian Chirp Audio (Synthetic frequency-modulated sweep: 3 kHz to 6 kHz chirps)
bird_chirp_path = os.path.join(test_dir, "synthetic_bird_chirp.wav")
chirp_signal = np.zeros(int(sr * duration), dtype=np.float32)
# Add 4 bird chirp bursts
for start_t in [0.5, 1.2, 1.9, 2.5]:
    start_idx = int(start_t * sr)
    chirp_len = int(0.25 * sr)
    chirp_t = np.linspace(0, 0.25, chirp_len)
    # Frequency sweep from 2500 Hz to 6500 Hz
    sweep_freq = 2500 + 4000 * (chirp_t / 0.25)
    chirp = 0.6 * np.sin(2 * np.pi * sweep_freq * chirp_t) * np.hanning(chirp_len)
    chirp_signal[start_idx:start_idx + chirp_len] += chirp

sf.write(bird_chirp_path, chirp_signal, sr)

v_ok, _, _ = audio_validator.validate_file(bird_chirp_path)
detection_bird = audio_validator.detect_bird_sound(bird_chirp_path)
print(f"3C Avian Chirp Detection: is_bird_sound={detection_bird.get('is_bird_sound')}, centroid={detection_bird.get('telemetry', {}).get('spectral_centroid_hz')} Hz")
assert detection_bird.get('is_bird_sound') is True, "Error: Avian chirp sound was not recognized!"
print(">>> PASS: Avian chirp sound successfully recognized.")

# 3D: Spectrogram generation
spec_out = os.path.join(test_dir, "test_mel_spectrogram.png")
spec_res = audio_classifier.generate_mel_spectrogram(bird_chirp_path, spec_out)
print(f"3D Mel Spectrogram Generated: {os.path.exists(spec_out)}, shape={spec_res['mel_shape']}")
assert os.path.exists(spec_out), "Error: Mel Spectrogram image not generated!"
print(">>> PASS: Mel Spectrogram generated successfully.")

# 3E: Audio classification top-5
top_preds = audio_classifier.classify_audio_spectrogram(bird_chirp_path, top_k=5)
print(f"3E Audio Species Classification: Top candidate: {top_preds[0]['common_name']} ({top_preds[0]['confidence']*100:.1f}%)")
assert len(top_preds) == 5, "Error: Should return top-5 predictions!"
print(">>> PASS: Top-5 audio species classification completed.")

# ─────────────────────────────────────────────────────────────
# 4. MONGODB PERSISTENCE TEST
# ─────────────────────────────────────────────────────────────
print("\n[TEST 4] Testing MongoDB Persistence...")
rec_id = record_identification(
    input_type="audio",
    uploaded_filename="synthetic_bird_chirp.wav",
    media_url="/uploads/synthetic_bird_chirp.wav",
    detection_status="success",
    predicted_species=top_preds[0]["common_name"],
    scientific_name=top_preds[0]["scientific_name"],
    confidence_score=top_preds[0]["confidence"],
    top_predictions=top_preds,
    spectrogram_url="/uploads/test_mel_spectrogram.png"
)
print(f"Recorded ID: {rec_id}")
history = get_identifications(limit=5)
print(f"History records retrieved: {len(history)}")
assert any(h.get("identification_id") == rec_id for h in history), "Error: Recorded identification not found in history!"
print(">>> PASS: Multimodal history persistence verified.")

print("\n=== ALL SYSTEM TESTS PASSED SUCCESSFULLY! ===")
