import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRole } from '../../hooks/useRole';
import notificationService from '../../services/notificationService';
import ToggleSwitch from './ToggleSwitch';
import './NotificationDropdown.css';

const NotificationDropdown = ({ onClose, onNotificationRead }) => {
  const { getUserInfo } = useRole();
  const userInfo = getUserInfo();
  
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [view, setView] = useState('notifications'); // 'notifications' or 'settings'
  
  const [preferences, setPreferences] = useState(null);
  const [prefsLoading, setPrefsLoading] = useState(false);
  const [savingKeys, setSavingKeys] = useState(new Set());
  const [savedKeys, setSavedKeys] = useState(new Set());
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotifications();
    fetchPreferences();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const data = await notificationService.getMyNotifications(0, 10);
      setNotifications(data.content || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPreferences = async () => {
    setPrefsLoading(true);
    try {
      const prefs = await notificationService.getMyPreferences();
      setPreferences(prefs);
    } catch (error) {
      console.error('Error fetching preferences:', error);
    } finally {
      setPrefsLoading(false);
    }
  };

  const handleTogglePreference = async (key, value) => {
    setSavingKeys(prev => new Set(prev).add(key));
    try {
      const updatedPrefs = { ...preferences, [key]: value };
      setPreferences(updatedPrefs);
      await notificationService.updateMyPreferences(updatedPrefs);
      
      setSavedKeys(prev => new Set(prev).add(key));
      setTimeout(() => {
        setSavedKeys(prev => {
          const next = new Set(prev);
          next.delete(key);
          return next;
        });
      }, 2000);
    } catch (error) {
      console.error('Error saving preference:', error);
      // Revert on error
      setPreferences(prev => ({ ...prev, [key]: !value }));
    } finally {
      setSavingKeys(prev => {
        const next = new Set(prev);
        next.delete(key);
        return next;
      });
    }
  };

  const handleMute = async (hours) => {
    setPrefsLoading(true);
    try {
      const updated = await notificationService.muteNotifications(hours);
      setPreferences(updated);
    } catch (error) {
      console.error('Error muting:', error);
    } finally {
      setPrefsLoading(false);
    }
  };

  const handleUnmute = async () => {
    setPrefsLoading(true);
    try {
      const updated = await notificationService.unmuteNotifications();
      setPreferences(updated);
    } catch (error) {
      console.error('Error unmuting:', error);
    } finally {
      setPrefsLoading(false);
    }
  };

  const getCategorizedToggles = () => {
    const role = userInfo?.roles?.[0] || 'ROLE_USER';
    
    const adminModToggles = [
      { key: 'bookingRequestedEnabled', label: 'New Booking Requests', icon: '📩' },
      { key: 'ticketCreatedEnabled', label: 'New Incidents/Tickets', icon: '🎫' },
      { key: 'ticketStatusEnabled', label: 'Ticket Assignments/Updates', icon: '🔄' },
      { key: 'ticketCommentEnabled', label: 'Ticket Comments', icon: '💬' },
      { key: 'systemNotifications', label: 'Emergency Alerts', icon: '🚨' },
    ];

    const userToggles = [
      { key: 'bookingApprovedEnabled', label: 'Booking Approved', icon: '✅' },
      { key: 'bookingRejectedEnabled', label: 'Booking Rejected', icon: '❌' },
      { key: 'bookingCancelledEnabled', label: 'Booking Cancelled', icon: '🚫' },
      { key: 'ticketStatusEnabled', label: 'Ticket Updates', icon: '🔄' },
      { key: 'ticketCommentEnabled', label: 'Ticket Comments', icon: '💬' },
      { key: 'systemNotifications', label: 'Emergency Alerts', icon: '🚨' },
    ];

    if (role === 'ROLE_ADMIN' || role === 'ROLE_MODERATOR') {
      return adminModToggles;
    }
    return userToggles;
  };

  const isMuted = preferences?.muteAll && preferences?.mutedUntil && new Date(preferences.mutedUntil) > new Date();

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
  const handleClearAll = async () => {
    if (window.confirm('Are you sure you want to clear all notifications?')) {
      try {
        await notificationService.clearAllNotifications();
        setNotifications([]);
        onNotificationRead(); // Refresh count
      } catch (error) {
        console.error('Error clearing notifications:', error);
      }
    }
  };
  const handleNotificationClick = (notification) => {
    handleMarkAsRead(notification.id);
    onClose();

    if (!notification.relatedEntityId) return;

    const role = userInfo?.roles?.[0] || '';
    const dashboardPath = role === 'ROLE_ADMIN' ? '/dashboard/admin' : 
                          role === 'ROLE_MODERATOR' ? '/dashboard/moderator' : 
                          '/dashboard/user';

    switch (notification.category) {
      case 'BOOKING':
        navigate(dashboardPath, { state: { activeTab: 'requests' } });
        break;
      case 'TICKET':
        navigate(dashboardPath, { state: { activeTab: 'incidents' } });
        break;
      default:
        navigate(dashboardPath);
        break;
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

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const allDisabled = preferences && 
    !preferences.bookingApprovedEnabled && !preferences.bookingRejectedEnabled && 
    !preferences.bookingCancelledEnabled && !preferences.bookingRequestedEnabled &&
    !preferences.ticketCreatedEnabled && !preferences.ticketStatusEnabled && 
    !preferences.ticketCommentEnabled && !preferences.ticketResolvedEnabled && 
    !preferences.systemNotifications;

  return (
    <div className="notification-dropdown">
      <div className={`dropdown-container ${view === 'settings' ? 'show-settings' : ''}`}>
        
        {/* VIEW 1: Notifications List */}
        <div className="view-pane notifications-pane">
          <div className="dropdown-header">
            <div className="header-left">
              <h3>Notifications</h3>
              {unreadCount > 0 && <span className="unread-count-badge">{unreadCount}</span>}
            </div>
            <div className="header-right">
              {notifications.length > 0 && (
                <button 
                  className="clear-all-btn" 
                  onClick={handleClearAll}
                  title="Clear All Notifications"
                >
                  Clear All
                </button>
              )}
              <button 
                className="icon-btn" 
                onClick={() => setView('settings')}
                title="Settings"
              >
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
              <button className="mark-all-btn" onClick={handleMarkAllRead}>Mark all read</button>
            </div>
          </div>

          <div className="dropdown-tabs">
            <button className={filter === 'ALL' ? 'active' : ''} onClick={() => setFilter('ALL')}>All</button>
            <button className={filter === 'UNREAD' ? 'active' : ''} onClick={() => setFilter('UNREAD')}>Unread</button>
            <button className={filter === 'BOOKING' ? 'active' : ''} onClick={() => setFilter('BOOKING')}>Booking</button>
            <button className={filter === 'TICKET' ? 'active' : ''} onClick={() => setFilter('TICKET')}>Ticket</button>
          </div>

          <div className="notification-list">
            {loading ? (
              <div className="empty-state">Loading notifications...</div>
            ) : filteredNotifications.length === 0 ? (
              <div className="empty-state">No notifications found</div>
            ) : (
              filteredNotifications.map(notification => (
                <div 
                  key={notification.id}
                  className={`notification-item ${!notification.isRead ? 'unread' : ''} priority-${notification.priority?.toLowerCase()}`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="notification-icon">{getIcon(notification.type)}</div>
                  <div className="notification-content">
                    <p className="notification-title">{notification.title}</p>
                    <p className="notification-message">{notification.message}</p>
                    <div className="notification-meta">
                      <span className="notification-time">{getTimeAgo(notification.createdAt)}</span>
                      {notification.priority === 'URGENT' && <span className="urgent-label">Urgent</span>}
                    </div>
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

        {/* VIEW 2: Preferences Panel */}
        <div className="view-pane preferences-pane">
          <div className="dropdown-header">
            <div className="header-left">
              <button className="icon-btn" onClick={() => setView('notifications')}>
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h3>Smart Settings</h3>
            </div>
          </div>

          <div className="preferences-content">
            {prefsLoading && !preferences ? (
              <div className="preferences-loader">
                <div className="skeleton skeleton-mute"></div>
                <div className="skeleton skeleton-row"></div>
                <div className="skeleton skeleton-row"></div>
                <div className="skeleton skeleton-row"></div>
              </div>
            ) : (
              <>
                <div className="mute-section">
                  <p className="section-label">Mute Notifications</p>
                  {isMuted ? (
                    <div className="mute-banner">
                      <p>🔕 Muted until {new Date(preferences.mutedUntil).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                      <button className="unmute-btn" onClick={handleUnmute}>Unmute Now</button>
                    </div>
                  ) : (
                    <div className="mute-options">
                      {[1, 2, 4, 8, 24].map(h => (
                        <button key={h} className="mute-btn" onClick={() => handleMute(h)}>{h}hr</button>
                      ))}
                    </div>
                  )}
                </div>

                {allDisabled && (
                  <div className="settings-warning">
                    <span>⚠️</span> You won't receive any notifications
                  </div>
                )}

                <div className="settings-group">
                  <h4>Manage Categories</h4>
                  
                  {getCategorizedToggles().map(row => (
                    <div className="toggle-row" key={row.key}>
                      <div className="toggle-info">
                        <span className="toggle-icon">{row.icon}</span>
                        <span className="toggle-label">{row.label}</span>
                        {savedKeys.has(row.key) && <span className="saved-indicator">Saved ✓</span>}
                      </div>
                      <ToggleSwitch 
                        checked={preferences?.[row.key]} 
                        loading={savingKeys.has(row.key)}
                        onChange={(val) => handleTogglePreference(row.key, val)}
                      />
                    </div>
                  ))}
                </div>

                <div className="divider"></div>

                <div className="settings-group">
                  <h4>Smart Digest</h4>
                  <div className="digest-card">
                    <div className="toggle-row">
                      <div className="toggle-label" style={{fontWeight: 700}}>Group into Digest</div>
                      <ToggleSwitch 
                        checked={preferences?.digestMode}
                        loading={savingKeys.has('digestMode')}
                        onChange={(val) => handleTogglePreference('digestMode', val)}
                      />
                    </div>
                    <p className="digest-description">
                      Instead of multiple notifications, receive a single summary at intervals.
                    </p>
                    {preferences?.digestMode && (
                      <div className="interval-selector">
                        {[1, 2, 4, 24].map(h => (
                          <button 
                            key={h} 
                            className={`interval-btn ${preferences.digestIntervalHours === h ? 'active' : ''}`}
                            onClick={() => handleTogglePreference('digestIntervalHours', h)}
                          >
                            {h === 24 ? 'Daily' : `${h}hr`}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationDropdown;
