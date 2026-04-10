import React, { useState, useEffect, useRef } from 'react';
import { useRole } from '../../hooks/useRole';
import notificationService from '../../services/notificationService';
import webSocketService from '../../services/websocketService';
import NotificationDropdown from './NotificationDropdown';
import { showToast } from '../Toast';
import './NotificationBell.css';

const NotificationBell = () => {
  const { getUserInfo } = useRole();
  const user = getUserInfo();
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [animate, setAnimate] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const dropdownRef = useRef(null);

  const fetchUnreadCount = async () => {
    try {
      const data = await notificationService.getUnreadCount();
      if (data.count > unreadCount) {
        triggerAnimation();
      }
      setUnreadCount(data.count);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const fetchPrefs = async () => {
    try {
      const prefs = await notificationService.getMyPreferences();
      const muted = prefs.muteAll && prefs.mutedUntil && new Date(prefs.mutedUntil) > new Date();
      setIsMuted(muted);
    } catch (error) {
      console.error('Error fetching prefs:', error);
    }
  };

  const triggerAnimation = () => {
    setAnimate(true);
    setTimeout(() => setAnimate(false), 500);
  };

  useEffect(() => {
    fetchUnreadCount();
    fetchPrefs();
    
    // WebSocket Connection using central service
    if (user && user.id) {
      webSocketService.connect();
      
      const subscription = webSocketService.subscribe(`/user/${user.id}/queue/notifications`, (notification) => {
        // Immediately update unread count state
        setUnreadCount(prev => prev + 1);
        triggerAnimation();
        
        // Show real-time Toast
        showToast(
          `${notification.title}: ${notification.message.substring(0, 50)}${notification.message.length > 50 ? '...' : ''}`,
          notification.priority === 'HIGH' || notification.priority === 'URGENT' || notification.type === 'TICKET_CREATED' ? 'warning' : 'info',
          6000
        );
      });

      return () => {
        webSocketService.unsubscribe(`/user/${user.id}/queue/notifications`);
      };
    }
  }, [user?.id]);

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
        className={`notification-bell-btn ${animate ? 'shake' : ''} ${isMuted ? 'muted' : ''}`}
        onClick={() => setShowDropdown(!showDropdown)}
        aria-label="Notifications"
      >
        {isMuted ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="bell-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="bell-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        )}
        {unreadCount > 0 && !isMuted && (
          <span className={`unread-badge ${animate ? 'pulse' : ''}`}>
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
        {isMuted && <span className="unread-badge muted-badge">🔕</span>}
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
