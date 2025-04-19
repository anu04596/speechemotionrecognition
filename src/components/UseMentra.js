import React, { useState, useRef } from "react";
import axios from "axios";
import "./UseMentra.css"; // Optional styling

const UseMentra = () => {
  const [recording, setRecording] = useState(false);
  const [emotion, setEmotion] = useState(null);
  const [loading, setLoading] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // 🎙️ Start Recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
        await sendAudioToBackend(audioBlob);
      };

      mediaRecorderRef.current.start();
      setRecording(true);
      setEmotion(null); // clear previous result
    } catch (err) {
      console.error("Mic access error:", err);
      alert("Please allow microphone access to record audio.");
    }
  };

  // 🛑 Stop Recording
  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  // 📁 Upload .wav file
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    await sendAudioToBackend(file);
  };

  // 🚀 Send Audio to Flask API
  const sendAudioToBackend = async (audioBlob) => {
    const formData = new FormData();
    formData.append("audio", audioBlob, "recording.wav");

    try {
      setLoading(true);
      const response = await axios.post("http://localhost:5000/analyze", formData);
      setEmotion(response.data.emotion);
    } catch (error) {
      console.error("Error sending audio:", error);
      setEmotion("Error analyzing audio.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mentra-container">
      <h2>🎤 Analyze Your Emotion</h2>
      <p>You can record your voice or upload a `.wav` file to detect your emotion.</p>

      <div className="button-group">
        <button onClick={startRecording} disabled={recording}>
          {recording ? "Recording..." : "Start Recording"}
        </button>

        <button onClick={stopRecording} disabled={!recording}>
          Stop & Analyze
        </button>
      </div>

      <div className="upload-section">
        <p>Or upload a `.wav` file:</p>
        <input type="file" accept="audio/wav" onChange={handleFileUpload} />
      </div>

      {loading && <p className="loading-text">Analyzing your emotion...</p>}

      {emotion && !loading && (
        <div className="result-box">
          <h3>Detected Emotion:</h3>
          <p>{emotion}</p>
        </div>
      )}
    </div>
  );
};

export default UseMentra;
