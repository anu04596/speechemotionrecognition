import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

const Signup = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    // Clear any previous error messages
    setError("");

    // Validation for empty fields
    if (!fullName || !email || !password || !confirmPassword) {
      setError("All fields are required!");
      return;
    }

    // Validation for password mismatch
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    // Basic password validation (e.g., minimum length)
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    try {
      const response = await fetch("http://mentra-iuml.onrender.com/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Redirect to login page after successful signup
        navigate("/login");
      } else {
        // Show error message if email is already in use or any other issue
        setError(data.error || "Signup failed. Please try again.");
      }
    } catch (error) {
      setError("An error occurred while communicating with the server.");
      console.error("Signup error:", error);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Sign Up</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSignup}>
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <div className="privacy-policy">
            <input
              type="checkbox"
              id="privacy-check"
              checked={isChecked}
              onChange={() => setIsChecked(!isChecked)}
              required
            />
            <label htmlFor="privacy-check">
              I agree to the <a href="/privacy-policy">Privacy Policy</a>
            </label>
          </div>
          <button type="submit" className="auth-btn" disabled={!isChecked}>
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
