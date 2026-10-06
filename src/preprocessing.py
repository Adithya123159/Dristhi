import tensorflow as tf
from src.config import IMAGE_SIZE

def preprocess_image(image_path, target_size=IMAGE_SIZE):
    """Loads and preprocesses a single image for MobileNetV2 inference."""
    img = tf.io.read_file(image_path)
    img = tf.image.decode_jpeg(img, channels=3)
    img = tf.image.resize(img, target_size)
    # MobileNetV2 expects inputs in the range [-1, 1]
    img = tf.keras.applications.mobilenet_v2.preprocess_input(img)
    return img

def get_data_augmentation():
    """Returns a sequential model for data augmentation (used only during training)."""
    return tf.keras.Sequential([
        tf.keras.layers.RandomFlip("horizontal"),
        tf.keras.layers.RandomRotation(0.1),
        tf.keras.layers.RandomZoom(0.1),
    ])
