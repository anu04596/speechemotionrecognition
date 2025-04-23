import React, { useState, useRef } from "react";
import axios from "axios";
import "./UseMentra.css";

function UseMentra() {
  const [audioFile, setAudioFile] = useState(null);
  const [emotion, setEmotion] = useState("");
  const [loading, setLoading] = useState(false);
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState("");

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // Upload handler
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setAudioFile(file);
    setAudioURL(URL.createObjectURL(file));
  };

  // Start mic recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
        setAudioFile(audioBlob);
        setAudioURL(URL.createObjectURL(audioBlob));
      };

      mediaRecorderRef.current.start();
      setRecording(true);
    } catch (err) {
      alert("Microphone permission denied or not supported.");
      console.error(err);
    }
  };

  // Stop mic recording
  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  // Send to backend
  const sendAudioToBackend = async () => {
    if (!audioFile) {
      alert("Please upload or record an audio first.");
      return;
    }

    const formData = new FormData();
    formData.append("audio", audioFile);

    try {
      setLoading(true);
      setEmotion("");
      const response = await axios.post("http://localhost:5000/analyze", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
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
      <p>Upload a .wav file or record your voice below:</p>

      {/* Upload section */}
      <div className="upload-section">
        <label htmlFor="audioUpload">📁 Upload .wav</label>
        <input id="audioUpload" type="file" accept=".wav" onChange={handleFileChange} />
      </div>

      {/* Mic recording */}
      <div className="button-group">
        {!recording ? (
          <button className="mic-button" onClick={startRecording}>🎙 Start Recording</button>
        ) : (
          <button className="mic-button" onClick={stopRecording}>🛑 Stop Recording</button>
        )}
        <button onClick={sendAudioToBackend} disabled={!audioFile || loading}>
          {loading ? "Analyzing..." : "Analyze Audio"}
        </button>
      </div>

      {/* Audio preview */}
      {audioURL && (
        <div className="audio-preview">
          <p>Preview:</p>
          <audio controls src={audioURL} />
        </div>
      )}

      {/* Result */}
      {emotion && (
        <div className="result-box">
          <h3>Detected Emotion:</h3>
          <p>{emotion}</p>
        </div>
      )}
    </div>
  );
}

export default UseMentra;
