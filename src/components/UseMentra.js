import React from "react";
import "./UseMentra.css";

const UseMentra = () => {
  return (
    <div className="use-mentra-container">
      <div className="glassmorphism-box">
        <h1>Analyze Your Emotions</h1>
        <p>Upload a file or record your voice to get insights into your emotions.</p>

        <div className="upload-section">
          <button className="upload-btn">📂 Upload File</button>
          <button className="record-btn">🎤 Record Audio</button>
        </div>

        <button className="submit-btn">🚀 Submit & Analyze</button>
      </div>
    </div>
  );
};

export default UseMentra;