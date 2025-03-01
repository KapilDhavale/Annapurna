import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./Register.css";

const Register = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('provider'); // Default role
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', { 
        username, 
        email: email.toLowerCase(),
        password, 
        role 
      });
      console.log(response.data.message);
      setSuccess("Registration successful! Redirecting...");
      setError('');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      console.error("Registration error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Registration failed.");
      setSuccess('');
    }
  };

  return (
    <div className="register-page">
      <div className="register-overlay"></div>
      <div className="register-container">
        <h2>Register</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}
        <form className="register-form" onSubmit={handleSubmit}>
          <div className="input-container">
            <label className="register-label">Username:</label>
            <input 
              type="text" 
              className="register-input"
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required 
            />
          </div>
          <div className="input-container">
            <label className="register-label">Email:</label>
            <input 
              type="email" 
              className="register-input"
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          <div className="input-container">
            <label className="register-label">Password:</label>
            <input 
              type="password" 
              className="register-input"
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          <div className="input-container">
            <label className="register-label">Role:</label>
            <select 
              className="register-input"
              value={role} 
              onChange={(e) => setRole(e.target.value)} 
              required
            >
              <option value="provider">Provider</option>
              <option value="receiver">Receiver</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button type="submit">Register</button>
        </form>
      </div>
    </div>
  );
};

export default Register;
