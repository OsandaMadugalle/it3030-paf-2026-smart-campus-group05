import React, { useState, useEffect, useRef } from 'react';
import notificationService from '../../services/notificationService';
import NotificationDropdown from './NotificationDropdown';
import './NotificationBell.css';

const NotificationBell = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [animate, setAnimate] = useState(false);
  const dropdownRef = useRef(null);

  const fetchUnreadCount = async () => {
    try {
      const data = await notificationService.getUnreadCount();
      if (data.count > unreadCount) {
        setAnimate(true);
        setTimeout(() => setAnimate(false), 500);
      }
      setUnreadCount(data.count);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [unreadCount]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="notification-bell-container" ref={dropdownRef}>
      <button 
        className={`notification-bell-btn ${animate ? 'shake' : ''}`}
        onClick={() => setShowDropdown(!showDropdown)}
        aria-label="Notifications"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="bell-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && <span className="unread-badge">{unreadCount > 99 ? '99+' : unreadCount}</span>}
      </button>

      {showDropdown && (
        <NotificationDropdown 
          onClose={() => setShowDropdown(false)} 
          onNotificationRead={() => fetchUnreadCount()}
        />
      )}
    </div>
  );
};

export default NotificationBell;
