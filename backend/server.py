from flask import Flask, request, jsonify
from flask_cors import CORS
import csv
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Path to CSV file
CSV_FILE = "users.csv"

# Create CSV file if it doesn't exist
if not os.path.exists(CSV_FILE):
    with open(CSV_FILE, "w", newline="") as file:
        writer = csv.writer(file)
        writer.writerow(["Full Name", "Email", "Password"])  # Headers

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



if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)