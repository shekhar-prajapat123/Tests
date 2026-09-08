import React, { useState } from 'react';
import { LeaveRequest } from '../types';

interface LeaveRequestItemProps {
  request: LeaveRequest;
  onDecision: (id: number, action: 'approve' | 'reject', comments: string) => void;
}

export const LeaveRequestItem: React.FC<LeaveRequestItemProps> = ({ request, onDecision }) => {
  const [comments, setComments] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleApprove = async () => {
    setIsProcessing(true);
    await onDecision(request.id, 'approve', comments);
    // isProcessing will remain true as the component unmounts
  };

  const handleReject = async () => {
    setIsProcessing(true);
    await onDecision(request.id, 'reject', comments);
  };

  return (
    <div className="request-item">
      <div className="request-item-header">{request.directReportName}</div>
      <div className="request-item-details">
        <p><strong>Dates:</strong> {request.startDate} to {request.endDate}</p>
        <p><strong>Reason:</strong> {request.reason}</p>
      </div>
      <div className="request-item-actions">
        <textarea
          placeholder="Add comments (optional)"
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          disabled={isProcessing}
        />
        <div className="buttons">
          <button className="reject-button" onClick={handleReject} disabled={isProcessing}>
            {isProcessing ? 'Processing...' : 'Reject'}
          </button>
          <button className="approve-button" onClick={handleApprove} disabled={isProcessing}>
            {isProcessing ? 'Processing...' : 'Approve'}
          </button>
        </div>
      </div>
    </div>
  );
};
