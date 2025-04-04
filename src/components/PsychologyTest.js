import React, { useState } from "react";
import "./PsychologyTest.css";

const PsychologyTest = () => {
  const [gender, setGender] = useState(""); // Store gender selection
  const [answers, setAnswers] = useState({}); // Store answers
  const [showResults, setShowResults] = useState(false); // Control results display
  const [resultText, setResultText] = useState(""); // Store result text

  // General Questions (For everyone)
  const generalQuestions = [
    {
      id: "q1",
      question: "How often do you feel overwhelmed by daily responsibilities?",
      options: ["Rarely", "Sometimes", "Often", "Almost always"],
    },
    {
      id: "q2",
      question: "How do you usually cope with stress?",
      options: [
        "Listening to music",
        "Talking to someone",
        "Exercising",
        "Staying alone",
      ],
    },
  ];

  // Female-Specific Questions
  const femaleQuestions = [
    {
      id: "qf1",
      question: "How do colors influence your mood?",
      options: [
        "Bright colors energize me",
        "Dark colors calm me",
        "Neutral tones feel safest",
      ],
    },
    {
      id: "qf2",
      question: "How do you express emotions when feeling low?",
      options: ["Talking to friends", "Writing it down", "Crying", "Keeping quiet"],
    },
  ];

  // Male-Specific Questions
  const maleQuestions = [
    {
      id: "qm1",
      question: "Do you believe expressing emotions is a sign of weakness?",
      options: ["Yes", "No"],
    },
    {
      id: "qm2",
      question: "How do you handle stress?",
      options: [
        "Physical activity",
        "Talking to someone",
        "Keeping it to myself",
        "Focusing on work",
      ],
    },
  ];

  // Store answers
  const handleAnswerChange = (questionId, answer) => {
    setAnswers({ ...answers, [questionId]: answer });
  };

  // Analyze results and display insights
  const handleSubmit = () => {
    let analysis = "Based on your responses, here are some insights:\n";

    if (answers.q1 === "Almost always") {
      analysis += "- Try time management techniques to reduce stress.\n";
    }
    if (answers.q2 === "Staying alone") {
      analysis += "- Consider social interaction for emotional well-being.\n";
    }
    if (gender === "Female" && answers.qf1 === "Bright colors energize me") {
      analysis += "- Bright colors can positively impact your emotions!\n";
    }
    if (gender === "Male" && answers.qm1 === "Yes") {
      analysis += "- Expressing emotions is healthy, not a weakness.\n";
    }

    setResultText(analysis);
    setShowResults(true);
  };

  return (
    <div className="psychology-test-container">
      <h2>Psychology Test for Mental Health</h2>
      <p>Answer a few questions to get personalized insights.</p>

      {/* Gender Selection */}
      <label>Select Your Gender:</label>
      <select value={gender} onChange={(e) => setGender(e.target.value)}>
        <option value="">Select</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
      </select>

      {/* Show Questions After Gender Selection */}
      {gender && (
        <>
          {/* General Questions */}
          {generalQuestions.map((q) => (
            <div key={q.id} className="question-box">
              <p>{q.question}</p>
              {q.options.map((opt) => (
                <label key={opt}>
                  <input
                    type="radio"
                    name={q.id}
                    value={opt}
                    onChange={() => handleAnswerChange(q.id, opt)}
                  />
                  {opt}
                </label>
              ))}
            </div>
          ))}

          {/* Gender-Specific Questions */}
          {gender === "Female" &&
            femaleQuestions.map((q) => (
              <div key={q.id} className="question-box">
                <p>{q.question}</p>
                {q.options.map((opt) => (
                  <label key={opt}>
                    <input
                      type="radio"
                      name={q.id}
                      value={opt}
                      onChange={() => handleAnswerChange(q.id, opt)}
                    />
                    {opt}
                  </label>
                ))}
              </div>
            ))}

          {gender === "Male" &&
            maleQuestions.map((q) => (
              <div key={q.id} className="question-box">
                <p>{q.question}</p>
                {q.options.map((opt) => (
                  <label key={opt}>
                    <input
                      type="radio"
                      name={q.id}
                      value={opt}
                      onChange={() => handleAnswerChange(q.id, opt)}
                    />
                    {opt}
                  </label>
                ))}
              </div>
            ))}

          {/* Submit Button */}
          <button onClick={handleSubmit} className="submit-button">
            Submit
          </button>
        </>
      )}

      {/* Show Results */}
      {showResults && (
        <div className="results-container">
          <h3>Your Results</h3>
          <pre>{resultText}</pre>
        </div>
      )}
    </div>
  );
};

export default PsychologyTest;
