import os
import tensorflow as tf
from src.config import RAW_DATA_DIR, BATCH_SIZE, IMAGE_SIZE, VALIDATION_SPLIT

def create_datasets():
    """Creates training and validation datasets from the raw image directory."""
    if not os.path.exists(RAW_DATA_DIR) or len(os.listdir(RAW_DATA_DIR)) == 0:
        raise ValueError(f"Raw data directory {RAW_DATA_DIR} is empty or missing. Please run setup_dataset.py first.")

    train_ds = tf.keras.preprocessing.image_dataset_from_directory(
        RAW_DATA_DIR,
        validation_split=VALIDATION_SPLIT,
        subset="training",
        seed=123,
        image_size=IMAGE_SIZE,
        batch_size=BATCH_SIZE
    )

    val_ds = tf.keras.preprocessing.image_dataset_from_directory(
        RAW_DATA_DIR,
        validation_split=VALIDATION_SPLIT,
        subset="validation",
        seed=123,
        image_size=IMAGE_SIZE,
        batch_size=BATCH_SIZE
    )

    class_names = train_ds.class_names

    AUTOTUNE = tf.data.AUTOTUNE
    
    # We apply the mobilenet_v2 preprocessing to the dataset
    def preprocess(x, y):
        return tf.keras.applications.mobilenet_v2.preprocess_input(x), y

    train_ds = train_ds.map(preprocess, num_parallel_calls=AUTOTUNE)
    val_ds = val_ds.map(preprocess, num_parallel_calls=AUTOTUNE)

    # Cache and prefetch for performance
    train_ds = train_ds.cache().shuffle(1000).prefetch(buffer_size=AUTOTUNE)
    val_ds = val_ds.cache().prefetch(buffer_size=AUTOTUNE)

    return train_ds, val_ds, class_names
