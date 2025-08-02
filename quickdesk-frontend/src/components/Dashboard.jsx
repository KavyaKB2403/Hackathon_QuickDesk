import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NewTicketModal from './NewTicketModal';
import './Dashboard.css';

const Dashboard = ({ setIsAuthenticated }) => {
  const [dashboardData, setDashboardData] = useState({
    stats: { total: 1, open: 1, inProgress: 0, resolved: 0 },
    recent: [
      {
        id: 1,
        title: "How to win odoo Hackathon",
        description: "I want to win odoo hackathon tell me what are the skills i needed for it...",
        category: "Technical Support",
        date: "8/2/2023",
        comments: 0,
        status: "open"
      }
    ]
  });
  const [loading, setLoading] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showNewTicketModal, setShowNewTicketModal] = useState(false); // Modal state
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user')) || { 
    username: 'User', 
    role: 'user' 
  };

  useEffect(() => {
    // Simulate loading data - replace with real API call later
    const loadData = async () => {
      setLoading(true);
      try {
        // Mock data loading - replace with backend.getTickets() when ready
        setTimeout(() => {
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    if (setIsAuthenticated) {
      setIsAuthenticated(false);
    }
    navigate('/login', { replace: true });
  };

  // Modal handlers
  const handleNewTicketOpen = () => {
    setShowNewTicketModal(true);
  };

  const handleNewTicketClose = () => {
    setShowNewTicketModal(false);
  };

  const handleNewTicketSubmit = async (ticketData) => {
    try {
      // Create new ticket object
      const newTicket = {
        id: Date.now(), // In real app, this would come from backend
        title: ticketData.subject,
        description: ticketData.description,
        category: ticketData.category,
        priority: ticketData.priority,
        date: new Date().toLocaleDateString(),
        comments: 0,
        status: "open"
      };

      // Update dashboard data
      setDashboardData(prev => ({
        stats: {
          total: prev.stats.total + 1,
          open: prev.stats.open + 1,
          inProgress: prev.stats.inProgress,
          resolved: prev.stats.resolved
        },
        recent: [newTicket, ...prev.recent]
      }));

      console.log('New ticket created:', newTicket);
      
      // In real app, you would make API call here:
      // await axios.post('/api/tickets', ticketData);
      
    } catch (error) {
      console.error('Error creating ticket:', error);
      throw error;
    }
  };

  const toggleUserDropdown = () => {
    setShowUserDropdown(!showUserDropdown);
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <div>Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-left">
          <div className="logo-section">
            <div className="logo-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                <path d="M12 1C8.14 1 5 4.14 5 8C5 8.78 5.16 9.53 5.45 10.2L2.39 11.33C2.15 11.42 2 11.66 2 11.92V16.08C2 16.34 2.15 16.58 2.39 16.67L5.45 17.8C5.16 18.47 5 19.22 5 20C5 21.66 6.34 23 8 23S11 21.66 11 20C11 19.22 10.84 18.47 10.55 17.8L13.61 16.67C13.85 16.58 14 16.34 14 16.08V11.92C14 11.66 13.85 11.42 13.61 11.33L10.55 10.2C10.84 9.53 11 8.78 11 8C11 4.14 7.86 1 4 1H12Z"/>
              </svg>
            </div>
            <div className="logo-text">
              <span className="logo-title">QuickDesk Pro</span>
              <span className="logo-subtitle">Complete Help Desk System</span>
            </div>
          </div>
        </div>

        <nav className="header-nav">
          <button className="nav-item active">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
            </svg>
            Dashboard
          </button>
          <button className="nav-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M14 2H6C4.9 2 4.01 2.9 4.01 4L4 20C4 21.1 4.89 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2ZM18 20H6V4H13V9H18V20Z"/>
            </svg>
            Tickets
          </button>
          <button className="nav-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V5H19V19ZM17 12H7V10H17V12ZM13 16H7V14H13V16ZM17 8H7V6H17V8Z"/>
            </svg>
            Knowledge Base
          </button>
        </nav>

        <div className="header-right">
          <div className="user-section" onClick={toggleUserDropdown}>
            <span className="user-greeting">hello</span>
            <div className="user-avatar">
              <span>{user.username?.charAt(0).toUpperCase() || 'U'}</span>
            </div>
            <svg className="dropdown-arrow" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7 10l5 5 5-5z"/>
            </svg>
            
            {showUserDropdown && (
              <div className="user-dropdown">
                <div className="dropdown-item">Profile</div>
                <div className="dropdown-item">Settings</div>
                <div className="dropdown-divider"></div>
                <div className="dropdown-item" onClick={handleLogout}>Logout</div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-main">
        <div className="welcome-section">
          <h1 className="welcome-title">Welcome back, {user.username}! 👋</h1>
          <p className="welcome-subtitle">Here&apos;s your support ticket overview. You can see only your own tickets.</p>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card blue">
            <div className="stat-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                <path d="M14 2H6C4.9 2 4.01 2.9 4.01 4L4 20C4 21.1 4.89 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z"/>
              </svg>
            </div>
            <div className="stat-content">
              <div className="stat-label">My Tickets</div>
              <div className="stat-number">{dashboardData.stats.total}</div>
            </div>
          </div>

          <div className="stat-card red">
            <div className="stat-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <div className="stat-content">
              <div className="stat-label">Open</div>
              <div className="stat-number">{dashboardData.stats.open}</div>
            </div>
          </div>

          <div className="stat-card yellow">
            <div className="stat-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
            <div className="stat-content">
              <div className="stat-label">In Progress</div>
              <div className="stat-number">{dashboardData.stats.inProgress}</div>
            </div>
          </div>

          <div className="stat-card green">
            <div className="stat-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
              </svg>
            </div>
            <div className="stat-content">
              <div className="stat-label">Resolved</div>
              <div className="stat-number">{dashboardData.stats.resolved}</div>
            </div>
          </div>
        </div>

        {/* Recent Tickets Section */}
        <div className="recent-tickets-section">
          <div className="section-header">
            <div>
              <h2 className="section-title">My Recent Tickets</h2>
              <p className="section-subtitle">Your latest support requests</p>
            </div>
            {/* Updated New Ticket Button */}
            <button className="new-ticket-btn" onClick={handleNewTicketOpen}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
              </svg>
              New Ticket
            </button>
          </div>

          <div className="tickets-list">
            {dashboardData.recent.length === 0 ? (
              <p>No recent tickets found.</p>
            ) : (
              dashboardData.recent.map(ticket => (
                <div key={ticket.id} className="ticket-item">
                  <div className="ticket-content">
                    <h3 className="ticket-title">{ticket.title}</h3>
                    <p className="ticket-description">{ticket.description}</p>
                    <div className="ticket-meta">
                      <span className="ticket-category">📁 {ticket.category}</span>
                      <span className="ticket-date">📅 {ticket.date}</span>
                      <span className="ticket-comments">💬 {ticket.comments} comments</span>
                    </div>
                  </div>
                  <div className="ticket-status">
                    <span className={`status-badge ${ticket.status}`}>
                      {ticket.status.toUpperCase()}
                    </span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
                    </svg>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Access Level */}
        <div className="access-level">
          <div className="access-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 5.5V3.5C15 3.5 15 3.5 15 3.5L9 5V7H21V9ZM21 10H3V12H21V10ZM21 13H3V15H21V13ZM21 16H3V18H21V16ZM21 19H3V21H21V19Z"/>
            </svg>
          </div>
          <div>
            <div className="access-title">Your Access Level: {user.role?.toUpperCase()}</div>
            <div className="access-description">You can view and manage only your own tickets for privacy and security.</div>
          </div>
        </div>
      </main>

      {/* New Ticket Modal */}
      <NewTicketModal
        isOpen={showNewTicketModal}
        onClose={handleNewTicketClose}
        onSubmit={handleNewTicketSubmit}
      />
    </div>
  );
};

export default Dashboard;
