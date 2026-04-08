import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import notificationService from '../../services/notificationService';
import { useRole } from '../../hooks/useRole';
import { useIsMobile } from '../../hooks/useWindowSize';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import './NotificationsPage.css';

const NotificationsPage = () => {
  const navigate = useNavigate();
  const { getUserInfo } = useRole();
  const userInfo = getUserInfo();
  const isMobile = useIsMobile();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const data = await notificationService.getMyNotifications(0, 50);
      setNotifications(data.content || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      if (window.confirm('Are you sure you want to delete this notification?')) {
        await notificationService.deleteNotification(id);
        setNotifications(notifications.filter(n => n.id !== id));
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const getTimeAgo = (dateString) => {
    const now = new Date();
    const then = new Date(dateString);
    const diffInSeconds = Math.floor((now - then) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  const handleNotificationClick = (n) => {
    handleMarkAsRead(n.id);
    if (!n.relatedEntityId) return;

    const role = userInfo?.roles?.[0] || '';
    const dashboardPath = role === 'ROLE_ADMIN' ? '/dashboard/admin' : 
                          role === 'ROLE_MODERATOR' ? '/dashboard/moderator' : 
                          '/dashboard/user';

    switch (n.category) {
      case 'BOOKING':
        navigate(dashboardPath, { state: { activeTab: 'requests' } });
        break;
      case 'TICKET':
        navigate(dashboardPath, { state: { activeTab: 'incidents' } });
        break;
      case 'ANNOUNCEMENT':
        navigate(dashboardPath, { state: { activeTab: 'announcements' } });
        break;
      default:
        navigate(dashboardPath);
        break;
    }
  };

  const filteredNotifications = notifications.filter(n => {
    const matchesFilter = filter === 'ALL' ? true : 
                         filter === 'UNREAD' ? !n.isRead : 
                         n.category === filter;
    const matchesSearch = n.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          n.message.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getNavItems = () => {
    const role = userInfo?.roles?.[0];
    if (role === 'ROLE_ADMIN') {
      return [
        { id: 'overview', label: 'Overview', icon: 'home' },
        { id: 'facilities', label: 'Facilities Management', icon: 'building' },
        { id: 'requests', label: 'Requests Overview', icon: 'file' },
        { id: 'users', label: 'Users & Roles', icon: 'users' },
        { id: 'incidents', label: 'Help Desk / Incidents', icon: 'hammer-wrench' },
        { id: 'announcements', label: 'Announcements', icon: 'megaphone' },
        { id: 'reports', label: 'Reports & Analytics', icon: 'chart' },
        { id: 'notifications-view', label: 'Notifications', icon: 'bell' },
        { id: 'settings', label: 'Settings', icon: 'settings' }
      ];
    } else if (role === 'ROLE_MODERATOR') {
      return [
        { id: 'overview', label: 'Overview', icon: 'home' },
        { id: 'monitor', label: 'Campus Monitor', icon: 'monitor' },
        { id: 'requests', label: 'Facility Requests', icon: 'file' },
        { id: 'occupancy', label: 'Live Occupancy', icon: 'users' },
        { id: 'notifications-view', label: 'Notifications Center', icon: 'bell' },
        { id: 'notifications', label: 'Send Notifications', icon: 'megaphone' },
        { id: 'reports', label: 'Reports', icon: 'chart' },
        { id: 'incidents', label: 'Help Desk / Incidents', icon: 'tool' }
      ];
    } else {
      return [
        { id: 'home', label: 'Home', icon: 'home' },
        { id: 'calendar', label: 'Availability', icon: 'calendar' },
        { id: 'requests', label: 'Bookings', icon: 'file' },
        { id: 'qr', label: 'QR Codes', icon: 'qr' },
        { id: 'notifications-view', label: 'Notifications', icon: 'bell' },
        { id: 'incidents', label: 'Help Desk / Incidents', icon: 'hammer-wrench' },
        { id: 'announcements', label: 'Announcements', icon: 'megaphone' },
        { id: 'profile', label: 'My Profile', icon: 'user' },
      ];
    }
  };

  const styles = {
    layout: {
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: '#F8FAFC',
    },
    main: {
      flex: 1,
      marginLeft: isMobile ? 0 : '240px',
      padding: isMobile ? '80px 16px 24px 16px' : '0px',
      transition: 'margin-left 0.3s ease',
      backgroundColor: '#F8FAFC',
      minHeight: '100vh',
    },
    contentArea: {
      padding: isMobile ? '0' : '32px',
    }
  };

  return (
    <div style={styles.layout}>
      <Sidebar
        navItems={getNavItems()}
        userInfo={userInfo}
        onLogout={handleLogout}
        activeItem="notifications-view"
        onNavClick={(id) => {
          if (id === 'notifications-view') return;
          const target = userInfo?.roles?.[0] === 'ROLE_ADMIN' ? 'admin' : 
                        userInfo?.roles?.[0] === 'ROLE_MODERATOR' ? 'moderator' : 'user';
          navigate(`/dashboard/${target}`);
          // Note: In a real app we'd pass state to set the active tab
        }}
        isOpen={sidebarOpen}
        onToggle={setSidebarOpen}
      />
      
      <main style={styles.main}>
        {!isMobile && (
          <Navbar 
            title="Notifications Center" 
            userInfo={userInfo} 
            onLogout={handleLogout} 
          />
        )}
        
        <div style={styles.contentArea}>
          <div className="notifications-page">
            <div className="notifications-header">
              <h1>Notification Center</h1>
              <div className="notifications-actions">
                <button onClick={() => notificationService.markAllAsRead().then(fetchNotifications)}>Mark All Read</button>
              </div>
            </div>

            <div className="filter-bar">
              <div className="filter-tabs">
                <button className={filter === 'ALL' ? 'active' : ''} onClick={() => setFilter('ALL')}>All</button>
                <button className={filter === 'UNREAD' ? 'active' : ''} onClick={() => setFilter('UNREAD')}>Unread</button>
                <button className={filter === 'BOOKING' ? 'active' : ''} onClick={() => setFilter('BOOKING')}>Booking</button>
                <button className={filter === 'TICKET' ? 'active' : ''} onClick={() => setFilter('TICKET')}>Ticket</button>
                <button className={filter === 'ANNOUNCEMENT' ? 'active' : ''} onClick={() => setFilter('ANNOUNCEMENT')}>News</button>
              </div>
              <div className="search-input">
                <input 
                  type="text" 
                  placeholder="Search notifications..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="notifications-list">
              {loading ? (
                <div className="loading-state">Loading notifications...</div>
              ) : filteredNotifications.length === 0 ? (
                <div className="empty-state">No notifications match your criteria</div>
              ) : (
                filteredNotifications.map(n => (
                  <div 
                    key={n.id} 
                    className={`notification-card ${!n.isRead ? 'unread' : ''} priority-${n.priority?.toLowerCase()}`}
                    onClick={() => handleNotificationClick(n)}
                    style={{ cursor: n.relatedEntityId ? 'pointer' : 'default' }}
                  >
                    <div className="card-status-dot"></div>
                    <div className="card-content">
                      <div className="card-top">
                        <h3>{n.title}</h3>
                        <span className="card-time" title={new Date(n.createdAt).toLocaleString()}>
                          {getTimeAgo(n.createdAt)}
                        </span>
                      </div>
                      <p className="card-message">{n.message}</p>
                      <div className="card-badges">
                        <span className={`badge category-${n.category?.toLowerCase()}`}>{n.category}</span>
                        {n.priority === 'HIGH' || n.priority === 'URGENT' ? (
                          <span className={`badge priority-${n.priority.toLowerCase()}`}>{n.priority}</span>
                        ) : null}
                      </div>
                    </div>
                    <div className="card-actions">
                      {!n.isRead && (
                        <button className="read-btn" onClick={() => handleMarkAsRead(n.id)}>Mark as Read</button>
                      )}
                      <button className="delete-btn" onClick={() => handleDelete(n.id)}>Delete</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NotificationsPage;
