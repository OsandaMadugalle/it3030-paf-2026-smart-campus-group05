import React, { useState } from 'react';

const AnnouncementCard = ({ 
  title, 
  message, 
  priority = 'normal', 
  sentBy, 
  date, 
  isRead = false, 
  onRead,
  expanded = false 
}) => {
  const [isExpanded, setIsExpanded] = useState(expanded);

  const getPriorityColor = () => {
    switch (priority?.toLowerCase()) {
      case 'critical': return '#EF4444';
      case 'urgent': return '#F59E0B';
      case 'normal': return '#2563EB';
      default: return '#94A3B8';
    }
  };

  const styles = {
    card: {
      backgroundColor: '#FFFFFF',
      borderRadius: '12px',
      border: '1px solid #E2E8F0',
      borderLeft: `4px solid ${getPriorityColor()}`,
      padding: '16px 20px',
      transition: 'all 0.2s ease',
      cursor: 'pointer',
      position: 'relative',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '8px',
    },
    titleContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    unreadDot: {
      width: '8px',
      height: '8px',
      borderRadius: '50%',
      backgroundColor: '#2563EB',
      flexShrink: 0,
    },
    title: {
      fontSize: '15px',
      fontWeight: '600',
      color: '#0F172A',
      margin: 0,
    },
    priorityBadge: {
      fontSize: '11px',
      fontWeight: '600',
      padding: '3px 8px',
      borderRadius: '4px',
      textTransform: 'uppercase',
      backgroundColor: `${getPriorityColor()}15`,
      color: getPriorityColor(),
    },
    message: {
      fontSize: '14px',
      color: '#64748B',
      lineHeight: '1.5',
      marginBottom: '12px',
      overflow: isExpanded ? 'visible' : 'hidden',
      display: isExpanded ? 'block' : '-webkit-box',
      WebkitLineClamp: isExpanded ? 'unset' : 2,
      WebkitBoxOrient: 'vertical',
    },
    readMore: {
      color: '#2563EB',
      fontSize: '13px',
      fontWeight: '500',
      cursor: 'pointer',
      background: 'none',
      border: 'none',
      padding: 0,
      marginBottom: '12px',
    },
    footer: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontSize: '12px',
      color: '#94A3B8',
    },
    sentBy: {
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
    },
    date: {
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
    },
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const handleClick = () => {
    if (!isRead && onRead) {
      onRead();
    }
    setIsExpanded(!isExpanded);
  };

  const needsReadMore = message && message.length > 120;

  return (
    <div
      style={styles.card}
      onClick={handleClick}
      onMouseOver={(e) => {
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <div style={styles.header}>
        <div style={styles.titleContainer}>
          {!isRead && <div style={styles.unreadDot}></div>}
          <h3 style={styles.title}>{title || 'Untitled Announcement'}</h3>
        </div>
        {priority && priority !== 'normal' && (
          <span style={styles.priorityBadge}>{priority}</span>
        )}
      </div>

      <p style={styles.message}>{message || 'No content'}</p>

      {needsReadMore && !isExpanded && (
        <button 
          style={styles.readMore} 
          onClick={(e) => { e.stopPropagation(); setIsExpanded(true); }}
        >
          Read more
        </button>
      )}

      <div style={styles.footer}>
        <span style={styles.sentBy}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          {sentBy || 'Admin'}
        </span>
        <span style={styles.date}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          {formatDate(date)}
        </span>
      </div>
    </div>
  );
};

export default AnnouncementCard;
