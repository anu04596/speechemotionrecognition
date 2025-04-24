import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);  // Manage user state

  // Check for user in localStorage on component mount (for persistent login)
  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (savedUser) {
      setUser(savedUser);  // If a user exists in localStorage, set it in state
    }
  }, []);

  // Signup function
  const signup = async (fullName, email, password) => {
    try {
      const response = await fetch("https://mentra-iuml.onrender.com/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email, password }),
      });

      if (response.ok) {
        return true;  // Successful signup
      } else {
        const data = await response.json();
        if (data.error) {
          setError(data.error);  // Display the error message from the backend
        }
        return false;  // Email already in use or some server issue
      }
    } catch (error) {
      console.error("Signup error:", error);
      setError("Something went wrong. Please try again.");
      return false;
    }
  };

  // Login function
  const login = async (email, password) => {
    try {
      const response = await fetch("https://mentra-iuml.onrender.com/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);  // Save the user object
        localStorage.setItem("user", JSON.stringify(data.user));  // Save to localStorage for persistence
        return true;
      } else {
        const data = await response.json();
        if (data.error) {
          setError(data.error);
        }
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Something went wrong. Please try again.");
      return false;
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);  // Clear user info on logout
    localStorage.removeItem("user");  // Remove user from localStorage
  };

  return (
    <AuthContext.Provider value={{ signup, login, logout, user, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
