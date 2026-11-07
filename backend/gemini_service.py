import os
import json
import base64
import requests
from typing import Dict, Any, Optional, Tuple

class GeminiMultimodalService:
    """
    Google Gemini Multimodal AI Service for Avian Species Identification.
    Supports:
    1. Bird Image Identification (Vision)
    2. Bird Voice / Audio Identification (Bioacoustics)
    Enforces strict bird vs non-bird validation.
    """

    SUPPORTED_MODELS = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash"]

    @staticmethod
    def _clean_json_response(raw_text: str) -> str:
        """Strips markdown code blocks from model JSON output."""
        text = raw_text.strip()
        if text.startswith("```json"):
            text = text[7:]
        elif text.startswith("```"):
            text = text[3:]
        if text.endswith("```"):
            text = text[:-3]
        return text.strip()

    def identify_image(self, image_path: str, api_key: str) -> Tuple[bool, Dict[str, Any]]:
        """
        Analyzes bird photograph using Google Gemini Vision.
        Returns: (success: bool, result_or_error_dict)
        """
        if not api_key or not api_key.strip():
            return False, {"error": "No API key provided."}

        ext = os.path.splitext(image_path)[1].lower()
        mime_type = "image/jpeg"
        if ext == ".png":
            mime_type = "image/png"
        elif ext == ".webp":
            mime_type = "image/webp"

        try:
            with open(image_path, "rb") as f:
                b64_data = base64.b64encode(f.read()).decode("utf-8")
        except Exception as e:
            return False, {"error": f"Failed to read image file: {e}"}

        prompt = (
            "You are an expert avian biologist and ornithological computer vision classifier.\n"
            "Analyze this uploaded photograph with extreme scientific accuracy:\n\n"
            "STEP 1: STRICT OBJECT VALIDATION\n"
            "- Does this image clearly show a live, wild, or captive bird? (Return is_bird: true ONLY if a bird is clearly visible).\n"
            "- If the image contains a human/person, dog, cat, car, vehicle, phone, building, furniture, landscape without birds, "
            "or ANY non-bird object, you MUST set is_bird to false and describe what is actually present in 'detected_object' (e.g. 'sports car', 'person portrait', 'golden retriever').\n\n"
            "STEP 2: SPECIES CLASSIFICATION\n"
            "- If is_bird is true, identify the bird species accurately (especially prioritizing native and resident birds of India and South Asia if applicable).\n"
            "- Provide common name, scientific binomial nomenclature, calibrated confidence score between 0.0 and 1.0, taxonomic family, order, native habitat, dietary niche, physical plumage characteristics, geographical distribution, IUCN conservation status, and a 2-3 sentence description.\n"
            "- Provide a list of top 5 most probable species candidates in 'top_predictions', each with 'common_name', 'scientific_name', and 'confidence'.\n\n"
            "OUTPUT FORMAT: Valid JSON ONLY adhering strictly to this schema:\n"
            "{\n"
            '  "is_bird": true,\n'
            '  "detected_object": null,\n'
            '  "common_name": "House Sparrow",\n'
            '  "scientific_name": "Passer domesticus",\n'
            '  "confidence": 0.96,\n'
            '  "family": "Passeridae",\n'
            '  "order": "Passeriformes",\n'
            '  "conservation_status": "Least Concern (LC)",\n'
            '  "habitat": "Urban landscapes, rural villages, farms, and suburban gardens.",\n'
            '  "diet": "Granivorous & insectivorous — seeds, grains, table crumbs, caterpillars.",\n'
            '  "physical_characteristics": "Compact passerine with stout seed-eating bill. Males feature grey crown and black bib.",\n'
            '  "geographical_distribution": "Widespread across the Indian Subcontinent and worldwide.",\n'
            '  "description": "The house sparrow is a small passerine bird found across India and the world.",\n'
            '  "top_predictions": [\n'
            '    {"common_name": "House Sparrow", "scientific_name": "Passer domesticus", "confidence": 0.96},\n'
            '    {"common_name": "Spanish Sparrow", "scientific_name": "Passer hispaniolensis", "confidence": 0.02}\n'
            '  ]\n'
            "}"
        )

        payload = {
            "contents": [{
                "parts": [
                    {"text": prompt},
                    {"inline_data": {"mime_type": mime_type, "data": b64_data}}
                ]
            }],
            "generationConfig": {
                "response_mime_type": "application/json"
            }
        }

        res = None
        last_error = ""
        for model_name in self.SUPPORTED_MODELS:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent?key={api_key.strip()}"
            headers = {"Content-Type": "application/json"}
            try:
                res = requests.post(url, headers=headers, json=payload, timeout=6)
                if res.status_code == 200:
                    break
                elif res.status_code in (400, 401, 403):
                    err_json = res.json() if "application/json" in res.headers.get("Content-Type", "") else {}
                    msg = err_json.get("error", {}).get("message", res.text)
                    if "API_KEY_INVALID" in msg or "API key not valid" in msg or res.status_code in (401, 403):
                        return False, {"error": "Invalid Google Gemini API Key. Please verify your API key."}
                    last_error = msg
            except Exception as e:
                last_error = str(e)
                # If network connection fails (offline / proxy error), don't delay other models
                break

        if not res or res.status_code != 200:
            return False, {"error": f"Gemini Vision API request failed: {last_error or 'Network error'}"}

        try:
            data = res.json()
            raw_text = data["candidates"][0]["content"]["parts"][0]["text"]
            cleaned = self._clean_json_response(raw_text)
            parsed = json.loads(cleaned)
            return True, parsed
        except Exception as e:
            return False, {"error": f"Failed to parse Gemini Vision response: {e}"}

    def identify_audio(self, audio_path: str, api_key: str) -> Tuple[bool, Dict[str, Any]]:
        """
        Analyzes bird vocalization / voice recording using Google Gemini Audio Understanding.
        Returns: (success: bool, result_or_error_dict)
        """
        if not api_key or not api_key.strip():
            return False, {"error": "No API key provided."}

        ext = os.path.splitext(audio_path)[1].lower()
        mime_type = "audio/wav"
        if ext in (".mp3", ".mpeg"):
            mime_type = "audio/mp3"
        elif ext == ".flac":
            mime_type = "audio/flac"
        elif ext == ".ogg":
            mime_type = "audio/ogg"
        elif ext == ".m4a":
            mime_type = "audio/m4a"

        try:
            with open(audio_path, "rb") as f:
                b64_data = base64.b64encode(f.read()).decode("utf-8")
        except Exception as e:
            return False, {"error": f"Failed to read audio file: {e}"}

        prompt = (
            "You are an expert avian bioacoustician, ornithologist, and sound classifier specializing in bird songs, calls, chirps, and bioacoustics.\n"
            "Listen to and analyze this uploaded audio recording carefully:\n\n"
            "STEP 1: STRICT BIOACOUSTIC VALIDATION\n"
            "- Does this audio recording contain genuine bird vocalizations, songs, chirps, trills, whistles, or calls? "
            "(Set is_bird_sound: true if bird sounds are audible, even with background ambient sound).\n"
            "- If the recording is ONLY human speech, music, dog barking, vehicle/traffic engine noise, mechanical rumble, or pure silence without any bird sounds, "
            "you MUST set is_bird_sound to false and describe the non-bird sound in 'detected_sound' (e.g. 'human speech conversation', 'car traffic rumble', 'silence').\n\n"
            "STEP 2: SPECIES VOCALIZATION IDENTIFICATION\n"
            "- If is_bird_sound is true, identify the bird species from its song pattern, chirp frequency, pitch modulation, and harmonic cadence.\n"
            "- Prioritize resident and native species of India and South Asia if the sound matches.\n"
            "- Provide common name, scientific name, confidence score (0.0 to 1.0), vocalization type (e.g., 'mating song', 'territorial call', 'alarm whistle', 'dawn chorus'), "
            "vocalization acoustic description, family, order, habitat, diet, geographical distribution, conservation status, and description.\n"
            "- Provide a list of top 5 candidate species in 'top_predictions', each with 'common_name', 'scientific_name', and 'confidence'.\n\n"
            "OUTPUT FORMAT: Valid JSON ONLY adhering strictly to this schema:\n"
            "{\n"
            '  "is_bird_sound": true,\n'
            '  "detected_sound": null,\n'
            '  "common_name": "Asian Koel",\n'
            '  "scientific_name": "Eudynamys scolopaceus",\n'
            '  "confidence": 0.94,\n'
            '  "vocalization_type": "Repetitive rising whistling call (Koo-Ooo)",\n'
            '  "vocalization_description": "Loud, resonant rising whistle repeated at rapid intervals, typical of male territorial dawn vocalization.",\n'
            '  "family": "Cuculidae",\n'
            '  "order": "Cuculiformes",\n'
            '  "conservation_status": "Least Concern (LC)",\n'
            '  "habitat": "Light woodland, urban gardens, cultivations, and parks across India.",\n'
            '  "diet": "Frugivorous & insectivorous — wild figs, berries, and caterpillars.",\n'
            '  "geographical_distribution": "Common resident throughout the Indian Subcontinent.",\n'
            '  "description": "The Asian koel is a member of the cuckoo order known for its resonant, musical calls in summer.",\n'
            '  "top_predictions": [\n'
            '    {"common_name": "Asian Koel", "scientific_name": "Eudynamys scolopaceus", "confidence": 0.94},\n'
            '    {"common_name": "Indian Cuckoo", "scientific_name": "Cuculus micropterus", "confidence": 0.03}\n'
            '  ]\n'
            "}"
        )

        payload = {
            "contents": [{
                "parts": [
                    {"text": prompt},
                    {"inline_data": {"mime_type": mime_type, "data": b64_data}}
                ]
            }],
            "generationConfig": {
                "response_mime_type": "application/json"
            }
        }

        res = None
        last_error = ""
        for model_name in self.SUPPORTED_MODELS:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent?key={api_key.strip()}"
            headers = {"Content-Type": "application/json"}
            try:
                res = requests.post(url, headers=headers, json=payload, timeout=6)
                if res.status_code == 200:
                    break
                elif res.status_code in (400, 401, 403):
                    err_json = res.json() if "application/json" in res.headers.get("Content-Type", "") else {}
                    msg = err_json.get("error", {}).get("message", res.text)
                    if "API_KEY_INVALID" in msg or "API key not valid" in msg or res.status_code in (401, 403):
                        return False, {"error": "Invalid Google Gemini API Key. Please verify your API key."}
                    last_error = msg
            except Exception as e:
                last_error = str(e)
                break

        if not res or res.status_code != 200:
            return False, {"error": f"Gemini Audio API request failed: {last_error or 'Network error'}"}

        try:
            data = res.json()
            raw_text = data["candidates"][0]["content"]["parts"][0]["text"]
            cleaned = self._clean_json_response(raw_text)
            parsed = json.loads(cleaned)
            return True, parsed
        except Exception as e:
            return False, {"error": f"Failed to parse Gemini Audio response: {e}"}

