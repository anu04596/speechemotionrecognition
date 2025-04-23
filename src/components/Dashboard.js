import React from "react";
import { Link } from "react-router-dom";
import "./Dashboard.css"; 

const Dashboard = () => {
  return (
    <div className="dashboard">
      <h2>Welcome, John Doe</h2>
      <div className="dashboard-links">
        <Link to="/use-mentra" className="dashboard-button">Start Emotion Analysis</Link>
        <Link to="/psychology-test" className="dashboard-button">Take Psychology Test</Link>
        <Link to="/mental-health-insights" className="dashboard-button">View Mental Health Insights</Link>
      </div>
      <div className="mood-tracker">
        <h3>Daily Mood Tracker</h3>
        <p>Graph & trends will be shown here</p>
      </div>
    </div>
  );
};

export default Dashboard;