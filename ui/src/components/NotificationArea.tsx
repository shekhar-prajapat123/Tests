import React from 'react';

interface NotificationAreaProps {
  notifications: string[];
}

export const NotificationArea: React.FC<NotificationAreaProps> = ({ notifications }) => {
  return (
    <>
      <h2>Notifications</h2>
      {notifications.length > 0 ? (
        <ul>
          {notifications.map((msg, index) => (
            <li key={index}>{msg}</li>
          ))}
        </ul>
      ) : (
        <p>No new notifications.</p>
      )}
    </>
  );
};
