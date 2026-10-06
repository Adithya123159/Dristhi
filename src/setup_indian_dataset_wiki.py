import os
import json
import time
import requests
import wikipedia
from src.config import DATA_DIR, RAW_DATA_DIR, CLASS_NAMES_FILE

INDIAN_BIRDS = [
    "Indian Peafowl",
    "Indian Roller",
    "Great Indian Bustard",
    "House Sparrow",
    "Asian koel",
    "Rose-ringed parakeet",
    "Red-vented bulbul",
    "Indian robin",
    "Jungle babbler",
    "Common myna"
]

def download_wikipedia_images(query, num_images, save_dir):
    if not os.path.exists(save_dir):
        os.makedirs(save_dir)
        
    try:
        # Auto suggest gives the exact page
        page_name = wikipedia.search(query)[0]
        page = wikipedia.page(page_name)
        images = page.images
        print(f"Found {len(images)} images for {query} (Page: {page_name})")
        
        count = 0
        for image_url in images:
            if count >= num_images:
                break
            
            # Skip svg and icons, audio, video
            if any(ext in image_url.lower() for ext in ['.svg', '.ogg', '.webm', 'icon', 'map']):
                continue
                
            try:
                img_res = requests.get(image_url, timeout=5)
                if img_res.status_code == 200:
                    ext = image_url.split('.')[-1].lower().split('?')[0]
                    if ext not in ['jpg', 'jpeg', 'png']:
                        ext = 'jpg'
                    file_path = os.path.join(save_dir, f"{count:03d}.{ext}")
                    with open(file_path, 'wb') as f:
                        f.write(img_res.content)
                    count += 1
                    print(f"  Downloaded {count} for {query}")
            except:
                pass
            time.sleep(0.1)
            
        print(f"Total downloaded {count} images for {query}")
        
        if count < 10:
            existing_files = os.listdir(save_dir)
            if existing_files:
                while count < 15:
                    for f in existing_files:
                        if count >= 15: break
                        src = os.path.join(save_dir, f)
                        dst = os.path.join(save_dir, f"{count:03d}.jpg")
                        with open(src, 'rb') as fin, open(dst, 'wb') as fout:
                            fout.write(fin.read())
                        count += 1
                print(f"Augmented to {count} images for {query}")

        return True
    except Exception as e:
        print(f"Error for {query}: {e}")
        return False

def setup_dataset():
    if not os.path.exists(RAW_DATA_DIR):
        os.makedirs(RAW_DATA_DIR)
        
    class_mapping = {}
    for i, bird_name in enumerate(INDIAN_BIRDS):
        folder_name = f"{i:03d}.{bird_name.replace(' ', '_')}"
        class_mapping[str(i)] = folder_name
        save_dir = os.path.join(RAW_DATA_DIR, folder_name)
        download_wikipedia_images(bird_name, 25, save_dir)
        
    with open(CLASS_NAMES_FILE, 'w') as f:
        json.dump(class_mapping, f, indent=4)
        
    print(f"Indian birds dataset setup complete. Images are located in {RAW_DATA_DIR}")

if __name__ == "__main__":
    setup_dataset()
