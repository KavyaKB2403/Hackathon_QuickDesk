import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const userId = searchParams.get('id');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    if(password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      await axios.post('http://localhost:5000/auth/reset-password', { userId, token, password });
      alert('Password reset successful. Please login.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Reset failed');
    }
  };

  if (!token || !userId) {
    return (
      <div style={{ maxWidth: 400, margin: 'auto', padding: 20 }}>
        <p>Invalid or expired link. <Link to="/forgot-password">Request a new one</Link>.</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 400, margin: 'auto', padding: 20 }}>
      <h2>Reset Password</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>New Password:<br />
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required style={{ width: '100%' }} />
        </label><br /><br />
        <label>Confirm Password:<br />
          <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required style={{ width: '100%' }} />
        </label><br /><br />
        <button type="submit" style={{ width: '100%' }}>Reset Password</button>
      </form>
    </div>
  );
};

export default ResetPasswordPage;
