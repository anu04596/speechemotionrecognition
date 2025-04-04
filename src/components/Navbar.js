import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext"; // Import the hook
import "./Navbar.css";

const Navbar = () => {
  const { user, logout } = useAuth();  // Access user and logout from context
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();  // Call logout function from context
    navigate("/login");  // Redirect to login page after logout
  };

  return (
    <nav className="navbar">
      <div className="logo">
        Mentra {/* Non-clickable logo */}
      </div>

      <ul className="nav-links">
        <li><Link to="/" className="nav-link">Home</Link></li>  {/* Home link */}

        {user && <li><Link to="/dashboard" className="nav-link">Dashboard</Link></li>}  {/* Show Dashboard if logged in */}

        {user ? (  // If user is logged in
          <li className="profile-menu">
            <button className="profile-btn" onClick={() => setDropdownOpen(!dropdownOpen)}>
              {user.fullName} ⏷  {/* Display user's name */}
            </button>
            {dropdownOpen && (
              <div className="profile-dropdown">
                <Link to="/profile-settings" className="dropdown-item">Profile & Settings</Link>
                <button className="logout-btn" onClick={handleLogout}>Logout</button>
              </div>
            )}
          </li>
        ) : (  // If user is not logged in
          <>
            <li><Link to="/login" className="nav-auth-btn">Login</Link></li>
            <li><Link to="/signup" className="nav-auth-btn signup-btn">Sign Up</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
