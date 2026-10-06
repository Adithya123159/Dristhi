import os
import json
import time
import requests
from src.config import DATA_DIR, RAW_DATA_DIR, CLASS_NAMES_FILE

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

def search_wikimedia(query):
    url = "https://en.wikipedia.org/w/api.php"
    params = {
        "action": "query",
        "format": "json",
        "generator": "images",
        "titles": query,
        "gimlimit": "max",
        "prop": "imageinfo",
        "iiprop": "url"
    }
    try:
        r = requests.get(url, params=params, timeout=10)
        data = r.json()
        pages = data.get("query", {}).get("pages", {})
        images = []
        for k, v in pages.items():
            ii = v.get("imageinfo", [])
            if ii:
                url = ii[0].get("url")
                if url and not url.endswith('.svg') and 'icon' not in url.lower() and 'map' not in url.lower():
                    images.append(url)
        return images
    except:
        return []

def setup_dataset():
    if not os.path.exists(RAW_DATA_DIR):
        os.makedirs(RAW_DATA_DIR)
        
    class_mapping = {}
    for i, bird_name in enumerate(INDIAN_BIRDS):
        folder_name = f"{i:03d}.{bird_name.replace(' ', '_')}"
        class_mapping[str(i)] = folder_name
        save_dir = os.path.join(RAW_DATA_DIR, folder_name)
        os.makedirs(save_dir, exist_ok=True)
        
        urls = search_wikimedia(bird_name)
        if len(urls) < 15 and len(urls) > 0:
            urls = (urls * 15)[:15] # duplicate
            
        count = 0
        for u in urls:
            try:
                r = requests.get(u, timeout=5)
                if r.status_code == 200:
                    ext = u.split(".")[-1].lower()
                    if ext not in ["jpg", "jpeg", "png"]: ext = "jpg"
                    with open(os.path.join(save_dir, f"{count:03d}.{ext}"), "wb") as f:
                        f.write(r.content)
                    count += 1
            except:
                pass
        print(f"Saved {count} images for {bird_name}")
        
    with open(CLASS_NAMES_FILE, 'w') as f:
        json.dump(class_mapping, f, indent=4)
        
    print(f"Indian birds dataset setup complete. Images are located in {RAW_DATA_DIR}")

if __name__ == "__main__":
    setup_dataset()
