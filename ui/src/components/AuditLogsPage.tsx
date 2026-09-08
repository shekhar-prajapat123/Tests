import React, { useState, useEffect } from 'react';
import { fetchAuditLogs } from '../api';
import { AuditLog } from '../types';

const AuditLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadLogs = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchAuditLogs();
        setLogs(data);
      } catch (err) {
        setError('Failed to load audit logs. Please try again later.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadLogs();
  }, []);

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleString();
  };

  const renderContent = () => {
    if (isLoading) {
      return <div className="status-message">Loading logs...</div>;
    }
    if (error) {
      return <div className="status-message">{error}</div>;
    }
    if (logs.length === 0) {
      return <div className="status-message">No audit logs found.</div>;
    }

    return (
      <table className="audit-table">
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>Performed By</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log.id}>
              <td>{formatDate(log.timestamp)}</td>
              <td>{log.actor}</td>
              <td>{log.action}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="audit-logs-container">
      <h1>Audit Logs</h1>
      <p>A comprehensive trail of all key system and user actions. Per NFR-009, logs are retained for at least 12 months and are immutable.</p>
      {renderContent()}
    </div>
  );
};

export default AuditLogsPage;
