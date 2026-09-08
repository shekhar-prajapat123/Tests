import React, { useState, useEffect } from 'react';
import { LeaveType } from '../types';
import * as api from '../api';

function LeaveTypesManager() {
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [newTypeName, setNewTypeName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.getLeaveTypes()
      .then(data => {
        setLeaveTypes(data);
        setIsLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch leave types.');
        setIsLoading(false);
      });
  }, []);

  const handleAddLeaveType = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTypeName.trim()) return;

    try {
      const newLeaveType = await api.addLeaveType(newTypeName);
      setLeaveTypes(prevTypes => [...prevTypes, newLeaveType]);
      setNewTypeName('');
    } catch {
      setError('Failed to add new leave type.');
    }
  };

  if (isLoading) {
    return <p>Loading leave types...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  return (
    <div>
      <h3>Available Leave Types</h3>
      <ul>
        {leaveTypes.map(type => (
          <li key={type.id}>{type.name}</li>
        ))}
      </ul>
      
      <h3>Define New Leave Type</h3>
      <form onSubmit={handleAddLeaveType} className="add-form">
        <div className="form-group">
          <label htmlFor="new-leave-type-name">Leave Type Name</label>
          <input
            id="new-leave-type-name"
            type="text"
            value={newTypeName}
            onChange={e => setNewTypeName(e.target.value)}
            placeholder="e.g., Bereavement"
          />
        </div>
        <button type="submit" disabled={!newTypeName.trim()}>Add Type</button>
      </form>
    </div>
  );
}

export default LeaveTypesManager;
