import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import notificationService from '../../services/notificationService';
import { useRole } from '../../hooks/useRole';
import { useIsMobile } from '../../hooks/useWindowSize';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import ToggleSwitch from '../../components/notifications/ToggleSwitch';
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
  
  // NEW: Settings View State
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState(null);
  const [prefsLoading, setPrefsLoading] = useState(false);
  const [savingKeys, setSavingKeys] = useState(new Set());
  const [savedKeys, setSavedKeys] = useState(new Set());

  useEffect(() => {
    fetchNotifications();
    fetchPreferences();
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
      setTimeout(() => setSavedKeys(prev => {
        const next = new Set(prev);
        next.delete(key);
        return next;
      }), 2000);
    } catch (error) {
      console.error('Error saving preference:', error);
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

  const isMuted = preferences?.muteAll && preferences?.mutedUntil && new Date(preferences.mutedUntil) > new Date();

  const getCategorizedToggles = () => {
    const role = userInfo?.roles?.[0] || 'ROLE_USER';
    
    const adminModToggles = [
      { key: 'bookingRequestedEnabled', label: 'New Booking Requests', icon: '📩' },
      { key: 'ticketCreatedEnabled', label: 'New Incidents/Tickets', icon: '🎫' },
      { key: 'ticketStatusEnabled', label: 'Ticket Assignments/Updates', icon: '🔄' },
      { key: 'ticketCommentEnabled', label: 'Ticket Comments', icon: '💬' },
    ];

    const userToggles = [
      { key: 'bookingApprovedEnabled', label: 'Booking Approved', icon: '✅' },
      { key: 'bookingRejectedEnabled', label: 'Booking Rejected', icon: '❌' },
      { key: 'bookingCancelledEnabled', label: 'Booking Cancelled', icon: '🚫' },
      { key: 'ticketStatusEnabled', label: 'Ticket Updates', icon: '🔄' },
      { key: 'ticketCommentEnabled', label: 'Ticket Comments', icon: '💬' },
    ];

    if (role === 'ROLE_ADMIN' || role === 'ROLE_MODERATOR') {
      return adminModToggles;
    }
    return userToggles;
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {showSettings && (
                  <button 
                    className="icon-settings-btn" 
                    onClick={() => setShowSettings(false)}
                    title="Back to Notifications"
                  >
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ width: 20, height: 20 }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                )}
                <h1>{showSettings ? 'Smart Settings' : 'Notification Center'}</h1>
              </div>
              <div className="notifications-actions">
                {!showSettings ? (
                  <>
                    <button 
                      className="icon-settings-btn" 
                      onClick={() => setShowSettings(true)}
                      title="Notification Preferences"
                      style={{
                        marginRight: '12px',
                        padding: '8px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ width: 20, height: 20 }}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </button>
                    <button onClick={() => notificationService.markAllAsRead().then(fetchNotifications)}>Mark All Read</button>
                  </>
                ) : (
                  <button onClick={() => setShowSettings(false)}>Done</button>
                )}
              </div>
            </div>

            {showSettings ? (
              <div className="page-settings-view">
                <div className="settings-grid">
                  {/* Left Column: Mute & Digest */}
                  <div className="settings-col">
                    <div className="settings-section-card">
                      <h3>Silence Notifications</h3>
                      <p className="section-desc">Temporarily stop receiving alerts on all your devices.</p>
                      
                      {isMuted ? (
                        <div className="page-mute-banner">
                          <div className="mute-info">
                            <span className="mute-icon">🔕</span>
                            <div>
                              <p className="mute-status">Notifications Silenced</p>
                              <p className="mute-time">Will resume at {new Date(preferences.mutedUntil).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                            </div>
                          </div>
                          <button className="page-unmute-btn" onClick={handleUnmute}>Unmute Now</button>
                        </div>
                      ) : (
                        <div className="page-mute-options">
                          {[1, 2, 4, 8, 24].map(h => (
                            <button key={h} className="page-mute-btn" onClick={() => handleMute(h)}>
                              {h === 24 ? '1 Day' : `${h} Hours`}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="settings-section-card">
                      <h3>Smart Digest</h3>
                      <div className="digest-flex">
                        <div>
                          <p className="section-desc">Group multiple alerts into a single summary.</p>
                        </div>
                        <ToggleSwitch 
                          checked={preferences?.digestMode}
                          loading={savingKeys.has('digestMode')}
                          onChange={(val) => handleTogglePreference('digestMode', val)}
                        />
                      </div>
                      
                      {preferences?.digestMode && (
                        <div className="page-interval-selector">
                          <p className="selector-label">Delivery Interval</p>
                          <div className="interval-grid">
                            {[1, 2, 4, 24].map(h => (
                              <button 
                                key={h} 
                                className={`page-interval-btn ${preferences.digestIntervalHours === h ? 'active' : ''}`}
                                onClick={() => handleTogglePreference('digestIntervalHours', h)}
                              >
                                {h === 24 ? 'Daily' : `${h}hr`}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Categories */}
                  <div className="settings-col">
                    <div className="settings-section-card">
                      <h3>Manage Categories</h3>
                      <p className="section-desc">Choose which types of activity you want to be notified about.</p>
                      
                      <div className="page-toggle-list">
                        {getCategorizedToggles().map(row => (
                          <div className="page-toggle-row" key={row.key}>
                            <div className="row-left">
                              <span className="row-icon">{row.icon}</span>
                              <span className="row-label">{row.label}</span>
                              {savedKeys.has(row.key) && <span className="row-saved">Saved ✓</span>}
                            </div>
                            <ToggleSwitch 
                              checked={preferences?.[row.key]} 
                              loading={savingKeys.has(row.key)}
                              onChange={(val) => handleTogglePreference(row.key, val)}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="filter-bar">
                  <div className="filter-tabs">
                    <button className={filter === 'ALL' ? 'active' : ''} onClick={() => setFilter('ALL')}>All</button>
                    <button className={filter === 'UNREAD' ? 'active' : ''} onClick={() => setFilter('UNREAD')}>Unread</button>
                    <button className={filter === 'BOOKING' ? 'active' : ''} onClick={() => setFilter('BOOKING')}>Booking</button>
                    <button className={filter === 'TICKET' ? 'active' : ''} onClick={() => setFilter('TICKET')}>Ticket</button>

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
                            <button className="read-btn" onClick={(e) => {
                              e.stopPropagation();
                              handleMarkAsRead(n.id);
                            }}>Mark as Read</button>
                          )}
                          <button className="delete-btn" onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(n.id);
                          }}>Delete</button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default NotificationsPage;
