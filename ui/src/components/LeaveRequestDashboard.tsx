import React, { useEffect, useState } from 'react';
import { getPendingLeaveRequests, approveLeaveRequest, rejectLeaveRequest } from '../api';
import { LeaveRequest } from '../types';
import { LeaveRequestItem } from './LeaveRequestItem';

interface LeaveRequestDashboardProps {
  addNotification: (message: string) => void;
}

export const LeaveRequestDashboard: React.FC<LeaveRequestDashboardProps> = ({ addNotification }) => {
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        const data = await getPendingLeaveRequests();
        setRequests(data);
        if (data.length > 0) {
          addNotification(`New pending leave request${data.length > 1 ? 's' : ''} for review.`);
        }
      } catch (err) {
        setError('Could not load leave requests.');
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDecision = async (id: number, action: 'approve' | 'reject', comments: string) => {
    try {
      const apiCall = action === 'approve' ? approveLeaveRequest : rejectLeaveRequest;
      const updatedRequest = await apiCall(id, { comments });
      
      setRequests(currentRequests => currentRequests.filter(req => req.id !== id));

      const notificationMessage = `Request from ${updatedRequest.directReportName} has been ${updatedRequest.status}.`;
      addNotification(notificationMessage);
      if (comments) {
        addNotification(`Comment added: "${comments.substring(0, 30)}..."`);
      }
    } catch (err) {
      addNotification(`Error updating request for ID ${id}.`);
    }
  };

  if (loading) {
    return <div className="loading">Loading pending requests...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div>
      {requests.length > 0 ? (
        requests.map(request => (
          <LeaveRequestItem key={request.id} request={request} onDecision={handleDecision} />
        ))
      ) : (
        <p>There are no pending leave requests from your direct reports.</p>
      )}
    </div>
  );
};
