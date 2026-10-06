import os
import json
import wikipedia
from PIL import Image, ImageDraw
import time

# 100 Common Indian Birds
INDIAN_BIRDS_100 = [
    "Indian Peafowl", "Indian Roller", "Great Indian Bustard", "House Sparrow", "Asian Koel",
    "Rose-ringed Parakeet", "Red-vented Bulbul", "Indian Robin", "Jungle Babbler", "Common Myna",
    "Brahminy Kite", "Black Kite", "Shikra", "White-throated Kingfisher", "Common Kingfisher",
    "Pied Kingfisher", "Green Bee-eater", "Indian Golden Oriole", "Black Drongo", "Ashy Drongo",
    "Greater Coucal", "Sarus Crane", "Painted Stork", "Asian Openbill", "Black-headed Ibis",
    "Red-wattled Lapwing", "White-breasted Waterhen", "Common Moorhen", "Purple Sunbird", "Crimson Sunbird",
    "Baya Weaver", "Indian Silverbill", "Scaly-breasted Munia", "Plum-headed Parakeet", "Alexandrine Parakeet",
    "Spotted Owlet", "Barn Owl", "Indian Eagle-Owl", "Brown Fish Owl", "Jungle Owlet",
    "Coppersmith Barbet", "Brown-headed Barbet", "Lineated Barbet", "Indian Grey Hornbill", "Malabar Pied Hornbill",
    "Great Hornbill", "Rufous Treepie", "House Crow", "Jungle Crow", "Common Tailorbird",
    "Ashy Prinia", "Plain Prinia", "Oriental Magpie-Robin", "White-rumped Shama", "Indian Paradise Flycatcher",
    "Tickell's Blue Flycatcher", "Verditer Flycatcher", "Grey-headed Canary-Flycatcher", "Red-whiskered Bulbul", "White-browed Bulbul",
    "Yellow-billed Babbler", "Puff-throated Babbler", "Indian White-eye", "Cinereous Tit", "Black-lored Tit",
    "Purple-rumped Sunbird", "Loten's Sunbird", "Thick-billed Flowerpecker", "Pale-billed Flowerpecker", "Crested Serpent Eagle",
    "Changeable Hawk-Eagle", "Steppe Eagle", "Indian Vulture", "Egyptian Vulture", "Red-headed Vulture",
    "Osprey", "Peregrine Falcon", "Common Kestrel", "Indian Courser", "Yellow-wattled Lapwing",
    "Pheasant-tailed Jacana", "Bronze-winged Jacana", "Black-winged Stilt", "Great Thick-knee", "Indian Skimmer",
    "River Tern", "Whiskered Tern", "Little Egret", "Great Egret", "Intermediate Egret",
    "Cattle Egret", "Indian Pond Heron", "Grey Heron", "Purple Heron", "Black-crowned Night Heron",
    "Little Cormorant", "Indian Cormorant", "Great Cormorant", "Oriental Darter", "Spot-billed Pelican"
]

def generate_database():
    app_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'app')
    db_path = os.path.join(app_dir, 'bird_info.json')
    
    bird_db = []
        
    print("Generating database for 100 birds...")
    for i, bird in enumerate(INDIAN_BIRDS_100):
        species_id = f"{i:03d}.{bird.replace(' ', '_')}"
        try:
            # Fetch a short summary from wikipedia
            summary = wikipedia.summary(bird, sentences=2)
            bird_db.append({
                "species_id": species_id,
                "common_name": bird,
                "scientific_name": "Unknown",
                "description": summary,
                "habitat": "Found across India.",
                "diet": "Varies by species."
            })
            print(f"Fetched info for {bird}")
        except Exception as e:
            print(f"Could not fetch {bird}: {e}")
            bird_db.append({
                "species_id": species_id,
                "common_name": bird,
                "scientific_name": "Unknown",
                "description": f"The {bird} is a bird species found in the Indian subcontinent.",
                "habitat": "Indian subcontinent",
                "diet": "Varies"
            })
        time.sleep(0.1) # Be nice to wikipedia API
            
    with open(db_path, 'w') as f:
        json.dump(bird_db, f, indent=4)
        
    print(f"Database created at {db_path} with {len(bird_db)} entries.")
    
def generate_dummy_dataset():
    raw_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'data', 'raw')
    os.makedirs(raw_dir, exist_ok=True)
    class_mapping_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'data', 'class_names.json')
    
    class_mapping = {}
    print("Generating dummy images for 100 classes...")
    for i, bird in enumerate(INDIAN_BIRDS_100):
        folder_name = f"{i:03d}.{bird.replace(' ', '_')}"
        class_mapping[str(i)] = folder_name
        save_dir = os.path.join(raw_dir, folder_name)
        
        # Only create if it doesn't exist to save time
        if not os.path.exists(save_dir) or len(os.listdir(save_dir)) < 5:
            os.makedirs(save_dir, exist_ok=True)
            # Create 10 dummy images per class (enough to train a basic model)
            for j in range(10):
                img = Image.new('RGB', (224, 224), color = ((i*10)%255, (j*20)%255, 150))
                d = ImageDraw.Draw(img)
                d.text((10,10), f"{bird}\nImg {j}", fill=(255,255,255))
                img.save(os.path.join(save_dir, f"{j:03d}.jpg"))
                
    with open(class_mapping_path, 'w') as f:
        json.dump(class_mapping, f, indent=4)
        
    print(f"Dummy dataset generated for {len(INDIAN_BIRDS_100)} birds.")

if __name__ == "__main__":
    generate_database()
    generate_dummy_dataset()
