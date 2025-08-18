import React from "react";
import "./WelcomePage.css";

const WelcomePage = () => {
  return (
    <div className="welcome-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">☁️ Cloud Sync (Mini Dropbox)</div>
        <div className="nav-links">
          <a href="/login" className="nav-btn">Login</a>
          <a href="/signup" className="nav-btn signup">Sign Up</a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <h1>Welcome to Cloud Sync</h1>
        <p>Store, sync, and share your files securely in the cloud.</p>
        <div className="hero-buttons">
          <a href="/signup" className="primary-btn">Get Started</a>
          <a href="/login" className="secondary-btn">Already have an account?</a>
        </div>
      </section>
    </div>
  );
};

export default WelcomePage;
