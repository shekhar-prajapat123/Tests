import React, { useState, useEffect } from 'react';
import { AnnualLeavePolicy } from '../types';
import * as api from '../api';

const initialPolicyState: AnnualLeavePolicy = {
  accrualRate: 0,
  maxCarryOver: 0,
};

function AnnualLeavePolicyManager() {
  const [policy, setPolicy] = useState<AnnualLeavePolicy>(initialPolicyState);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    api.getAnnualLeavePolicy()
      .then(data => {
        setPolicy(data);
        setIsLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch annual leave policy.');
        setIsLoading(false);
      });
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPolicy(prevPolicy => ({
      ...prevPolicy,
      [name]: parseFloat(value) || 0,
    }));
  };

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setStatus(null);
    setError(null);

    try {
      await api.updateAnnualLeavePolicy(policy);
      setStatus('Changes saved successfully. They will be reflected for new leave requests.');
    } catch {
      setError('Failed to save changes.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <p>Loading annual leave policy...</p>;
  }
  
  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  return (
    <form onSubmit={handleSaveChanges}>
      <div className="form-group">
        <label htmlFor="accrualRate">Accrual Rates (days/period)</label>
        <input
          id="accrualRate"
          name="accrualRate"
          type="number"
          step="0.1"
          value={policy.accrualRate}
          onChange={handleInputChange}
          disabled={isSaving}
        />
      </div>
      <div className="form-group">
        <label htmlFor="maxCarryOver">Maximum Carry-Over (days)</label>
        <input
          id="maxCarryOver"
          name="maxCarryOver"
          type="number"
          step="1"
          value={policy.maxCarryOver}
          onChange={handleInputChange}
          disabled={isSaving}
        />
      </div>
      <button type="submit" disabled={isSaving}>
        {isSaving ? 'Saving...' : 'Save Changes'}
      </button>
      {status && <p className="status-message">{status}</p>}
    </form>
  );
}

export default AnnualLeavePolicyManager;
