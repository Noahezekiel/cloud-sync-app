// WelcomePage.js

import React from "react";
import { Link } from "react-router-dom";
import "./WelcomePage.css";

const WelcomePage = () => {
  return (
    <div className="welcome-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">☁️ Cloud Sync (Mini Dropbox)</div>
        <div className="nav-links">
          <Link to="/login" className="nav-btn">Login</Link>
          <Link to="/signup" className="nav-btn signup">Sign Up</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <h1>Welcome to Cloud Sync</h1>
        <p>Store, sync, and share your files securely in the cloud.</p>
        <div className="hero-buttons">
          <Link to="/signup" className="primary-btn">Get Started</Link>
          <Link to="/login" className="secondary-btn">Already have an account?</Link>
        </div>
      </section>
    </div>
  );
};

export default WelcomePage;
