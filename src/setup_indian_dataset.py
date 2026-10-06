import os
import json
import time
import requests
from duckduckgo_search import DDGS
from src.config import DATA_DIR, RAW_DATA_DIR, CLASS_NAMES_FILE

INDIAN_BIRDS = [
    "Indian Peafowl",
    "Indian Roller",
    "Great Indian Bustard",
    "House Sparrow",
    "Asian Koel",
    "Rose_ringed Parakeet",
    "Red_vented Bulbul",
    "Indian Robin",
    "Jungle Babbler",
    "Common Myna"
]

def download_images(query, num_images, save_dir):
    if not os.path.exists(save_dir):
        os.makedirs(save_dir)
        
    print(f"Searching for {query}...")
    try:
        results = DDGS().images(
            keywords=query,
            region="wt-wt",
            safesearch="off",
            size=None,
            color=None,
            type_image=None,
            layout=None,
            license_image=None,
            max_results=num_images
        )
        
        count = 0
        for i, res in enumerate(results):
            if count >= num_images:
                break
            image_url = res.get('image')
            if not image_url:
                continue
                
            try:
                response = requests.get(image_url, timeout=5)
                if response.status_code == 200:
                    ext = image_url.split('.')[-1].split('?')[0][:4]
                    if ext.lower() not in ['jpg', 'jpeg', 'png']:
                        ext = 'jpg'
                    file_path = os.path.join(save_dir, f"{count:03d}.{ext}")
                    with open(file_path, 'wb') as f:
                        f.write(response.content)
                    count += 1
            except Exception as e:
                pass
            time.sleep(0.5)
            
        print(f"Downloaded {count} images for {query}")
        return True
    except Exception as e:
        print(f"Error downloading {query}: {e}")
        return False

def setup_dataset():
    if not os.path.exists(RAW_DATA_DIR):
        os.makedirs(RAW_DATA_DIR)
        
    class_mapping = {}
    
    for i, bird_name in enumerate(INDIAN_BIRDS):
        folder_name = f"{i:03d}.{bird_name.replace(' ', '_')}"
        class_mapping[str(i)] = folder_name
        
        save_dir = os.path.join(RAW_DATA_DIR, folder_name)
        download_images(f"{bird_name} bird photo", 40, save_dir)
        time.sleep(2)
        
    with open(CLASS_NAMES_FILE, 'w') as f:
        json.dump(class_mapping, f, indent=4)
        
    print(f"Indian birds dataset setup complete. Images are located in {RAW_DATA_DIR}")

if __name__ == "__main__":
    setup_dataset()
