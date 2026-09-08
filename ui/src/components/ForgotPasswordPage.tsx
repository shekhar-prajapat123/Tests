import React, { useState } from 'react';
import * as api from '../api';

interface ForgotPasswordPageProps {
  onBackToLogin: () => void;
}

const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({ onBackToLogin }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    if (!email) {
      setMessage('Email is required.');
      return;
    }
    try {
      await api.forgotPassword(email); // FR-003
      setMessage(`If an account exists for ${email}, a password reset link has been sent.`);
      setSubmitted(true);
    } catch (err) {
      setMessage('An error occurred. Please try again later.');
    }
  };

  return (
    <div>
      <h1>Reset Password</h1>
      {message && <div className={`message ${submitted ? 'success' : 'error'}`}>{message}</div>}
      {!submitted && (
        <form onSubmit={handleResetPassword}>
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
          <button type="submit" className="btn">Initiate Password Reset</button>
        </form>
      )}
      <a href="#" className="link" onClick={(e) => { e.preventDefault(); onBackToLogin(); }}>
        Back to Login
      </a>
    </div>
  );
};

export default ForgotPasswordPage;
