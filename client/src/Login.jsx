import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        username: username,
        password: password
      });

      if (response.data.user) {
        // --- CRITICAL FIX: Send TWO arguments now ---
        // 1. The role (lowercase)
        // 2. The full user object (contains staff_id)
        onLogin(response.data.user.role.toLowerCase(), response.data.user);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-glass-card">
        <div className="login-header">
          <div className="login-logo-icon">📦</div>
          <h1>IVMS</h1>
          <p>Inventory Management System</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <label>Username</label>
            <input 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              placeholder="Enter username"
              required 
            />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="Enter password"
              required 
            />
          </div>
          {error && <p style={{ color: '#ff6b6b', textAlign: 'center', fontSize: '14px' }}>{error}</p>}
          <button type="submit" className="login-btn">Sign In</button>
        </form>
      </div>
    </div>
  );
}

export default Login;