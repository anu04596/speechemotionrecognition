from flask import Flask, request, jsonify
from flask_cors import CORS
import csv
import os
import librosa
import numpy as np
import tensorflow as tf
import tempfile
import logging

# Enable logging
logging.basicConfig(level=logging.DEBUG)

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000", "https://famous-youtiao-c105ed.netlify.app"])

@app.route('/')
def home():
    return "Welcome to the Emotion Detection API!"
# Path to CSV file
CSV_FILE = "users.csv"

# Create CSV file if it doesn't exist
if not os.path.exists(CSV_FILE):
    with open(CSV_FILE, "w", newline="") as file:
        writer = csv.writer(file)
        writer.writerow(["Full Name", "Email", "Password"])  # Headers

# Initialize the LSTM model (ensure this is correct for your model)
model = tf.keras.models.load_model("model.h5")  # Replace with your actual model path

# Define emotion labels
emotion_labels = ['Happy', 'Fear', 'Sad', 'Neutral', 'Angry', 'Pleasant', 'Disgust']

@app.route("/signup", methods=["POST"])
def signup():
    data = request.json
    full_name = data.get("fullName")
    email = data.get("email")
    password = data.get("password")

    # Debugging: Print received data
    print(f"Received signup data: Full Name: {full_name}, Email: {email}, Password: {password}")

    # Check if all fields are provided
    if not full_name or not email or not password:
        return jsonify({"error": "All fields are required"}), 400

    # Check if email already exists
    with open(CSV_FILE, "r") as file:
        reader = csv.reader(file)
        next(reader)  # Skip header row
        for row in reader:
            if row and row[1] == email:
                return jsonify({"error": "Email already in use"}), 400

    # Add user to CSV if email doesn't exist
    try:
        with open(CSV_FILE, "a", newline="") as file:
            writer = csv.writer(file)
            writer.writerow([full_name, email, password])
            print(f"User {full_name} with email {email} registered successfully")
        return jsonify({"message": "User registered successfully!"}), 201
    except Exception as e:
        return jsonify({"error": f"Failed to register user: {str(e)}"}), 500


@app.route("/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    with open(CSV_FILE, "r") as file:
        reader = csv.reader(file)
        next(reader)  # Skip header
        for row in reader:
            if row and row[1] == email and row[2] == password:
                return jsonify({
                    "message": "Login successful!",
                    "user": {
                        "fullName": row[0],
                        "email": row[1]
                    }
                })

    return jsonify({"error": "Invalid credentials"}), 401


@app.route("/analyze", methods=["POST"])
def analyze():
    if 'audio' not in request.files:
        logging.error("No audio file found in request")
        return jsonify({"error": "No audio file found"}), 400

    audio_file = request.files['audio']
    logging.debug(f"Received audio file: {audio_file.filename}")

    try:
        # Save the uploaded audio temporarily
        tmp = tempfile.NamedTemporaryFile(delete=False, suffix=".wav")
        audio_file.save(tmp.name)
        tmp_path = tmp.name
        tmp.close()

        logging.debug(f"Saved audio file to {tmp_path}")

        # Load the audio file using librosa
        y, sr = librosa.load(tmp_path, sr=None)  # Use the original sample rate

        # Extract MFCC features
        mfccs = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=40)
        mfccs = np.mean(mfccs.T, axis=0)

        logging.debug(f"Extracted MFCCs: {mfccs.shape}")

        # Reshape for LSTM model input
        mfccs = np.expand_dims(mfccs, axis=-1)  # Add channel dimension
        mfccs = np.expand_dims(mfccs, axis=0)   # Add batch dimension
        logging.debug(f"Reshaped MFCCs for LSTM: {mfccs.shape}")

        # Predict the emotion using the LSTM model
        prediction = model.predict(mfccs)
        predicted_emotion = emotion_labels[np.argmax(prediction)]

        logging.debug(f"Predicted Emotion: {predicted_emotion}")

    except Exception as e:
        logging.error(f"Error analyzing audio: {str(e)}")
        return jsonify({"error": f"Error analyzing audio: {str(e)}"}), 500

    finally:
        try:
            os.remove(tmp_path)
        except:
            pass

    return jsonify({"emotion": predicted_emotion}), 200


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)), debug=True)
