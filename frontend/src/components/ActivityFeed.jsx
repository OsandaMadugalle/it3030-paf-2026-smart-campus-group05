import React, { useState, useEffect, useCallback } from 'react';

const ActivityFeed = ({ 
  activities = [], 
  autoRefresh = false, 
  refreshInterval = 30000,
  onRefresh,
  loading = false,
  maxItems = 10 
}) => {
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const handleRefresh = useCallback(() => {
    setLastRefresh(new Date());
    if (onRefresh) onRefresh();
  }, [onRefresh]);

  useEffect(() => {
    if (!autoRefresh || !onRefresh) return;
    
    const interval = setInterval(() => {
      handleRefresh();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, handleRefresh]);

  const getActionColor = (action) => {
    const actionLower = action?.toLowerCase() || '';
    if (actionLower.includes('submit') || actionLower.includes('new') || actionLower.includes('create')) return '#2563EB';
    if (actionLower.includes('approve') || actionLower.includes('success')) return '#10B981';
    if (actionLower.includes('reject') || actionLower.includes('cancel') || actionLower.includes('delete')) return '#EF4444';
    if (actionLower.includes('update') || actionLower.includes('edit')) return '#F59E0B';
    return '#64748B';
  };

  const formatTimeAgo = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffSecs < 60) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const styles = {
    container: {
      backgroundColor: '#FFFFFF',
      borderRadius: '12px',
      border: '1px solid #E2E8F0',
      overflow: 'hidden',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '16px 20px',
      borderBottom: '1px solid #E2E8F0',
    },
    title: {
      fontSize: '15px',
      fontWeight: '600',
      color: '#0F172A',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    liveBadge: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      fontSize: '12px',
      color: '#10B981',
      fontWeight: '500',
    },
    liveDot: {
      width: '8px',
      height: '8px',
      borderRadius: '50%',
      backgroundColor: '#10B981',
      animation: 'pulse 2s infinite',
    },
    refreshBtn: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      padding: '6px 12px',
      backgroundColor: '#F1F5F9',
      border: 'none',
      borderRadius: '6px',
      fontSize: '12px',
      color: '#64748B',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    },
    lastRefresh: {
      fontSize: '11px',
      color: '#94A3B8',
    },
    list: {
      maxHeight: '400px',
      overflowY: 'auto',
    },
    item: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '12px',
      padding: '14px 20px',
      borderBottom: '1px solid #F1F5F9',
      transition: 'background-color 0.2s ease',
    },
    avatar: (color) => ({
      width: '36px',
      height: '36px',
      borderRadius: '50%',
      backgroundColor: `${color}15`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    }),
    content: {
      flex: 1,
      minWidth: 0,
    },
    action: {
      fontSize: '14px',
      color: '#0F172A',
      lineHeight: '1.4',
    },
    actionHighlight: (color) => ({
      fontWeight: '600',
      color: color,
    }),
    target: {
      fontWeight: '500',
    },
    time: {
      fontSize: '12px',
      color: '#94A3B8',
      marginTop: '4px',
    },
    emptyState: {
      textAlign: 'center',
      padding: '40px 20px',
      color: '#94A3B8',
    },
    loadingState: {
      padding: '20px',
    },
    skeleton: {
      animation: 'shimmer 1.5s infinite',
      background: 'linear-gradient(90deg, #F1F5F9 25%, #E2E8F0 50%, #F1F5F9 75%)',
      backgroundSize: '200% 100%',
      height: '16px',
      borderRadius: '4px',
      marginBottom: '8px',
    },
  };

  const renderActivityIcon = (action) => {
    const color = getActionColor(action);
    const actionLower = action?.toLowerCase() || '';

    let icon;
    if (actionLower.includes('submit') || actionLower.includes('new') || actionLower.includes('create')) {
      icon = (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
      );
    } else if (actionLower.includes('approve')) {
      icon = (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      );
    } else if (actionLower.includes('reject') || actionLower.includes('cancel') || actionLower.includes('delete')) {
      icon = (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      );
    } else if (actionLower.includes('update') || actionLower.includes('edit')) {
      icon = (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
        </svg>
      );
    } else {
      icon = (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
          <circle cx="12" cy="12" r="10"></circle>
        </svg>
      );
    }

    return <div style={styles.avatar(color)}>{icon}</div>;
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.title}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
          </svg>
          Activity Feed
          {autoRefresh && (
            <span style={styles.liveBadge}>
              <span style={styles.liveDot}></span>
              Live
            </span>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={styles.lastRefresh}>
            Last updated: {lastRefresh.toLocaleTimeString()}
          </span>
          <button
            style={styles.refreshBtn}
            onClick={handleRefresh}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#E2E8F0'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#F1F5F9'}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="23 4 23 10 17 10"></polyline>
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
            </svg>
            Refresh
          </button>
        </div>
      </div>

      <div style={styles.list}>
        {loading ? (
          <div style={styles.loadingState}>
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} style={{ ...styles.item, borderBottom: 'none' }}>
                <div style={{ ...styles.skeleton, width: '36px', height: '36px', borderRadius: '50%' }}></div>
                <div style={{ flex: 1 }}>
                  <div style={{ ...styles.skeleton, width: '80%' }}></div>
                  <div style={{ ...styles.skeleton, width: '40%', marginTop: '8px' }}></div>
                </div>
              </div>
            ))}
          </div>
        ) : activities.length === 0 ? (
          <div style={styles.emptyState}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" strokeWidth="2" style={{ marginBottom: '12px' }}>
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
            </svg>
            <p>No recent activity</p>
          </div>
        ) : (
          activities.slice(0, maxItems).map((activity, index) => {
            const color = getActionColor(activity.action);
            return (
              <div
                key={activity.id || index}
                style={styles.item}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#F8FAFC'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                {activity.user?.picture ? (
                  <img 
                    src={activity.user.picture} 
                    alt={activity.user?.name} 
                    style={{ ...styles.avatar('#E2E8F0'), objectFit: 'cover' }} 
                  />
                ) : (
                  renderActivityIcon(activity.action)
                )}
                <div style={styles.content}>
                  <p style={styles.action}>
                    <span style={styles.target}>{activity.user?.name || activity.userName || 'Someone'}</span>
                    {' '}
                    <span style={styles.actionHighlight(color)}>{activity.action}</span>
                    {activity.target && (
                      <>
                        {' '}
                        <span style={styles.target}>{activity.target}</span>
                      </>
                    )}
                  </p>
                  <span style={styles.time}>{formatTimeAgo(activity.timestamp || activity.date)}</span>
                </div>
              </div>
            );
          })
        )}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
};

export default ActivityFeed;
