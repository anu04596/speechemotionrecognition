import React from "react";
import Navbar from "./Navbar"; // Navbar added
import "./Homepage.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";// Import Auth Context

const Homepage = () => {
  const navigate = useNavigate();
  const { user } = useAuth(); // Get user authentication status

  const handleUseMentraClick = () => {
    if (user) {
      navigate("/use-mentra-selection"); // Go to selection page if logged in
    } else {
      navigate("/login"); // Redirect to login if not logged in
    }
  };

  return (
    <div className="homepage">
      <Navbar /> {/* Top Navigation Bar */}

      {/* Hero Section */}
      <div className="hero-section">
        <h1>
          Welcome to <span className="mentra-text">Mentra</span>
        </h1>
        <p className="subheading">Discover Yourself Through Emotion Analysis</p>

        {/* Updated navigation to check authentication before accessing the selection page */}
        <button className="btn btn-primary cta-button" onClick={handleUseMentraClick}>
          Use Mentra
        </button>
      </div>

      {/* Why Choose Mentra - High-Class Design */}
      <div className="why-mentra">
        <h2 className="section-title">Why Choose Mentra?</h2>
        <div className="scrolling-boxes">
          <div className="info-box">🎯 AI-Powered Emotion Analysis</div>
          <div className="info-box">💡 Scientifically Backed Insights</div>
          <div className="info-box">🔒 Secure & Private</div>
          <div className="info-box">🚀 Lightning-Fast Results</div>
          <div className="info-box">🌍 Available 24/7 Anytime</div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;