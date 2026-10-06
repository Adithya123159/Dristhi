import os
import urllib.request
import tarfile
import json
import shutil
import ssl
from src.config import DATA_DIR, RAW_DATA_DIR, CLASS_NAMES_FILE

URL = "https://data.caltech.edu/records/65de6-vp158/files/CUB_200_2011.tgz"
TGZ_FILE = os.path.join(DATA_DIR, "CUB_200_2011.tgz")

def download_and_extract():
    if not os.path.exists(RAW_DATA_DIR):
        os.makedirs(RAW_DATA_DIR)
        
    if not os.path.exists(TGZ_FILE):
        print("Downloading CUB-200-2011 dataset... This may take a while (1.1 GB).")
        # Bypass SSL verification if needed
        ssl._create_default_https_context = ssl._create_unverified_context
        
        req = urllib.request.Request(
            URL, 
            headers={'User-Agent': 'Mozilla/5.0'}
        )
        with urllib.request.urlopen(req) as response, open(TGZ_FILE, 'wb') as out_file:
            shutil.copyfileobj(response, out_file)
            
        print("Download complete.")
    
    print("Extracting...")
    with tarfile.open(TGZ_FILE, 'r:gz') as tar:
        tar.extractall(path=DATA_DIR)
    
    print("Extracting the 10 specific classes for our project subset...")
    images_dir = os.path.join(DATA_DIR, "CUB_200_2011", "images")
    
    with open(CLASS_NAMES_FILE, 'r') as f:
        class_mapping = json.load(f)
        
    for class_id, class_name in class_mapping.items():
        src_dir = os.path.join(images_dir, class_name)
        dst_dir = os.path.join(RAW_DATA_DIR, class_name)
        if os.path.exists(src_dir):
            if not os.path.exists(dst_dir):
                shutil.copytree(src_dir, dst_dir)
        else:
            print(f"Warning: {src_dir} not found.")

    print(f"Dataset setup complete. Images are located in {RAW_DATA_DIR}")

if __name__ == "__main__":
    download_and_extract()
