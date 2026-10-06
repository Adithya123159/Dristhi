import os
import json
import numpy as np
import tensorflow as tf
from src.config import MODELS_DIR
from src.preprocessing import preprocess_image

class BirdClassifier:
    def __init__(self):
        self.model_path = os.path.join(MODELS_DIR, 'best_model.h5')
        self.mapping_path = os.path.join(MODELS_DIR, 'model_class_mapping.json')
        self.model = None
        self.class_mapping = None
        self._load_model()

    def _load_model(self):
        if not os.path.exists(self.model_path):
            raise FileNotFoundError(f"Trained model not found at {self.model_path}. Please train the model first.")
        if not os.path.exists(self.mapping_path):
            raise FileNotFoundError(f"Class mapping not found at {self.mapping_path}.")
            
        # Avoid caching issues with custom objects if any
        self.model = tf.keras.models.load_model(self.model_path, compile=False)
        with open(self.mapping_path, 'r') as f:
            self.class_mapping = json.load(f)

    def predict(self, image_path, top_k=3):
        img_tensor = preprocess_image(image_path)
        img_batch = tf.expand_dims(img_tensor, 0)
        
        predictions = self.model.predict(img_batch)[0]
        
        # Get top k predictions
        top_indices = np.argsort(predictions)[-top_k:][::-1]
        
        results = []
        for i in top_indices:
            class_id = str(i)
            species_folder = self.class_mapping.get(class_id, "Unknown")
            confidence = float(predictions[i])
            results.append({
                "species_id": species_folder,
                "confidence": confidence
            })
            
        return results
