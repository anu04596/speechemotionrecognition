import React from "react";
import "./EmotionResult.css";

const EmotionResult = ({ result }) => {
  return (
    <div className="emotion-result">
      <h2>Your Emotion Analysis</h2>
      <div className="result-box">
        <h3>Detected Emotion: <span className="emotion-text">{result}</span></h3>
      </div>
    </div>
  );
};

export default EmotionResult;