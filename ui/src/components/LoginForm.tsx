import React, { useState } from 'react';
import { User } from '../types';
import { login } from '../api';

interface LoginFormProps {
  onLoginSuccess: (user: User, token: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('manager');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const { user, token } = await login(username, password);
      onLoginSuccess(user, token);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <p>Try logging in as <strong>'admin'</strong>, <strong>'manager'</strong>, or <strong>'user'</strong>. The password is <strong>'password'</strong> for all.</p>
      <div className="form-group">
        <label htmlFor="username">Username</label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
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
      <button type="submit" className="btn">Login</button>
      {error && <div className="message message-error">{error}</div>}
    </form>
  );
};

export default LoginForm;
