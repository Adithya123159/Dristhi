import os
import cv2
import numpy as np
from PIL import Image
from typing import Tuple, Dict, Any, List, Optional
from ultralytics import YOLO

# Ensure Ultralytics writes cache/settings in workspace
os.environ.setdefault("YOLO_CONFIG_DIR", os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), '.yolo'))

# COCO Class 14 is 'bird'
BIRD_CLASS_ID = 14

# Non-bird common classes in COCO for descriptive rejection messages
COCO_REJECTION_NAMES = {
    0: 'person', 1: 'bicycle', 2: 'car', 3: 'motorcycle', 4: 'airplane', 5: 'bus',
    6: 'train', 7: 'truck', 8: 'boat', 15: 'cat', 16: 'dog', 17: 'horse',
    18: 'sheep', 19: 'cow', 20: 'elephant', 21: 'bear', 22: 'zebra', 23: 'giraffe',
    24: 'backpack', 25: 'umbrella', 26: 'handbag', 28: 'suitcase', 39: 'bottle',
    56: 'chair', 57: 'couch', 58: 'potted plant', 59: 'bed', 60: 'dining table',
    62: 'tv', 63: 'laptop', 67: 'cell phone', 72: 'refrigerator', 73: 'book'
}

class ImageValidationService:
    """
    Validates uploaded images and performs YOLO-based bird detection.
    Requirements:
    - Validates file format, size, dimensions, readability, and blur/quality.
    - Runs YOLO detection to verify bird presence.
    - Rejects images with no birds or containing only unrelated objects (humans, cars, dogs, etc.).
    - Extracts bird bounding boxes and crops the primary bird region for species classification.
    """

    def __init__(self, yolo_model_path: str = "yolov8n.pt"):
        self.yolo_model_path = yolo_model_path
        self._model: Optional[YOLO] = None

    def _get_model(self) -> YOLO:
        if self._model is None:
            self._model = YOLO(self.yolo_model_path)
        return self._model

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
            is_blurry = laplacian_var < 15.0  # Threshold for severely blurred images

            meta = {
                "width": w,
                "height": h,
                "channels": c,
                "size_mb": round(file_size_mb, 2),
                "laplacian_var": round(laplacian_var, 2),
                "is_blurry": is_blurry
            }
            return True, "Valid image", meta
        except Exception as e:
            return False, f"Image inspection error: {str(e)}", {}

    def detect_birds(self, file_path: str, conf_threshold: float = 0.25) -> Dict[str, Any]:
        """
        Runs YOLO to detect birds and other objects.
        Returns detection results, bounding boxes, and cropped bird path.
        """
        model = self._get_model()
        img = cv2.imread(file_path)
        if img is None:
            return {
                "is_bird": False,
                "error": "Could not read image for bird detection.",
                "rejection_message": "Invalid Image: Could not load image file."
            }

        orig_h, orig_w = img.shape[:2]
        results = model.predict(source=img, conf=conf_threshold, verbose=False)[0]

        bird_boxes: List[Dict[str, Any]] = []
        other_objects: List[str] = []

        if results.boxes is not None and len(results.boxes) > 0:
            for box in results.boxes:
                cls_id = int(box.cls[0].item())
                confidence = float(box.conf[0].item())
                xyxy = box.xyxy[0].tolist()  # [x1, y1, x2, y2]

                if cls_id == BIRD_CLASS_ID:
                    x1, y1, x2, y2 = map(int, xyxy)
                    # Clamp to image boundaries
                    x1 = max(0, x1)
                    y1 = max(0, y1)
                    x2 = min(orig_w, x2)
                    y2 = min(orig_h, y2)
                    bird_boxes.append({
                        "box": [x1, y1, x2, y2],
                        "confidence": round(confidence, 4),
                        "width": x2 - x1,
                        "height": y2 - y1
                    })
                else:
                    name = model.names.get(cls_id, COCO_REJECTION_NAMES.get(cls_id, f"object_{cls_id}"))
                    if name not in other_objects:
                        other_objects.append(name)

        # Draw annotated image with bounding boxes
        annotated_img = img.copy()
        for b in bird_boxes:
            x1, y1, x2, y2 = b["box"]
            conf = b["confidence"]
            cv2.rectangle(annotated_img, (x1, y1), (x2, y2), (0, 200, 80), 3)
            label = f"Bird {conf * 100:.1f}%"
            (lw, lh), _ = cv2.getTextSize(label, cv2.FONT_HERSHEY_SIMPLEX, 0.6, 2)
            cv2.rectangle(annotated_img, (x1, max(0, y1 - 25)), (x1 + lw + 8, max(0, y1)), (0, 200, 80), -1)
            cv2.putText(annotated_img, label, (x1 + 4, max(18, y1 - 6)), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 2)

        # Save annotated image
        dir_name = os.path.dirname(file_path)
        base_name, ext = os.path.splitext(os.path.basename(file_path))
        annotated_filename = f"{base_name}_detected{ext}"
        annotated_path = os.path.join(dir_name, annotated_filename)
        cv2.imwrite(annotated_path, annotated_img)

        # Check if bird was detected
        if not bird_boxes:
            detected_desc = ", ".join(other_objects[:3]) if other_objects else "no identifiable objects"
            return {
                "is_bird": False,
                "bird_count": 0,
                "detected_objects": other_objects,
                "annotated_image_path": annotated_path,
                "rejection_message": f"Invalid Image: No bird detected. Please upload an image containing a bird. (Detected: {detected_desc})"
            }

        # Crop the primary (highest confidence or largest) bird
        best_bird = max(bird_boxes, key=lambda b: (b["confidence"], b["width"] * b["height"]))
        bx1, by1, bx2, by2 = best_bird["box"]
        # Add 10% padding
        pad_x = int((bx2 - bx1) * 0.10)
        pad_y = int((by2 - by1) * 0.10)
        crop_x1 = max(0, bx1 - pad_x)
        crop_y1 = max(0, by1 - pad_y)
        crop_x2 = min(orig_w, bx2 + pad_x)
        crop_y2 = min(orig_h, by2 + pad_y)

        cropped_img = img[crop_y1:crop_y2, crop_x1:crop_x2]
        cropped_filename = f"{base_name}_cropped{ext}"
        cropped_path = os.path.join(dir_name, cropped_filename)
        cv2.imwrite(cropped_path, cropped_img)

        return {
            "is_bird": True,
            "bird_count": len(bird_boxes),
            "boxes": bird_boxes,
            "primary_box": best_bird,
            "annotated_image_path": annotated_path,
            "cropped_image_path": cropped_path,
            "detected_objects": ["bird"] + other_objects
        }

