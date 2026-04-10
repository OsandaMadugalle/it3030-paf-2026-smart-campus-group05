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

    // 1. Check for Approval FIRST (Success)
    if (actionLower.includes('approve') || actionLower.includes('success') || actionLower.includes('approved')) {
      return '#10B981'; // Green
    }

    // 2. Check for Rejection/Cancellation (Danger)
    if (actionLower.includes('reject') || actionLower.includes('cancel') || actionLower.includes('delete')) {
      return '#EF4444'; // Red
    }

    // 3. Check for Submission (Blue)
    if (actionLower.includes('submit') || actionLower.includes('new') || actionLower.includes('create') || actionLower.includes('requested')) {
      return '#2563EB'; // Blue
    }

    // 4. Check for Updates (Orange)
    if (actionLower.includes('update') || actionLower.includes('edit')) {
      return '#F59E0B'; // Orange
    }

    return '#64748B'; // Default Gray
  };

  const formatTimeAgo = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    
    if (diffSecs < 60) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
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
    },
    item: {
      display: 'flex',
      alignItems: 'center', // Changed to center for better alignment like screenshot
      gap: '16px',
      padding: '16px 20px',
      borderBottom: '1px solid #F1F5F9',
    },
    avatar: (color) => ({
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      backgroundColor: `${color}10`, // Very light background
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    }),
    actionText: {
      fontSize: '15px',
      color: '#1E293B',
      margin: 0,
    },
    userName: {
      fontWeight: '600',
      color: '#0F172A',
    },
    verb: (color) => ({
      color: color,
      fontWeight: '500', // Verb color
    }),
    target: {
      fontWeight: '600', // Bold resource name
      color: '#0F172A',
    },
    time: {
      fontSize: '13px',
      color: '#94A3B8',
      display: 'block',
      marginTop: '2px',
    }
  };

  // --- REFINED ICON LOGIC ---
  const renderIcon = (action) => {
    const color = getActionColor(action);
    const act = action.toLowerCase();
    
    if (act.includes('approve')) return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>;
    if (act.includes('cancel') || act.includes('reject')) return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
    if (act.includes('update')) return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
    // Default Plus icon for "submitted/created"
    return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.title}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
          Activity Feed
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <span style={{fontSize: '12px', color: '#94A3B8'}}>Last updated: {lastRefresh.toLocaleTimeString()}</span>
            <button style={styles.refreshBtn} onClick={handleRefresh}>Refresh</button>
        </div>
      </div>

      <div style={styles.list}>
        {activities.slice(0, maxItems).map((activity, index) => {
          const color = getActionColor(activity.action);
          return (
            <div key={activity.id || index} style={styles.item}>
              <div style={styles.avatar(color)}>
                {renderIcon(activity.action)}
              </div>
              <div>
                <p style={styles.actionText}>
                  <span style={styles.userName}>{activity.user?.name || activity.userName}</span>
                  <span style={styles.verb(color)}> {activity.action} </span>
                  <span style={styles.target}>{activity.target}</span>
                </p>
                <span style={styles.time}>{formatTimeAgo(activity.timestamp)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ActivityFeed;