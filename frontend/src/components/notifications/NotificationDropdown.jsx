import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import notificationService from '../../services/notificationService';
import './NotificationDropdown.css';

const NotificationDropdown = ({ onClose, onNotificationRead }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(old => true);
  const [filter, setFilter] = useState('ALL');
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const data = await notificationService.getMyNotifications(0, 10);
      setNotifications(data.content || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
      onNotificationRead();
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
      onNotificationRead();
    } catch (error) {
      console.error('Error marking all as read:', error);
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

  const getIcon = (type) => {
    switch (type) {
      case 'BOOKING_REQUESTED': return '📅';
      case 'BOOKING_APPROVED': return '✅';
      case 'BOOKING_REJECTED': return '❌';
      case 'BOOKING_CANCELLED': return '⚠️';
      case 'TICKET_CREATED': return '🎫';
      case 'TICKET_ASSIGNED': return '🔧';
      case 'TICKET_STATUS_UPDATED': return '🔄';
      case 'TICKET_RESOLVED': return '✅';
      case 'TICKET_REJECTED': return '❌';
      case 'TICKET_COMMENT_ADDED': return '💬';
      case 'TICKET_CLOSED': return '🔒';
      case 'ANNOUNCEMENT': return '📢';
      case 'SYSTEM_ALERT': return '🛑';
      case 'DIGEST': return '📧';
      default: return '🔔';
    }
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'ALL') return true;
    if (filter === 'UNREAD') return !n.isRead;
    if (filter === 'BOOKING') return n.category === 'BOOKING';
    if (filter === 'TICKET') return n.category === 'TICKET';
    if (filter === 'ANNOUNCEMENT') return n.category === 'ANNOUNCEMENT';
    return true;
  });

  return (
    <div className="notification-dropdown">
      <div className="dropdown-header">
        <h3>Notifications</h3>
        <button className="mark-all-btn" onClick={handleMarkAllRead}>Mark all read</button>
      </div>

      <div className="dropdown-tabs">
        <button className={filter === 'ALL' ? 'active' : ''} onClick={() => setFilter('ALL')}>All</button>
        <button className={filter === 'UNREAD' ? 'active' : ''} onClick={() => setFilter('UNREAD')}>Unread</button>
        <button className={filter === 'BOOKING' ? 'active' : ''} onClick={() => setFilter('BOOKING')}>Booking</button>
        <button className={filter === 'TICKET' ? 'active' : ''} onClick={() => setFilter('TICKET')}>Ticket</button>
        <button className={filter === 'ANNOUNCEMENT' ? 'active' : ''} onClick={() => setFilter('ANNOUNCEMENT')}>News</button>
      </div>

      <div className="notification-list">
        {loading ? (
          <div className="empty-state">Loading...</div>
        ) : filteredNotifications.length === 0 ? (
          <div className="empty-state">No notifications found</div>
        ) : (
          filteredNotifications.map(notification => (
            <div 
              key={notification.id}
              className={`notification-item ${!notification.isRead ? 'unread' : ''}`}
              onClick={() => {
                handleMarkAsRead(notification.id);
                if (notification.relatedEntityId) {
                  // Navigation logic would go here
                }
              }}
            >
              <div className="notification-icon">{getIcon(notification.type)}</div>
              <div className="notification-content">
                <p className="notification-title">{notification.title}</p>
                <p className="notification-message">{notification.message}</p>
                <span className="notification-time">{getTimeAgo(notification.createdAt)}</span>
              </div>
              {!notification.isRead && <div className="unread-dot"></div>}
            </div>
          ))
        )}
      </div>

      <Link to="/notifications" className="view-all-link" onClick={onClose}>
        View All Notifications
      </Link>
    </div>
  );
};

export default NotificationDropdown;
