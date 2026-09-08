import React, { useState } from 'react';
import { User } from '../types';
import { performManagerAction, performAdminAction } from '../api';

interface DashboardProps {
  user: User;
  token: string;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, token, onLogout }) => {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAction = async (action: () => Promise<{ message: string }>) => {
    setMessage(null);
    setError(null);
    try {
      const result = await action();
      setMessage(result.message);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <div>
      <div className="user-info">
        <p>Welcome, <strong>{user.name}</strong>!</p>
        <p>Your assigned role is: <strong>{user.role}</strong></p>
      </div>

      <p>Attempt actions based on your role-based access control (RBAC) permissions:</p>
      
      <div className="actions">
        <button 
          className="btn btn-secondary"
          onClick={() => handleAction(() => performManagerAction(token))}
        >
          Attempt Manager Action
        </button>
        <button 
          className="btn btn-secondary"
          onClick={() => handleAction(() => performAdminAction(token))}
        >
          Attempt Admin Action
        </button>
      </div>

      {message && <div className="message message-success">{message}</div>}
      {error && <div className="message message-error">{error}</div>}

      <button onClick={onLogout} className="btn btn-secondary">
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
