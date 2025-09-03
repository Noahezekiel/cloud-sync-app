// src/pages/SignupPage.js
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";  // ✅ added Link
import { signUp } from "aws-amplify/auth";
import "./SignupPage.css";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await signUp({
        username: formData.email, // ✅ use email as username
        password: formData.password,
        attributes: {
          name: formData.fullName,
          email: formData.email,
        },
      });
      alert("Signup successful! Please confirm your email.");
      navigate("/login");
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  return (
    <div className="signup-container">
      {/* Navbar */}
      <nav className="navbar">
        <Link to="/" className="logo">☁️ Cloud Sync</Link>
        <div className="nav-links">
          <Link to="/login" className="nav-btn login">Login</Link>
        </div>
      </nav>

      {/* ✅ Signup Form */}
      <section className="form-section">
        <form onSubmit={handleSubmit} className="auth-form">
          <h2>Create Account</h2>

          {error && <p className="error">{error}</p>}

          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button type="submit" className="primary-btn">Sign Up</button>
        </form>

        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </section>
    </div>
  );
}
