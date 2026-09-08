import React, { useState } from 'react';
import * as api from '../api';
import { Profile } from '../types';

interface LoginPageProps {
  onLoginSuccess: (profile: Profile) => void;
  onForgotPassword: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onForgotPassword }) => {
  const [email, setEmail] = useState('alex.doe@example.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Email and password are required.');
      return;
    }
    try {
      const profile = await api.login(email, password); // FR-001
      onLoginSuccess(profile);
    } catch (err) {
      setError('Login failed. Please check your credentials.');
    }
  };

  return (
    <div>
      <h1>Employee Login</h1>
      {error && <div className="message error">{error}</div>}
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn">Log In</button>
      </form>
      <a href="#" className="link" onClick={(e) => {e.preventDefault(); onForgotPassword();}}>
        Forgot Password?
      </a>
    </div>
  );
};

export default LoginPage;
