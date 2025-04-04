from flask import Flask, request, jsonify
import csv
import os

app = Flask(__name__)

# CSV file path
CSV_FILE = "users.csv"

# Ensure CSV file exists with headers
if not os.path.exists(CSV_FILE):
    with open(CSV_FILE, mode="w", newline="") as file:
        writer = csv.writer(file)
        writer.writerow(["fullName", "email", "password"])  # Add headers

# 📌 Signup Route
@app.route("/signup", methods=["POST"])
def signup():
    data = request.json
    fullName = data.get("fullName")
    email = data.get("email")
    password = data.get("password")

    if not fullName or not email or not password:
        return jsonify({"error": "All fields are required"}), 400

    # Check if user already exists
    with open(CSV_FILE, "r") as file:
        reader = csv.reader(file)
        for row in reader:
            if row and row[1] == email:  # Check email in CSV
                return jsonify({"error": "Email already in use"}), 409

    # Add new user to CSV
    with open(CSV_FILE, "a", newline="") as file:
        writer = csv.writer(file)
        writer.writerow([fullName, email, password])

    return jsonify({"message": "Signup successful!"}), 201

# 📌 Login Route
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
                return jsonify({"message": "Login successful!", "user": {"fullName": row[0], "email": row[1]}}), 200

    return jsonify({"error": "Invalid credentials"}), 401

if __name__ == "__main__":
    app.run(debug=True)
