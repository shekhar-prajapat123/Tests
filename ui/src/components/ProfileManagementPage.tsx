import React, { useState } from 'react';
import * as api from '../api';
import { Profile } from '../types';

interface ProfileManagementPageProps {
  profile: Profile;
  onProfileUpdate: (profile: Profile) => void;
  onBackToDashboard: () => void;
}

const ProfileManagementPage: React.FC<ProfileManagementPageProps> = ({ profile, onProfileUpdate, onBackToDashboard }) => {
  const [name, setName] = useState(profile.name);
  const [phone, setPhone] = useState(profile.contactDetails.phone);
  const [message, setMessage] = useState('');

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    try {
      const updatedProfile = await api.updateProfile({ // FR-004
        name,
        contactDetails: {
          ...profile.contactDetails,
          phone
        }
      });
      onProfileUpdate(updatedProfile);
    } catch (err) {
      setMessage('Failed to save changes.');
    }
  };

  return (
    <div>
      <h1>Update Profile Information</h1>
      {message && <div className="message error">{message}</div>}
      <form onSubmit={handleSaveChanges}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email (read-only)</label>
          <input
            id="email"
            type="email"
            value={profile.email}
            readOnly
            disabled
          />
        </div>
        <div className="form-group">
          <label htmlFor="phone">Contact Details (Phone)</label>
          <input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn">Save Changes</button>
      </form>
      <button onClick={onBackToDashboard} className="btn btn-secondary">Back to Dashboard</button>
    </div>
  );
};

export default ProfileManagementPage;
