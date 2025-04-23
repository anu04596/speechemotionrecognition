import React from "react";
import { useAuth } from "./AuthContext";
import "./ProfileSettings.css";

const ProfileSettings = () => {
  const { user, logout } = useAuth();

  if (!user) {
    return <div>Please log in to view your profile.</div>;
  }

  return (
    <div className="profile-container">
      <h1>Profile Page</h1>

      <div className="profile-section">
        <label>Full Name:</label>
        <input type="text" value={user.fullName} readOnly />
      </div>

      <div className="profile-section">
        <label>Email:</label>
        <input type="text" value={user.email} readOnly />
      </div>

      <button className="logout-button" onClick={logout}>Logout</button>
    </div>
  );
};

export default ProfileSettings;