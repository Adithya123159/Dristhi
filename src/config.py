import os

# Base paths
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, 'data')
RAW_DATA_DIR = os.path.join(DATA_DIR, 'raw')
PROCESSED_DATA_DIR = os.path.join(DATA_DIR, 'processed')
MODELS_DIR = os.path.join(BASE_DIR, 'models')

# Data files
CLASS_NAMES_FILE = os.path.join(DATA_DIR, 'class_names.json')
BIRD_INFO_FILE = os.path.join(BASE_DIR, 'app', 'bird_info.json')

# Image properties (Standard for MobileNetV2)
IMAGE_WIDTH = 224
IMAGE_HEIGHT = 224
IMAGE_CHANNELS = 3
IMAGE_SIZE = (IMAGE_WIDTH, IMAGE_HEIGHT)

# Training properties
BATCH_SIZE = 32
EPOCHS = 20
LEARNING_RATE = 0.001
VALIDATION_SPLIT = 0.2

# We will start with a 10-species subset to prove the end-to-end pipeline
NUM_CLASSES = 10
