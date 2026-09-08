import { LeaveRequest } from '../types';

interface LeaveRequestListProps {
  requests: LeaveRequest[];
  onCancel: (id: string) => void;
}

function LeaveRequestList({ requests, onCancel }: LeaveRequestListProps) {
  if (requests.length === 0) {
    return (
        <section>
            <h2>My Leave Requests</h2>
            <p>You have no past or pending leave requests.</p>
        </section>
    )
  }

  return (
    <section className="leave-list">
      <h2>My Leave Requests</h2>
      <table className="leave-requests-table">
        <thead>
          <tr>
            <th>Type</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Reason</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {[...requests].sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()).map((req) => (
            <tr key={req.id}>
              <td>{req.leaveType}</td>
              <td>{req.startDate}</td>
              <td>{req.endDate}</td>
              <td>{req.reason}</td>
              <td><span className={`status-${req.status}`}>{req.status}</span></td>
              <td>
                {req.status === 'Pending' && (
                  <button onClick={() => onCancel(req.id)} className="cancel-button">
                    Cancel
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

export default LeaveRequestList;
