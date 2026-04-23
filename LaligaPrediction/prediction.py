import pandas as pd
import tensorflow as tf
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
import joblib
import os

# Project overall
# 1. Load Data
# 2. Preprocess Data
# 3. Build Model
# 4. Train Model
# 5. Evaluate Model
# 6. Predict
# I built a TensorFlow-based binary classification model to predict whether the home team wins a La Liga match.
# I used match statistics like shots, fouls, and cards as input features and mapped match outcomes into a binary label.
# I normalized the features using StandardScaler to ensure consistent scaling.
# Then I trained a neural network with two hidden layers and a sigmoid output using binary cross-entropy loss and Adam optimizer.
# Finally, I evaluated the model on a test set and used it to predict outcomes for new matches.


# =========================
# 1. LOAD DATA
# =========================
df = pd.read_csv('master_dataset.csv')


# Label (binary)
df["result"] = df["FTR"].map({"H": 1, "D": 0, "A": 0})

# Features
X = df[[
    "HS", "AS",
    "HST", "AST",
    "HF", "AF",
    "HC", "AC",
    "HY", "AY"
]]

y = df["result"]

# =========================
# 2. TRAIN / TEST SPLIT
# =========================
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# =========================
# 3. NORMALIZE (NO LEAKAGE)
# =========================

# We fit the scaler only on the training data to avoid data leakage.
# If we fit it on the entire dataset, information from the test set would influence the scaling parameters like mean and standard deviation.
# This would give the model indirect access to test data, leading to overly optimistic performance and poor generalization.
scaler = StandardScaler()

X_train = scaler.fit_transform(X_train)
X_test = scaler.transform(X_test)

# =========================
# 4. BUILD MODEL
# =========================
model = tf.keras.Sequential([
    tf.keras.Input(shape=(X_train.shape[1],)),
    tf.keras.layers.Dense(64, activation='relu'),
    tf.keras.layers.Dense(32, activation='relu'),
    tf.keras.layers.Dense(1, activation='sigmoid')
])

# =========================
# 5. COMPILE
# =========================
model.compile(
    optimizer='adam',
    loss='binary_crossentropy',
    metrics=['accuracy']
)

# =========================
# 6. EARLY STOPPING (ANTI-OVERFITTING)
# =========================
early_stop = tf.keras.callbacks.EarlyStopping(
    monitor='val_loss',
    patience=5,
    restore_best_weights=True
)

# =========================
# 7. TRAIN
# =========================
history = model.fit(
    X_train, y_train,
    epochs=50,
    batch_size=32,
    validation_data=(X_test, y_test),
    callbacks=[early_stop]
)

# =========================
# 8. EVALUATE (REAL PERFORMANCE)
# =========================
loss, accuracy = model.evaluate(X_test, y_test)
print(f"Test Accuracy: {accuracy:.4f}")

# =========================
# 9. PREDICTION
# =========================
match = pd.DataFrame({
    "HS": [2, 1],
    "AS": [0, 1],
    "HST": [1, 1],
    "AST": [0, 1],
    "HF": [1, 1],
    "AF": [1, 1],
    "HC": [1, 1],
    "AC": [1, 1],
    "HY": [1, 1],
    "AY": [1, 1]
})

match = scaler.transform(match)
prediction = model.predict(match)

print("Predictions:", prediction)

# convert to class
predicted_class = (prediction > 0.5).astype(int)
print("Predicted class:", predicted_class)

# =========================
# 10. SAVE MODEL & SCALER
# =========================
model_dir = os.path.dirname(os.path.abspath(__file__))
scaler_path = os.path.join(model_dir, 'scaler.pkl')
model_path = os.path.join(model_dir, 'laliga_model.keras')

joblib.dump(scaler, scaler_path)
model.save(model_path)
print(f"Saved scaler to {scaler_path}")
print(f"Saved model to {model_path}")