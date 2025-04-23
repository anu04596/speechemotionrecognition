import React from "react";
import { useNavigate } from "react-router-dom";
import "./UseMentraSelection.css"; // For styling

const UseMentraSelection = () => {
  const navigate = useNavigate();

  return (
    <div className="selection-container">
      <h2>Choose Your Mentra Experience</h2>
      <p>Select an option to continue:</p>

      <div className="button-container">
        <button onClick={() => navigate("/use-mentra")} className="analyze-button">
          Analyze Your Emotions
        </button>

        <button onClick={() => navigate("/psychology-test")} className="test-button">
          Take a Psychology Test
        </button>
      </div>
    </div>
  );
};

export default UseMentraSelection;