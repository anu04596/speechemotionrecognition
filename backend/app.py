from flask import Flask, request, jsonify
from flask_cors import CORS
import csv
import os
import librosa
import numpy as np
import tensorflow as tf
import tempfile
import logging
logging.basicConfig(level=logging.DEBUG)

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000", "https://famous-youtiao-c105ed.netlify.app"])



# ---------- User Auth Setup ----------
CSV_FILE = "users.csv"

# Ensure users.csv exists with headers
if not os.path.exists(CSV_FILE):
    with open(CSV_FILE, mode="w", newline="") as file:
        writer = csv.writer(file)
        writer.writerow(["fullName", "email", "password"])

# 📌 SignUp route
@app.route("/signup", methods=['POST'])
def signup():
    data = request.get_json()
    fullName = data['fullName']
    email = data['email']
    password = data['password']

    # Check if all fields are provided
    if not fullName or not email or not password:
        return jsonify({"error": "All fields are required"}), 400

    # Check if user already exists in the CSV file
    with open(CSV_FILE, "r") as file:
        reader = csv.reader(file)
        next(reader)  # Skip header
        for row in reader:
            if row and row[1].strip() == email:  # Check email in CSV
                return jsonify({"error": "Email already in use"}), 409

    # Add new user to CSV
    with open(CSV_FILE, "a", newline="") as file:
        writer = csv.writer(file)
        writer.writerow([fullName, email, password])

    return jsonify({"message": "Signup successful!"}), 201


# 📌 Login Route
@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email", "").strip()
    password = data.get("password", "").strip()

    # TEMP hardcoded test
    if email == "john@example.com" and password == "12345":
        return jsonify({
            "message": "Login successful!",
            "user": {"fullName": "John Doe", "email": "john@example.com"}
        }), 200

    return jsonify({"error": "Invalid credentials"}), 401

if __name__ == "__main__":
    app.run(debug=True)
