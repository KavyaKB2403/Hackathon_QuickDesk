import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user')) || {};

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Placeholder tickets - replace with real API call as next step
  const tickets = [
    { id: 1, subject: 'Example ticket 1', status: 'Open' },
    { id: 2, subject: 'Example ticket 2', status: 'In Progress' }
  ];

  return (
    <div style={{ maxWidth: 600, margin: 'auto', padding: 20 }}>
      <h2>Welcome, {user.username}</h2>
      <button onClick={handleLogout} style={{ marginBottom: 20 }}>Logout</button>

      <h3>Your Tickets</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead><tr><th>ID</th><th>Subject</th><th>Status</th></tr></thead>
        <tbody>
          {tickets.map(ticket => (
            <tr key={ticket.id}>
              <td>{ticket.id}</td>
              <td>{ticket.subject}</td>
              <td>{ticket.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
