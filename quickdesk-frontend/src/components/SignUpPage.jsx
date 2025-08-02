import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const SignUpPage = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '', role: '', secret: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      await axios.post('http://localhost:5000/auth/register', formData);
      alert('Registration successful. Please login.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: 'auto', padding: 20 }}>
      <h2>Sign Up</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>Username:<br />
          <input name="username" value={formData.username} onChange={handleChange} required style={{ width: '100%' }} />
        </label><br /><br />

        <label>Email:<br />
          <input type="email" name="email" value={formData.email} onChange={handleChange} required style={{ width: '100%' }} />
        </label><br /><br />

        <label>Password:<br />
          <input type="password" name="password" value={formData.password} onChange={handleChange} required style={{ width: '100%' }} />
        </label><br /><br />

        <label>Role:<br />
          <select name="role" value={formData.role} onChange={handleChange} required style={{ width: '100%' }}>
            <option value="">Select Role</option>
            <option value="user">User</option>
            <option value="agent">Agent</option>
            <option value="admin">Admin</option>
          </select>
        </label><br /><br />

        {(formData.role === 'agent' || formData.role === 'admin') && (
          <>
            <label>Secret Code:<br />
              <input type="password" name="secret" value={formData.secret} onChange={handleChange} required style={{ width: '100%' }} />
            </label><br /><br />
          </>
        )}

        <button type="submit" style={{ width: '100%' }}>Sign Up</button>
      </form>
      <p>Already have an account? <Link to="/login">Login</Link></p>
    </div>
  );
};

export default SignUpPage;