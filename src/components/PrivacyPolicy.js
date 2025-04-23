import React from "react";
import { Link } from "react-router-dom";
import "./PrivacyPolicy.css";

const PrivacyPolicy = () => {
  return (
    <div className="policy-container">
      <div className="policy-box">
        <h2>Privacy Policy</h2>
        <p>Welcome to Mentra. Your privacy is important to us.</p>
        
        <h3>1. Data Collection</h3>
        <p>We collect minimal personal data to improve your experience.</p>

        <h3>2. How We Use Your Data</h3>
        <p>Your data is used strictly for authentication and analysis purposes.</p>

        <h3>3. Security</h3>
        <p>We prioritize security to keep your information safe.</p>

        <div className="privacy-footer">
          <p>Have questions? <Link to="/contact">Contact Us</Link></p>
        </div>

        <Link to="/" className="back-home">Back to Home</Link>
      </div>
    </div>
  );
};

export default PrivacyPolicy;