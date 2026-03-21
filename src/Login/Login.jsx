import React, { useState, useContext } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import { loginUser, fetchUserProfile } from "../services/api"
import { AuthContext } from "../context/AuthContext"
import { toast } from "react-toastify";

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  const validate = () => {
    if (!email) { setError('Please enter your email.'); return false; }
    if (!/\S+@\S+\.\S+/.test(email)) { setError('Please enter a valid email address.'); return false; }
    if (!password) { setError('Please enter your password.'); return false; }
    setError(''); return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const response = await loginUser({ email, password });
      if (response.token) {
        localStorage.setItem("token", response.token);

        // User profile fetch karo aur context mein set karo
        const userDetails = await fetchUserProfile();
        if (userDetails && !userDetails.message) {
          setUser(userDetails);
          toast.success("Login successful");

          // Role ke hisaab se redirect
          if (userDetails.role === "admin") navigate("/dashboard/admin");
          else if (userDetails.role === "technician") navigate("/dashboard/technician");
          else navigate("/dashboard/home");
        } else {
          toast.error("Failed to load user profile");
        }
      } else {
        toast.error(response.message || "Login failed");
        setError(response.message || "Login failed");
      }
    } catch (err) {
      setError("Something went wrong");
    }
    setLoading(false);
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <h2 style={{ margin: "0 0 6px" }}>IT Help Desk</h2>
          <p style={{ margin: 0, color: "#666", fontSize: 14 }}>Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <label>
            Email
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com" autoComplete="username" />
          </label>
          <label>
            Password
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password" autoComplete="current-password" />
          </label>
          {error && <div className="login-error">{error}</div>}
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div style={{ marginTop: 20, padding: 14, background: "#f8fafc", borderRadius: 8, fontSize: 13, color: "#666", textAlign: "center" }}>
          <p style={{ margin: 0 }}>🔒 Contact your administrator to get access</p>
        </div>
      </div>
    </div>
  );
}
