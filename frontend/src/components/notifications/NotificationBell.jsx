import React, { useState, useEffect, useRef } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { useRole } from '../../hooks/useRole';
import notificationService from '../../services/notificationService';
import NotificationDropdown from './NotificationDropdown';
import './NotificationBell.css';

const NotificationBell = () => {
  const { getUserInfo } = useRole();
  const user = getUserInfo();
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [animate, setAnimate] = useState(false);
  const dropdownRef = useRef(null);
  const stompClient = useRef(null);

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

  const triggerAnimation = () => {
    setAnimate(true);
    setTimeout(() => setAnimate(false), 500);
  };

  useEffect(() => {
    fetchUnreadCount();
    
    // Fallback polling (less frequent now)
    const interval = setInterval(fetchUnreadCount, 60000);
    
    // WebSocket Connection
    if (user && user.id) {
      const baseUrl = (process.env.REACT_APP_API_URL || 'http://localhost:8081/api').replace('/api', '');
      const token = localStorage.getItem('token');
      
      const client = new Client({
        brokerURL: `${baseUrl.replace('http', 'ws')}/ws`,
        connectHeaders: {
          'Authorization': `Bearer ${token}`
        },
        debug: (str) => {
          // console.log(str);
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
      });

      // SockJS fallback if needed
      client.webSocketFactory = () => {
        const url = `${baseUrl}/ws?access_token=${token}`;
        return new SockJS(url);
      };

      client.onConnect = (frame) => {
        client.subscribe(`/user/${user.id}/topic/notifications`, (message) => {
          if (message.body) {
            const notification = JSON.parse(message.body);
            console.log('New real-time notification:', notification);
            setUnreadCount(prev => prev + 1);
            triggerAnimation();
          }
        });
      };

      client.onStompError = (frame) => {
        console.error('Broker reported error: ' + frame.headers['message']);
        console.error('Additional details: ' + frame.body);
      };

      client.activate();
      stompClient.current = client;
    }

    return () => {
      clearInterval(interval);
      if (stompClient.current) {
        stompClient.current.deactivate();
      }
    };
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
