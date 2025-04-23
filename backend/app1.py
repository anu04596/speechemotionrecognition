from flask import Flask, request, jsonify
from flask_cors import CORS
import csv

app = Flask(__name__)
CORS(app)

@app.route('/submit-test', methods=['POST'])
def save_to_csv():
    data = request.json

    # Define your fieldnames dynamically or hardcoded
    fieldnames = list(data.keys())

    with open('psych_test_data.csv', 'a', newline='') as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        if csvfile.tell() == 0:  # if file is empty
            writer.writeheader()
        writer.writerow(data)

    return jsonify({"message": "Data saved successfully"}), 200

if __name__ == '__main__':
    app.run(debug=True)