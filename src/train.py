import os
import json
import tensorflow as tf
from src.config import MODELS_DIR, EPOCHS, LEARNING_RATE, IMAGE_SIZE, IMAGE_CHANNELS
from src.dataset import create_datasets
from src.preprocessing import get_data_augmentation

def build_model(num_classes):
    """Builds the MobileNetV2 based classification model."""
    inputs = tf.keras.Input(shape=IMAGE_SIZE + (IMAGE_CHANNELS,))
    
    # Data Augmentation layer
    x = get_data_augmentation()(inputs)
    
    # Pre-trained base model
    base_model = tf.keras.applications.MobileNetV2(
        input_shape=IMAGE_SIZE + (IMAGE_CHANNELS,),
        include_top=False,
        weights='imagenet'
    )
    base_model.trainable = False # Freeze base model initially
    
    x = base_model(x, training=False)
    x = tf.keras.layers.GlobalAveragePooling2D()(x)
    x = tf.keras.layers.Dropout(0.2)(x)
    outputs = tf.keras.layers.Dense(num_classes, activation='softmax')(x)
    
    model = tf.keras.Model(inputs, outputs)
    
    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=LEARNING_RATE),
        loss=tf.keras.losses.SparseCategoricalCrossentropy(),
        metrics=['accuracy']
    )
    return model

def train():
    if not os.path.exists(MODELS_DIR):
        os.makedirs(MODELS_DIR)

    train_ds, val_ds, class_names = create_datasets()
    num_classes = len(class_names)
    
    print(f"Training on {num_classes} classes: {class_names}")

    model = build_model(num_classes)
    
    # Callbacks
    checkpoint_path = os.path.join(MODELS_DIR, 'best_model.h5')
    callbacks = [
        tf.keras.callbacks.ModelCheckpoint(
            filepath=checkpoint_path,
            save_best_only=True,
            monitor='val_accuracy'
        ),
        tf.keras.callbacks.EarlyStopping(
            monitor='val_loss',
            patience=3,
            restore_best_weights=True
        )
    ]

    history = model.fit(
        train_ds,
        validation_data=val_ds,
        epochs=EPOCHS,
        callbacks=callbacks
    )

    # Save class names mapping used during training
    mapping_path = os.path.join(MODELS_DIR, 'model_class_mapping.json')
    mapping = {str(i): name for i, name in enumerate(class_names)}
    with open(mapping_path, 'w') as f:
        json.dump(mapping, f, indent=4)
        
    print(f"Training complete. Best model saved to {checkpoint_path}")

if __name__ == "__main__":
    train()
