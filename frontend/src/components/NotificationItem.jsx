import React from 'react';

const NotificationItem = ({ title, message, timestamp, isRead, onMarkRead }) => {
  const styles = {
    container: {
      backgroundColor: isRead ? '#FFFFFF' : '#F0F9FF',
      borderRadius: '12px',
      padding: '16px',
      border: `1px solid ${isRead ? '#E2E8F0' : '#BFDBFE'}`,
      display: 'flex',
      gap: '12px',
      alignItems: 'flex-start',
      transition: 'all 0.2s ease',
    },
    indicator: {
      width: '8px',
      height: '8px',
      borderRadius: '50%',
      backgroundColor: isRead ? 'transparent' : '#2563EB',
      marginTop: '6px',
      flexShrink: 0,
    },
    content: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      gap: '4px',
    },
    title: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#0F172A',
    },
    message: {
      fontSize: '14px',
      color: '#64748B',
      lineHeight: '1.5',
    },
    timestamp: {
      fontSize: '12px',
      color: '#94A3B8',
      marginTop: '8px',
    },
    button: {
      backgroundColor: 'transparent',
      border: '1px solid #E2E8F0',
      borderRadius: '8px',
      padding: '8px 12px',
      fontSize: '12px',
      color: '#64748B',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      display: isRead ? 'none' : 'block',
    },
  };

  const formatTimestamp = (ts) => {
    if (!ts) return '';
    const date = new Date(ts);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div style={styles.container}>
      <div style={styles.indicator}></div>
      <div style={styles.content}>
        <span style={styles.title}>{title}</span>
        <span style={styles.message}>{message}</span>
        <span style={styles.timestamp}>{formatTimestamp(timestamp)}</span>
      </div>
      {!isRead && onMarkRead && (
        <button
          style={styles.button}
          onClick={onMarkRead}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = '#F8FAFC';
            e.target.style.borderColor = '#2563EB';
            e.target.style.color = '#2563EB';
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = 'transparent';
            e.target.style.borderColor = '#E2E8F0';
            e.target.style.color = '#64748B';
          }}
        >
          Mark as read
        </button>
      )}
    </div>
  );
};

export default NotificationItem;
