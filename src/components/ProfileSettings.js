import React from "react";
import { useAuth } from "./AuthContext";

const ProfileSettings = () => {
  const { user, logout, error } = useAuth();

  // If no user is logged in, prompt the user to log in
  if (!user) {
    return <div>Please log in to view your profile.</div>;
  }

  // Log user data for debugging purposes
  console.log(user);

  return (
    <div style={{ backgroundColor: "white", padding: "20px", color: "black" }}>
      <h1>Profile Page</h1>
      <p>Welcome, {user.fullName}!</p> {/* Display the user's full name */}
      <p>Email: {user.email}</p> {/* Display the user's email */}
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default ProfileSettings;
