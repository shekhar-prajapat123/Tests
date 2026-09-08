import React, { useState } from 'react';
import { LeaveBalance, LeaveRequest, LEAVE_TYPES, LeaveType } from '../types';
import * as api from '../api';

interface LeaveRequestFormProps {
  leaveBalances: LeaveBalance[];
  existingRequests: LeaveRequest[];
  onSuccess: () => void;
}

function LeaveRequestForm({ leaveBalances, existingRequests, onSuccess }: LeaveRequestFormProps) {
  const [leaveType, setLeaveType] = useState<LeaveType>('Vacation');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getTodayString = () => {
    const today = new Date();
    today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
    return today.toISOString().split('T')[0];
  };

  const validateRequest = (): boolean => {
    // VR-001: All mandatory fields are provided
    if (!leaveType || !startDate || !endDate || !reason) {
      setError('All mandatory fields must be provided.');
      return false;
    }
    
    const start = new Date(startDate);
    const end = new Date(endDate);

    // VR-002 - VR-007 are covered by date type validity
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        setError('Start date or end date is not a valid date.');
        return false;
    }
    
    // VR-008: The end date must not be before the start date.
    if (end < start) {
      setError('The end date cannot be before the start date.');
      return false;
    }
    
    // VR-010: Prevent requests exceeding available balance (Client-side check)
    const balance = leaveBalances.find(b => b.leaveType === leaveType);
    const requestedDays = (end.getTime() - start.getTime()) / (1000 * 3600 * 24) + 1;
    if (!balance || balance.availableBalance < requestedDays) {
        setError(`Request for ${requestedDays} day(s) exceeds your available ${leaveType} balance of ${balance?.availableBalance || 0} day(s).`);
        return false;
    }

    // VR-009: Prevent overlapping leave requests (Client-side check)
    const isOverlapping = existingRequests.some(req => {
        const reqStart = new Date(req.startDate);
        const reqEnd = new Date(req.endDate);
        return (start <= reqEnd && end >= reqStart);
    });
    if (isOverlapping) {
        setError('The selected dates overlap with an existing leave request.');
        return false;
    }

    setError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateRequest()) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await api.createLeaveRequest({ leaveType, startDate, endDate, reason });
      // Reset form
      setLeaveType('Vacation');
      setStartDate('');
      setEndDate('');
      setReason('');
      onSuccess(); // Notify parent to refetch
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section>
      <h2>Submit a New Leave Request</h2>
      <div className="leave-balances">
          <h3>Your Balances</h3>
          <ul>
              {leaveBalances.map(b => <li key={b.leaveType}>{b.leaveType}: {b.availableBalance} days</li>)}
          </ul>
      </div>
      <form onSubmit={handleSubmit} className="leave-form">
        <div className="form-group">
          <label htmlFor="leaveType">Leave Type</label>
          <select
            id="leaveType"
            value={leaveType}
            onChange={(e) => setLeaveType(e.target.value as LeaveType)}
            required
          >
            {LEAVE_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="startDate">Start Date</label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            min={getTodayString()}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="endDate">End Date</label>
          <input
            type="date"
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            min={startDate || getTodayString()}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="reason">Reason</label>
          <textarea
            id="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
            required
          />
        </div>
        {error && <div className="error">{error}</div>}
        <button type="submit" disabled={isSubmitting} className="submit-button">
          {isSubmitting ? 'Submitting...' : 'Submit Request'}
        </button>
      </form>
    </section>
  );
}

export default LeaveRequestForm;
