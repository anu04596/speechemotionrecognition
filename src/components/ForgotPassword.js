import React from "react";
import { Link } from "react-router-dom";
import "./ForgotPassword.css";

const ForgotPassword = () => {
  return (
    <div className="forgot-container">
      <div className="forgot-box">
        <h2>Reset Your Password</h2>
        <p>Enter your email, and we'll send you a link to reset your password.</p>
        <form>
          <input type="email" placeholder="Enter your email" required />
          <button type="submit" className="forgot-btn">Send Reset Link</button>
        </form>
        <p><Link to="/login">Back to Login</Link></p>
      </div>
    </div>
  );
};

export default ForgotPassword;
