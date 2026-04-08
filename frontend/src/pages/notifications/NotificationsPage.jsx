import React, { useState, useEffect } from 'react';
import notificationService from '../../services/notificationService';
import './NotificationsPage.css';

const NotificationsPage = () => {
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

  const filteredNotifications = notifications.filter(n => {
    const matchesFilter = filter === 'ALL' ? true : 
                         filter === 'UNREAD' ? !n.isRead : 
                         n.category === filter;
    const matchesSearch = n.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          n.message.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
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
            <div key={n.id} className={`notification-card ${!n.isRead ? 'unread' : ''}`}>
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
  );
};

export default NotificationsPage;
