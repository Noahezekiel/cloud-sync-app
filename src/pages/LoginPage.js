// LoginPage.js
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signIn } from "aws-amplify/auth";  // ✅ correct import
import "./LoginPage.css";

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signIn({ username: email, password }); // ✅ call signIn directly
      navigate("/home");
    } catch (err) {
      setError(err.message || "Failed to sign in");
    }
  };

  return (
    <div className="login-container">
      {/* Navbar */}
      <nav className="navbar">
        <Link to="/" className="logo">☁️ Cloud Sync</Link>
        <div className="nav-links">
          <Link to="/signup" className="nav-btn signup">Sign Up</Link>
        </div>
      </nav>

      {/* Login Form */}
      <section className="form-section">
        <h1>Login to Your Account</h1>
        <form onSubmit={handleLogin} className="auth-form">
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

          {error && <p className="error">{error}</p>}

          <button type="submit" className="primary-btn">Login</button>
        </form>

        <p>
          Don’t have an account? <Link to="/signup">Sign up</Link>
        </p>
      </section>
    </div>
  );
}

export default LoginPage;
