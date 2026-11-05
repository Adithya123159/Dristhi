import os
import json
import streamlit as st
from PIL import Image
import sys

# Ensure src modules can be imported
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.config import BIRD_INFO_FILE
from src.predict import BirdClassifier

# Configuration
st.set_page_config(
    page_title="Bird Species Classification",
    page_icon="🐦",
    layout="wide"
)

@st.cache_resource
def load_classifier():
    try:
        return BirdClassifier()
    except Exception as e:
        return None

@st.cache_data
def load_bird_info():
    if os.path.exists(BIRD_INFO_FILE):
        with open(BIRD_INFO_FILE, 'r') as f:
            return json.load(f)
    return []

def get_bird_details(species_id, bird_db):
    for bird in bird_db:
        if bird['species_id'] == species_id:
            return bird
    return None

def main():
    st.title("🐦 Bird Species Classification and Information System")
    st.markdown("""
    This Machine Learning application uses a Deep Learning model (MobileNetV2) to classify bird species from uploaded images. 
    It also provides detailed biological and conservation information about the identified bird.
    
    **Note:** This model is currently trained on a curated subset of Indian bird species. 
    If you upload an image of an unsupported bird, the model will try to map it to the closest match among the supported species.
    """)

    bird_db = load_bird_info()
    st.sidebar.header(f"Supported Species ({len(bird_db) if bird_db else 100})")
    
    if bird_db:
        species_list = [b.get('common_name', b.get('species_id', 'Unknown')) for b in bird_db]
        st.sidebar.markdown(
            "<div style='height: 400px; overflow-y: scroll; padding: 10px; border: 1px solid #ccc; border-radius: 5px;'>" + 
            "".join([f"• {s}<br>" for s in sorted(species_list)]) + 
            "</div>", unsafe_allow_html=True
        )
    else:
        st.sidebar.write("Database unavailable.")

    classifier = load_classifier()

    if classifier is None:
        st.error("⚠️ Trained model not found. Please train the model first by running `python src/train.py`.")
        st.stop()

    # Layout
    col1, col2 = st.columns([1, 2])

    with col1:
        st.header("Upload Image")
        uploaded_file = st.file_uploader("Choose a bird image...", type=["jpg", "jpeg", "png"])
        
        if uploaded_file is not None:
            image = Image.open(uploaded_file)
            st.image(image, caption="Uploaded Image", use_container_width=True)
            
            if st.button("Classify Bird", type="primary", use_container_width=True):
                with st.spinner("Classifying..."):
                    # Save temp image locally to avoid Windows Temp folder space/slash issues
                    temp_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "temp_image.jpg")).replace('\\', '/')
                    
                    # Convert to RGB in case of PNG with alpha channel
                    image.convert('RGB').save(temp_path)
                    
                    try:
                        results = classifier.predict(temp_path)
                        st.session_state['prediction_results'] = results
                    except Exception as e:
                        import traceback
                        st.error(f"Error during classification: {str(e)}\n\n```\n{traceback.format_exc()}\n```")
                    finally:
                        try:
                            if os.path.exists(temp_path):
                                os.remove(temp_path)
                        except:
                            pass

    with col2:
        if 'prediction_results' in st.session_state:
            results = st.session_state['prediction_results']
            best_match = results[0]
            confidence = best_match['confidence']
            species_id = best_match['species_id']
            
            bird_details = get_bird_details(species_id, bird_db)
            
            st.header("🦅 Identification Result")
            
            if bird_details:
                st.success(f"**Predicted Species:** {bird_details.get('common_name', species_id)} ({confidence:.2%} confidence)")
                
                if confidence < 0.5:
                    st.warning("Low confidence prediction. The model is uncertain about this classification.")
                
                with st.expander("Show Top 3 Predictions"):
                    for r in results:
                        s_id = r['species_id']
                        det = get_bird_details(s_id, bird_db)
                        name = det.get('common_name', s_id) if det else s_id
                        st.write(f"- **{name}**: {r['confidence']:.2%}")
                
                st.divider()
                st.header(f"About the {bird_details.get('common_name', 'Bird')}")
                
                if bird_details.get('description'):
                    st.write(bird_details['description'])
                    st.write("")
                
                # Use tabs for clean organization
                tab1, tab2, tab3 = st.tabs(["Biology", "Habitat & Diet", "Conservation"])
                
                with tab1:
                    st.write(f"**Scientific Name:** *{bird_details.get('scientific_name', 'Unknown')}*")
                    if 'bird_family' in bird_details:
                        st.write(f"**Family:** {bird_details['bird_family']}")
                    if 'physical_characteristics' in bird_details:
                        st.write(f"**Physical Characteristics:** {bird_details['physical_characteristics']}")
                
                with tab2:
                    st.write(f"**Habitat:** {bird_details.get('habitat', 'Found across the Indian subcontinent.')}")
                    if 'geographical_distribution' in bird_details:
                        st.write(f"**Geographical Distribution:** {bird_details['geographical_distribution']}")
                    st.write(f"**Diet:** {bird_details.get('diet', 'Varied diet depending on local ecosystem.')}")
                    if 'feeding_behavior' in bird_details:
                        st.write(f"**Feeding Behavior:** {bird_details['feeding_behavior']}")
                
                with tab3:
                    status = bird_details.get('conservation_status', 'Least Concern (LC)')
                    if "Concern" in status:
                        st.info(f"**Status:** {status}")
                    elif "Threatened" in status or "Vulnerable" in status:
                        st.warning(f"**Status:** {status}")
                    else:
                        st.error(f"**Status:** {status}")
                        
                    if 'conservation_assessment_date' in bird_details:
                        source = bird_details.get('conservation_status_source', 'IUCN')
                        st.write(f"**Assessed:** {bird_details['conservation_assessment_date']} ({source})")
                    
                    if 'threats' in bird_details and bird_details['threats']:
                        st.write("**Major Threats:**")
                        for threat in bird_details['threats']:
                            st.write(f"- {threat}")
                            
                    if 'information_sources' in bird_details and bird_details['information_sources']:
                        st.write("**Sources:** " + ", ".join(bird_details['information_sources']))
            else:
                st.warning(f"Predicted species ID '{species_id}' ({confidence:.2%}) but no detailed information found in database.")

if __name__ == "__main__":
    main()
