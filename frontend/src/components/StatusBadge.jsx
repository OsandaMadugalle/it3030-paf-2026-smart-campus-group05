import React from 'react';

const StatusBadge = ({ status, size = 'md' }) => {
  const statusConfig = {
    // Request statuses
    pending: { bg: '#FEF3C7', color: '#B45309', label: 'Pending' },
    approved: { bg: '#D1FAE5', color: '#047857', label: 'Approved' },
    rejected: { bg: '#FEE2E2', color: '#DC2626', label: 'Rejected' },
    cancelled: { bg: '#F1F5F9', color: '#64748B', label: 'Cancelled' },
    
    // Facility statuses
    active: { bg: '#DBEAFE', color: '#1D4ED8', label: 'Active' },
    maintenance: { bg: '#FEF3C7', color: '#B45309', label: 'Maintenance' },
    closed: { bg: '#F1F5F9', color: '#64748B', label: 'Closed' },
    
    // Priority levels
    critical: { bg: '#FEE2E2', color: '#DC2626', label: 'Critical' },
    urgent: { bg: '#FEF3C7', color: '#B45309', label: 'Urgent' },
    normal: { bg: '#DBEAFE', color: '#1D4ED8', label: 'Normal' },
    low: { bg: '#F1F5F9', color: '#64748B', label: 'Low' },
    
    // User statuses
    online: { bg: '#D1FAE5', color: '#047857', label: 'Online' },
    offline: { bg: '#F1F5F9', color: '#64748B', label: 'Offline' },
    disabled: { bg: '#FEE2E2', color: '#DC2626', label: 'Disabled' },
    
    // Notification types
    info: { bg: '#DBEAFE', color: '#1D4ED8', label: 'Info' },
    warning: { bg: '#FEF3C7', color: '#B45309', label: 'Warning' },
    alert: { bg: '#FEE2E2', color: '#DC2626', label: 'Alert' },
    success: { bg: '#D1FAE5', color: '#047857', label: 'Success' },
    
    // Facility types
    hall: { bg: '#EDE9FE', color: '#7C3AED', label: 'Hall' },
    lab: { bg: '#DBEAFE', color: '#1D4ED8', label: 'Lab' },
    sports: { bg: '#D1FAE5', color: '#047857', label: 'Sports' },
    library: { bg: '#FEF3C7', color: '#B45309', label: 'Library' },
    cafeteria: { bg: '#FFE4E6', color: '#BE123C', label: 'Cafeteria' },
    parking: { bg: '#F1F5F9', color: '#64748B', label: 'Parking' },
    dormitory: { bg: '#CFFAFE', color: '#0891B2', label: 'Dormitory' },
    
    // Ticket Workflow statuses
    open: { bg: '#DBEAFE', color: '#1D4ED8', label: 'Open' },
    in_progress: { bg: '#FEF3C7', color: '#B45309', label: 'In Progress' },
    resolved: { bg: '#D1FAE5', color: '#047857', label: 'Resolved' },
    rejected: { bg: '#FEE2E2', color: '#DC2626', label: 'Rejected' },
    closed: { bg: '#F1F5F9', color: '#64748B', label: 'Closed' },

    // Ticket Priorities (already handled by your existing priority section,
    // but ensure these match your backend Enum)
    high: { bg: '#FFE4E6', color: '#BE123C', label: 'High' },
    
    // Roles
    ROLE_ADMIN: { bg: '#FEE2E2', color: '#DC2626', label: 'Admin' },
    ROLE_MODERATOR: { bg: '#FEF3C7', color: '#B45309', label: 'Moderator' },
    ROLE_USER: { bg: '#DBEAFE', color: '#1D4ED8', label: 'User' },
  };

  const sizeStyles = {
    sm: { padding: '2px 8px', fontSize: '11px' },
    md: { padding: '4px 10px', fontSize: '12px' },
    lg: { padding: '6px 14px', fontSize: '13px' },
  };

  const normalizedStatus = status?.toLowerCase?.() || status;
  const config = statusConfig[normalizedStatus] || statusConfig[status] || { bg: '#F1F5F9', color: '#64748B', label: status };

  const styles = {
    badge: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      backgroundColor: config.bg,
      color: config.color,
      ...sizeStyles[size],
      borderRadius: '6px',
      fontWeight: '600',
      fontFamily: "'Inter', sans-serif",
      whiteSpace: 'nowrap',
    },
    dot: {
      width: '6px',
      height: '6px',
      borderRadius: '50%',
      backgroundColor: config.color,
    },
  };

  return (
    <span style={styles.badge}>
      {(normalizedStatus === 'active' || normalizedStatus === 'online') && <span style={styles.dot}></span>}
      {config.label}
    </span>
  );
};

export default StatusBadge;
