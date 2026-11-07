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

    SUPPORTED_MODELS = [
        "gemini-3.5-flash-lite",
        "gemini-3.5-flash",
        "gemini-flash-latest",
        "gemini-flash-lite-latest",
        "gemini-3.8-flash",
        "gemini-2.5-flash"
    ]

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
            "You are an expert ornithologist and senior avian taxonomist specializing in South Asian and global avifauna.\n"
            "Analyze this uploaded bird photograph with rigorous scientific precision:\n\n"
            "STEP 1: STRICT BIRD VALIDATION\n"
            "- Set is_bird to true ONLY if the image depicts a real bird (wild, captive, perched, or in flight).\n"
            "- If the image depicts a human/portrait, dog, cat, car, vehicle, phone, building, furniture, landscape without birds, "
            "or ANY non-bird object, you MUST set is_bird to false and describe the non-bird subject in 'detected_object' (e.g. 'sports car', 'person portrait', 'golden retriever').\n\n"
            "STEP 2: COMPREHENSIVE SPECIES BIOLOGICAL PROFILE\n"
            "If is_bird is true, identify the species accurately and generate an authentic, species-specific biological profile conforming strictly to eBird, Cornell Lab of Ornithology, and IUCN Red List standards.\n\n"
            "Taxonomy Requirements:\n"
            "- Genus: Specific taxonomic genus (e.g. 'Pavo', 'Eudynamys', 'Passer').\n"
            "- Family: Valid taxonomic family (e.g. 'Phasianidae', 'Cuculidae', 'Passeridae').\n"
            "- Order: Valid taxonomic order (e.g. 'Galliformes', 'Cuculiformes', 'Passeriformes').\n"
            "- Conservation Status: Official IUCN Red List rating with standard code (e.g. 'Least Concern (LC)', 'Vulnerable (VU)', 'Endangered (EN)', 'Critically Endangered (CR)').\n"
            "- Do NOT duplicate scientific name under species.\n\n"
            "Physical Characteristics Requirements:\n"
            "- Appearance: Detailed plumage structure, posture, and sexual dimorphism (clear differences between male and female).\n"
            "- Colour Features: Diagnostic feather markings, eye color, bill color, facial patterns, and crest details.\n"
            "- Size Morphometrics: Verified adult body length, wingspan, and body mass with units (e.g., cm, g, kg). If reliable data is not documented, state 'Information unavailable'.\n\n"
            "Habitat, Diet & Behaviour Requirements:\n"
            "- Habitat & Distribution: Actual natural habitat, resident/migratory distribution in the Indian Subcontinent and globally, and native environments.\n"
            "- Feeding Habits: Explicit primary diet category (e.g., 'Omnivorous', 'Frugivorous', 'Insectivorous', 'Carnivorous', 'Granivorous', 'Piscivorous'), actual preferred food items, feeding strategy, and hunting habits.\n"
            "- Behaviour & Lifestyle: Diurnal/nocturnal cycle, roosting habits, flocking/solitary social structure, authentic nesting architecture (or brood parasitism when applicable, e.g. for cuckoos), and breeding courtship.\n\n"
            "Ecological Novelty Requirements:\n"
            "- Species-specific unique biological adaptations, ecological niche (e.g. seed dispersal, pollination, apex scavenging, pest control), and lesser-known authenticated scientific facts.\n"
            "- Sources: Cite authoritative references ['IUCN Red List of Threatened Species', 'eBird / Cornell Lab of Ornithology', 'Birds of the World'].\n\n"
            "OUTPUT FORMAT: Valid JSON ONLY adhering strictly to this schema:\n"
            "{\n"
            '  "is_bird": true,\n'
            '  "detected_object": null,\n'
            '  "basic_identification": {\n'
            '    "common_name": "Indian Peafowl",\n'
            '    "scientific_name": "Pavo cristatus",\n'
            '    "genus": "Pavo",\n'
            '    "family": "Phasianidae",\n'
            '    "order": "Galliformes",\n'
            '    "confidence": 0.99,\n'
            '    "confidence_percentage": "99.0%",\n'
            '    "conservation_status": "Least Concern (LC)"\n'
            '  },\n'
            '  "physical_characteristics": {\n'
            '    "appearance": "...",\n'
            '    "colour_features": "...",\n'
            '    "size_characteristics": "..."\n'
            '  },\n'
            '  "habitat_distribution": {\n'
            '    "natural_habitat": "...",\n'
            '    "geographic_distribution": "...",\n'
            '    "common_environments": "..."\n'
            '  },\n'
            '  "feeding_habits": {\n'
            '    "primary_diet": "...",\n'
            '    "what_it_eats": "...",\n'
            '    "feeding_behaviour": "...",\n'
            '    "hunting_habits": "..."\n'
            '  },\n'
            '  "behaviour_lifestyle": {\n'
            '    "general_behaviour": "...",\n'
            '    "social_behaviour": "...",\n'
            '    "nesting_habits": "...",\n'
            '    "breeding_behaviour": "..."\n'
            '  },\n'
            '  "interesting_information": {\n'
            '    "unique_characteristics": "...",\n'
            '    "special_adaptations": "...",\n'
            '    "ecological_importance": "...",\n'
            '    "rare_facts": "..."\n'
            '  },\n'
            '  "sources": [\n'
            '    "IUCN Red List of Threatened Species",\n'
            '    "eBird / Cornell Lab of Ornithology",\n'
            '    "Birds of the World"\n'
            '  ],\n'
            '  "description": "...",\n'
            '  "top_predictions": [\n'
            '    {"common_name": "Indian Peafowl", "scientific_name": "Pavo cristatus", "confidence": 0.99}\n'
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
                res = requests.post(url, headers=headers, json=payload, timeout=25)
                if res.status_code == 200:
                    break
                elif res.status_code in (400, 401, 403):
                    err_json = res.json() if "application/json" in res.headers.get("Content-Type", "") else {}
                    msg = err_json.get("error", {}).get("message", res.text)
                    if "API_KEY_INVALID" in msg or "API key not valid" in msg or res.status_code in (401, 403):
                        return False, {"error": "Invalid Google Gemini API Key. Please verify your API key."}
                    last_error = msg
                else:
                    last_error = f"HTTP {res.status_code}: {res.text[:120]}"
            except Exception as e:
                last_error = str(e)
                continue

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
            "Listen to and analyze this uploaded audio recording with rigorous scientific precision:\n\n"
            "STEP 1: STRICT BIOACOUSTIC VALIDATION\n"
            "- Does this audio recording contain genuine bird vocalizations, songs, chirps, trills, whistles, or calls? "
            "(Set is_bird_sound: true if bird sounds are audible, even with background ambient sound).\n"
            "- If the recording is ONLY human speech, music, dog barking, vehicle/traffic engine noise, mechanical rumble, or pure silence without any bird sounds, "
            "you MUST set is_bird_sound to false and describe the non-bird sound in 'detected_sound' (e.g. 'human speech conversation', 'car traffic rumble', 'silence').\n\n"
            "STEP 2: SPECIES VOCALIZATION IDENTIFICATION & COMPLETE BIOLOGICAL PROFILE\n"
            "If is_bird_sound is true, identify the bird species from its song pattern, chirp frequency, pitch modulation, and harmonic cadence.\n"
            "Generate a complete, scientifically authenticated species profile conforming strictly to eBird, Cornell Lab of Ornithology, and IUCN Red List standards.\n\n"
            "Taxonomy Requirements:\n"
            "- Genus: Specific taxonomic genus (e.g. 'Eudynamys', 'Pavo', 'Passer').\n"
            "- Family: Valid taxonomic family (e.g. 'Cuculidae', 'Phasianidae', 'Passeridae').\n"
            "- Order: Valid taxonomic order (e.g. 'Cuculiformes', 'Galliformes', 'Passeriformes').\n"
            "- Conservation Status: Official IUCN Red List rating with standard code (e.g. 'Least Concern (LC)', 'Vulnerable (VU)', 'Endangered (EN)').\n"
            "- Do NOT duplicate scientific name under species.\n\n"
            "Physical Characteristics Requirements:\n"
            "- Appearance: Detailed plumage structure, sexual dimorphism (e.g. male glossy black vs female spotted brown for Asian Koel).\n"
            "- Colour Features: Diagnostic color patterns, eye color, bill color, and wing plumage.\n"
            "- Size Morphometrics: Verified adult body length, wingspan, and weight measurements with units (e.g., cm, g, kg). If unavailable, use 'Information unavailable'.\n\n"
            "Habitat, Diet & Behaviour Requirements:\n"
            "- Habitat & Distribution: Actual natural habitat, resident/migratory distribution in the Indian Subcontinent, and common native environments.\n"
            "- Feeding Habits: Explicit primary diet category (e.g., 'Frugivorous', 'Insectivorous', 'Omnivorous'), preferred food items, feeding strategy, and hunting habits.\n"
            "- Behaviour & Lifestyle: Acoustic calls, diurnal habits, social structure, authentic nesting patterns (explicitly detail brood parasitism if applicable), and breeding season.\n\n"
            "Ecological Novelty Requirements:\n"
            "- Unique characteristics, acoustic or anatomical adaptations, ecological importance (seed dispersal, insect regulation), and authenticated lesser-known facts.\n"
            "- Sources: Cite authoritative references ['IUCN Red List of Threatened Species', 'eBird / Cornell Lab of Ornithology', 'Birds of the World'].\n\n"
            "OUTPUT FORMAT: Valid JSON ONLY adhering strictly to this schema:\n"
            "{\n"
            '  "is_bird_sound": true,\n'
            '  "detected_sound": null,\n'
            '  "basic_identification": {\n'
            '    "common_name": "Asian Koel",\n'
            '    "scientific_name": "Eudynamys scolopaceus",\n'
            '    "genus": "Eudynamys",\n'
            '    "family": "Cuculidae",\n'
            '    "order": "Cuculiformes",\n'
            '    "confidence": 0.95,\n'
            '    "confidence_percentage": "95.0%",\n'
            '    "conservation_status": "Least Concern (LC)"\n'
            '  },\n'
            '  "physical_characteristics": {\n'
            '    "appearance": "...",\n'
            '    "colour_features": "...",\n'
            '    "size_characteristics": "..."\n'
            '  },\n'
            '  "habitat_distribution": {\n'
            '    "natural_habitat": "...",\n'
            '    "geographic_distribution": "...",\n'
            '    "common_environments": "..."\n'
            '  },\n'
            '  "feeding_habits": {\n'
            '    "primary_diet": "...",\n'
            '    "what_it_eats": "...",\n'
            '    "feeding_behaviour": "...",\n'
            '    "hunting_habits": "..."\n'
            '  },\n'
            '  "behaviour_lifestyle": {\n'
            '    "general_behaviour": "...",\n'
            '    "social_behaviour": "...",\n'
            '    "nesting_habits": "...",\n'
            '    "breeding_behaviour": "..."\n'
            '  },\n'
            '  "interesting_information": {\n'
            '    "unique_characteristics": "...",\n'
            '    "special_adaptations": "...",\n'
            '    "ecological_importance": "...",\n'
            '    "rare_facts": "..."\n'
            '  },\n'
            '  "sources": [\n'
            '    "IUCN Red List of Threatened Species",\n'
            '    "eBird / Cornell Lab of Ornithology",\n'
            '    "Birds of the World"\n'
            '  ],\n'
            '  "description": "...",\n'
            '  "top_predictions": [\n'
            '    {"common_name": "Asian Koel", "scientific_name": "Eudynamys scolopaceus", "confidence": 0.95}\n'
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
                res = requests.post(url, headers=headers, json=payload, timeout=25)
                if res.status_code == 200:
                    break
                elif res.status_code in (400, 401, 403):
                    err_json = res.json() if "application/json" in res.headers.get("Content-Type", "") else {}
                    msg = err_json.get("error", {}).get("message", res.text)
                    if "API_KEY_INVALID" in msg or "API key not valid" in msg or res.status_code in (401, 403):
                        return False, {"error": "Invalid Google Gemini API Key. Please verify your API key."}
                    last_error = msg
                else:
                    last_error = f"HTTP {res.status_code}: {res.text[:120]}"
            except Exception as e:
                last_error = str(e)
                continue

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

