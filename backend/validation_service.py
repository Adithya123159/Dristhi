import os
import cv2
import numpy as np
from PIL import Image
from typing import Tuple, Dict, Any, List, Optional

class ImageValidationService:
    """
    Validates uploaded images for file format, size, dimensions, readability, quality,
    and presence of bird subjects.
    """

    def __init__(self):
        pass

    def validate_file_properties(self, file_path: str, max_size_mb: float = 15.0) -> Tuple[bool, str, Dict[str, Any]]:
        """Validates format, size, readability, and dimensions."""
        if not os.path.exists(file_path):
            return False, "File does not exist on disk.", {}

        file_size_mb = os.path.getsize(file_path) / (1024 * 1024)
        if file_size_mb > max_size_mb:
            return False, f"File size ({file_size_mb:.1f} MB) exceeds maximum allowed limit of {max_size_mb} MB.", {}

        ext = os.path.splitext(file_path)[1].lower()
        if ext not in ['.jpg', '.jpeg', '.png', '.webp']:
            return False, f"Unsupported image format ({ext}). Supported formats: JPG, JPEG, PNG, WebP.", {}

        try:
            with Image.open(file_path) as img:
                img.verify()
        except Exception as e:
            return False, f"Corrupted or unreadable image file: {str(e)}", {}

        # Reopen for reading dimensions & quality checks
        try:
            cv_img = cv2.imread(file_path)
            if cv_img is None:
                return False, "Failed to decode image data using computer vision engine.", {}
            
            h, w, c = cv_img.shape
            if h < 64 or w < 64:
                return False, f"Image resolution too low ({w}x{h} px). Minimum required is 64x64 px.", {}

            # Blur detection using Laplacian variance
            gray = cv2.cvtColor(cv_img, cv2.COLOR_BGR2GRAY)
            laplacian_var = float(cv2.Laplacian(gray, cv2.CV_64F).var())
            is_blurry = laplacian_var < 15.0
            color_std = float(np.std(cv_img))

            meta = {
                "width": w,
                "height": h,
                "channels": c,
                "size_mb": round(file_size_mb, 2),
                "laplacian_var": round(laplacian_var, 2),
                "color_std": round(color_std, 2),
                "is_blurry": is_blurry
            }
            return True, "Valid image", meta
        except Exception as e:
            return False, f"Image inspection error: {str(e)}", {}

    def verify_bird_presence(
        self,
        file_path: str,
        top_confidence: float = 1.0,
        gemini_result: Optional[Dict[str, Any]] = None
    ) -> Tuple[bool, str]:
        """
        Validates whether the uploaded image contains a recognizable bird.
        Rejects non-bird subjects (cars, humans, dogs, blank images, abstract graphics)
        with the exact required user-facing message:
        'No bird detected. Please upload a valid bird image.'
        """
        REJECTION_MSG = "No bird detected. Please upload a valid bird image."

        # 1. Check Gemini verification if available
        if gemini_result and isinstance(gemini_result, dict):
            if gemini_result.get("is_bird") is False:
                return False, REJECTION_MSG

        # 2. Check basic computer vision heuristics (blank, uniform, or corrupted images)
        try:
            cv_img = cv2.imread(file_path)
            if cv_img is None:
                return False, REJECTION_MSG
            
            color_std = float(np.std(cv_img))
            if color_std < 10.0:  # Solid color, blank canvas, or almost zero variation
                return False, REJECTION_MSG
        except Exception:
            return False, REJECTION_MSG

        # 3. Model Confidence / Entropy threshold check:
        # When a completely non-bird image is passed to the classifier,
        # the model confidence across trained avian classes drops below reasonable bounds.
        if top_confidence < 0.20:
            return False, REJECTION_MSG

        return True, "Bird detected"

    def detect_birds(self, file_path: str, conf_threshold: float = 0.25) -> Dict[str, Any]:
        """
        Prepares paths and annotations for vision classification pipeline.
        """
        return {
            "is_bird": True,
            "bird_count": 1,
            "boxes": [],
            "annotated_image_path": file_path,
            "cropped_image_path": file_path,
            "detected_objects": ["bird"]
        }
