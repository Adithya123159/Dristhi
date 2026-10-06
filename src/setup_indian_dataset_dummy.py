import os
import json
from PIL import Image, ImageDraw
from src.config import RAW_DATA_DIR, CLASS_NAMES_FILE

INDIAN_BIRDS = [
    "Indian Peafowl",
    "Indian Roller",
    "Great Indian Bustard",
    "House Sparrow",
    "Asian Koel",
    "Rose-ringed Parakeet",
    "Red-vented Bulbul",
    "Indian Robin",
    "Jungle Babbler",
    "Common Myna"
]

def setup_dataset():
    if not os.path.exists(RAW_DATA_DIR):
        os.makedirs(RAW_DATA_DIR)
        
    class_mapping = {}
    for i, bird_name in enumerate(INDIAN_BIRDS):
        folder_name = f"{i:03d}.{bird_name.replace(' ', '_')}"
        class_mapping[str(i)] = folder_name
        save_dir = os.path.join(RAW_DATA_DIR, folder_name)
        os.makedirs(save_dir, exist_ok=True)
        
        for j in range(20):
            img = Image.new('RGB', (224, 224), color = (i*25, j*12, 150))
            d = ImageDraw.Draw(img)
            d.text((10,10), f"{bird_name} {j}", fill=(255,255,255))
            img.save(os.path.join(save_dir, f"{j:03d}.jpg"))
            
    with open(CLASS_NAMES_FILE, 'w') as f:
        json.dump(class_mapping, f, indent=4)
        
    print(f"Indian birds dummy dataset setup complete. Images are located in {RAW_DATA_DIR}")

if __name__ == "__main__":
    setup_dataset()
