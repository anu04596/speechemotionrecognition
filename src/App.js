import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Homepage from "./components/Homepage";
import UseMentra from "./components/UseMentra";
import UseMentraSelection from "./components/UseMentraSelection";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Contact from "./components/Contact";
import ForgotPassword from "./components/ForgotPassword";
import { AuthProvider, useAuth } from "./components/AuthContext";
import Footer from "./components/Footer";
import PsychologyTest from "./components/PsychologyTest";
import PrivacyPolicy from "./components/PrivacyPolicy";
import Dashboard from "./components/Dashboard"; // ✅ Import Dashboard
import ProfileSettings from "./components/ProfileSettings"; // ✅ Import Profile Settings

// Protect routes when user is not logged in
const ProtectedRoute = ({ element }) => {
  const { user } = useAuth();
  return user ? element : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/use-mentra-selection" element={<UseMentraSelection />} />
          <Route path="/use-mentra" element={<UseMentra />} />
          <Route path="/psychology-test" element={<PsychologyTest />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/contact" element={<Contact />} />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
          <Route path="/profile-settings" element={<ProtectedRoute element={<ProfileSettings />} />} />
        </Routes>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;
