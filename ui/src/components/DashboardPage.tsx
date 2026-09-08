import React from 'react';
import { Profile } from '../types';

interface DashboardPageProps {
  profile: Profile;
  onLogout: () => void;
  onManageProfile: () => void;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ profile, onLogout, onManageProfile }) => {
  return (
    <div>
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <a href="#" className="link" onClick={(e) => {e.preventDefault(); onLogout();}}>
          Log Out
        </a>
      </div>
      <p>Welcome, {profile.name}!</p>
      <p>This is your employee dashboard. You can manage your personal information or log out securely.</p>
      <button onClick={onManageProfile} className="btn btn-secondary">
        Manage Profile Information
      </button>
    </div>
  );
};

export default DashboardPage;
