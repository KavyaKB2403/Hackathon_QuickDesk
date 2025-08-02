import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './LoginPage.css';

const LoginPage = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState('admin@quickdesk.com');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDebug, setShowDebug] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/auth/login', {
        email,
        password
      });

      // Store authentication data
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // Update authentication state in parent
      setIsAuthenticated(true);
      
      // Navigate to dashboard
      navigate('/dashboard', { replace: true });
      
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Logo/Icon */}
        <div className="logo-container">
          <div className="logo-circle">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
              <path d="M12 1C8.14 1 5 4.14 5 8C5 8.78 5.16 9.53 5.45 10.2L2.39 11.33C2.15 11.42 2 11.66 2 11.92V16.08C2 16.34 2.15 16.58 2.39 16.67L5.45 17.8C5.16 18.47 5 19.22 5 20C5 21.66 6.34 23 8 23S11 21.66 11 20C11 19.22 10.84 18.47 10.55 17.8L13.61 16.67C13.85 16.58 14 16.34 14 16.08V11.92C14 11.66 13.85 11.42 13.61 11.33L10.55 10.2C10.84 9.53 11 8.78 11 8C11 4.14 7.86 1 4 1H12Z"/>
            </svg>
          </div>
        </div>

        <h1 className="login-title">QuickDesk Pro</h1>
        <p className="login-subtitle">Complete Help Desk System</p>

        {/* Error Message */}
        {error && (
          <div className="error-alert">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12S6.48 22 12 22 22 17.52 22 12 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z"/>
            </svg>
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div className="input-wrapper">
              <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z"/>
              </svg>
              <input
                type="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@quickdesk.com"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-wrapper">
              <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 8H17V6C17 3.24 14.76 1 12 1S7 3.24 7 6V8H6C4.9 8 4 8.9 4 10V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V10C20 8.9 19.1 8 18 8ZM12 17C10.9 17 10 16.1 10 15S10.9 13 12 13S14 13.9 14 15S13.1 17 12 17ZM15.1 8H8.9V6C8.9 4.29 10.29 2.9 12 2.9S15.1 4.29 15.1 6V8Z"/>
              </svg>
              <input
                type="password"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button type="submit" className="signin-btn" disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        {/* Sign Up Link */}
        <p className="signup-link">
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>

        {/* Debug Toggle */}
        <button 
          className="debug-toggle"
          onClick={() => setShowDebug(!showDebug)}
        >
          ⚙️ Toggle Debug Panel
        </button>
      </div>

      {/* Debug Panel */}
      {showDebug && (
        <div className="debug-panel">
          <h4>Debug Info</h4>
          <p>Email: {email}</p>
          <p>Password: {'•'.repeat(password.length)}</p>
          <p>Loading: {loading.toString()}</p>
          <p>Error: {error || 'None'}</p>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
