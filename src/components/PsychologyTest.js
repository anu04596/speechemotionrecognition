import React, { useState } from "react";
import "./PsychologyTest.css";
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
} from "recharts";

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#8dd1e1', '#a4de6c'];



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
  const handleSubmit = async () => {
    console.log("Submit button clicked");
    const requiredGeneral = ["q1", "q2"];
    const requiredGenderSpecific = gender === "Female" ? ["qf1", "qf2"] : ["qm1", "qm2"];
    const allRequired = [...requiredGeneral, ...requiredGenderSpecific];

    const unanswered = allRequired.filter((q) => !answers[q]);

    if (unanswered.length > 0) {
      alert("Please answer all the questions before submitting.");
      return;
    }
    const insightsMap = {
      q1: {
        "Rarely": "You're likely managing your responsibilities well.",
        "Sometimes": "You experience occasional stress—try light mindfulness practices.",
        "Often": "You may need better time or emotional management strategies.",
        "Almost always": "Consider setting boundaries and using time management tools."
      },
      q2: {
        "Listening to music": "Music is a great stress-reliever—keep exploring calming tracks.",
        "Talking to someone": "Sharing emotions helps build resilience.",
        "Exercising": "Physical activity is a powerful stress buster—great choice!",
        "Staying alone": "Solitude is okay, but don’t forget social support matters too."
      },
      qf1: {
        "Bright colors energize me": "Your mood responds well to vibrant stimuli—use color in your surroundings.",
        "Dark colors calm me": "You may find peace in minimalist environments.",
        "Neutral tones feel safest": "You may prefer emotional balance and stability."
      },
      qf2: {
        "Talking to friends": "You value connection and emotional support.",
        "Writing it down": "Journaling helps you process thoughts—keep it up!",
        "Crying": "Crying is a healthy emotional release—never feel guilty about it.",
        "Keeping quiet": "It may help in the moment, but try to express emotions gradually."
      },
      qm1: {
        "Yes": "It's okay to feel that way, but opening up can bring emotional strength.",
        "No": "Great mindset! Expressing emotions is a sign of emotional intelligence."
      },
      qm2: {
        "Physical activity": "You're using your body to regulate stress—awesome!",
        "Talking to someone": "Great coping skill! Keep nurturing your support system.",
        "Keeping it to myself": "This might lead to internal stress—try opening up more.",
        "Focusing on work": "It’s good to stay busy, but also take breaks for mental health."
      }
    };

    const getMoodIcon = (answer) => {
      if (
        answer === "Almost always" ||
        answer === "Keeping it to myself" ||
        answer === "Crying"
      ) return "😔";
      if (
        answer === "Talking to someone" ||
        answer === "Exercising" ||
        answer === "Writing it down"
      ) return "😊";
      if (
        answer === "Listening to music" ||
        answer === "Bright colors energize me"
      ) return "🎶";
      if (answer === "Focusing on work") return "💼";
      return "🧠"; // default neutral icon
    };
    const answerScores = {
      "Rarely": 1,
      "Sometimes": 2,
      "Often": 3,
      "Almost always": 4,
      "Listening to music": 2,
      "Talking to someone": 3,
      "Exercising": 4,
      "Staying alone": 1,
      "Bright colors energize me": 3,
      "Dark colors calm me": 2,
      "Neutral tones feel safest": 1,
      "Talking to friends": 4,
      "Writing it down": 3,
      "Crying": 1,
      "Keeping quiet": 2,
      "Yes": 2,
      "No": 4,
      "Physical activity": 4,
      "Keeping it to myself": 1,
      "Focusing on work": 3,
    };

    const chart = Object.entries(answers).map(([id, answer]) => ({
      question: id,
      answer: answerScores[answer] || 0,   // Numeric score for bar height
      original: answer                     // Original answer for tooltip
    }));




    setChartData(chart);


    // Analyze insights
    let analysis = "Based on your responses, here are some insights:\n\n";
    for (const [questionId, answer] of Object.entries(answers)) {
      const insight = insightsMap[questionId]?.[answer];
      const icon = getMoodIcon(answer);
      if (insight) {
        analysis += `${icon} ${insight}\n`;
      }
    }


    setResultText(analysis);
    setShowResults(true);

    // ✅ Send to backend
    try {
      const response = await fetch("http://localhost:5000/submit-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gender, ...answers }),
      });
      const result = await response.json();
      console.log("Saved to CSV:", result.message);
    } catch (err) {
      console.error("Error saving data:", err);
    }
  };
  const [chartData, setChartData] = useState([]);



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
          <div id="results-to-download">
            <h3>Your Results</h3>
            <pre>{resultText}</pre>
          </div>

          {/* 📊 CHART VISUALIZATIONS START */}
          {/* 📊 Bar Chart - Always Visible */}
          <div className="bar-chart-container">
            <h3 style={{ marginTop: "30px" }}>📊 Your Response Visualization</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <XAxis dataKey="question" />
                <YAxis />

                {/* ✅ Custom Tooltip here */}
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div
                          style={{
                            backgroundColor: "white",
                            padding: "10px",
                            border: "1px solid #ccc",
                            borderRadius: "10px",
                          }}
                        >
                          <p><strong>Question:</strong> {data.question}</p>
                          <p><strong>Answer:</strong> {data.original}</p>
                          <p><strong>Score:</strong> {payload[0].value}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />

                <Legend />

                <Bar dataKey="answer">
                  {chartData.map((_, index) => (
                    <Cell key={`bar-${index}`} fill="#800080" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>




          </div>

          {/* 📊 CHART VISUALIZATIONS END */}
        </div>
      )}

    </div>
  );
};

export default PsychologyTest;