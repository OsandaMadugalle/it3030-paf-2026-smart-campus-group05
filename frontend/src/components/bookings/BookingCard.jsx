import React from 'react';
import StatusBadge from '../StatusBadge';

const BookingCard = ({ request, onCancel, onView, onResubmit }) => {
  const status = request.status?.toUpperCase() || 'PENDING';

  const formatTime = (timeString) => {
    if (!timeString) return '';
    try {
      const parts = timeString.split(':');
      if (parts.length < 2) return timeString;
      const hours = parseInt(parts[0]);
      const minutes = parts[1];
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const displayHour = hours % 12 || 12;
      return `${displayHour}:${minutes} ${ampm}`;
    } catch (e) {
      return timeString;
    }
  };

  const getBorderColor = () => {
    switch (status) {
      case 'APPROVED': return '#10B981';
      case 'REJECTED': return '#EF4444';
      case 'PENDING': return '#F59E0B';
      case 'CANCELLED': return '#64748B';
      default: return '#E2E8F0';
    }
  };

  const styles = {
    card: {
      backgroundColor: '#FFFFFF',
      borderRadius: '12px',
      border: '1px solid #E2E8F0',
      borderLeft: `4px solid ${getBorderColor()}`,
      padding: '24px',
      transition: 'all 0.2s ease',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '20px',
    },
    facilityName: {
      fontSize: '18px',
      fontWeight: '700',
      color: '#0F172A',
      marginBottom: '4px',
    },
    purpose: {
      fontSize: '14px',
      color: '#475569',
      lineHeight: '1.5',
      marginBottom: '20px',
    },
    details: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '16px',
      marginBottom: '24px',
      padding: '16px',
      backgroundColor: '#F8FAFC',
      borderRadius: '8px',
    },
    detailItem: {
      display: 'flex',
      flexDirection: 'column',
      gap: '4px',
    },
    detailLabel: {
      fontSize: '11px',
      fontWeight: '600',
      color: '#64748B',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
    },
    detailValue: {
      fontSize: '14px',
      color: '#1E293B',
      fontWeight: '500',
    },
    actions: {
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'center',
      gap: '12px',
      paddingTop: '20px',
      borderTop: '1px solid #F1F5F9',
    },
    viewBtn: {
      padding: '8px 16px',
      backgroundColor: '#FFFFFF',
      border: '1px solid #CBD5E1',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '500',
      color: '#334155',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    },
    cancelBtn: {
      padding: '8px 16px',
      backgroundColor: status === 'PENDING' ? '#F1F5F9' : '#EF4444',
      border: 'none',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '500',
      color: status === 'PENDING' ? '#475569' : '#FFFFFF',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    },
    resubmitBtn: {
      padding: '8px 16px',
      backgroundColor: '#2563EB',
      border: 'none',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '500',
      color: '#FFFFFF',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    },
    statusGrid: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    rejectionNote: {
      backgroundColor: '#FEF2F2',
      border: '1px solid #FEE2E2',
      borderRadius: '8px',
      padding: '12px',
      marginBottom: '20px',
    },
    rejectionText: {
      fontSize: '13px',
      color: '#991B1B',
    },
    cancellationNote: {
      backgroundColor: '#F8FAFC',
      border: '1px solid #F1F5F9',
      borderRadius: '8px',
      padding: '12px',
      marginBottom: '20px',
    },
    cancellationText: {
      fontSize: '13px',
      color: '#475569',
    },
    footer: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: '12px',
    },
    submittedOn: {
      fontSize: '12px',
      color: '#94A3B8',
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDurationText = (duration) => {
    if (!duration) return 'N/A';
    if (typeof duration !== 'number') return duration;
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  return (
    <div
      style={styles.card}
      onMouseOver={(e) => {
        e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      <div style={styles.header}>
        <div style={styles.statusGrid}>
          <h3 style={styles.facilityName}>
            {request.resourceName || request.facilityName || 'Facility Request'}
          </h3>
          <StatusBadge status={status} />
        </div>
      </div>

      <p style={styles.purpose}>{request.purpose || 'No purpose specified'}</p>

      <div style={styles.details}>
        <div style={styles.detailItem}>
          <span style={styles.detailLabel}>Date</span>
          <span style={styles.detailValue}>{formatDate(request.date || request.preferredDate)}</span>
        </div>

        <div style={styles.detailItem}>
          <span style={styles.detailLabel}>Time</span>
          <span style={styles.detailValue}>
            {request.startTime && request.endTime 
              ? `${formatTime(request.startTime)} - ${formatTime(request.endTime)}`
              : (request.preferredTime || '-')}
          </span>
        </div>

        <div style={styles.detailItem}>
          <span style={styles.detailLabel}>Duration</span>
          <span style={styles.detailValue}>{getDurationText(request.duration || request.durationMinutes)}</span>
        </div>

        <div style={styles.detailItem}>
          <span style={styles.detailLabel}>Attendees</span>
          <span style={styles.detailValue}>{request.expectedAttendees || 0}</span>
        </div>

        {request.designation && (
          <div style={styles.detailItem}>
            <span style={styles.detailLabel}>Role</span>
            <span style={styles.detailValue}>{request.designation}</span>
          </div>
        )}
      </div>

      {status === 'REJECTED' && request.rejectionReason && (
        <div style={styles.rejectionNote}>
          <p style={styles.rejectionText}>
            <strong>Rejection Reason:</strong> {request.rejectionReason}
          </p>
        </div>
      )}

      {status === 'CANCELLED' && request.cancellationReason && (
        <div style={styles.cancellationNote}>
          <p style={styles.cancellationText}>
            <strong>Cancellation Reason:</strong> {request.cancellationReason}
          </p>
        </div>
      )}

      <div style={styles.actions}>
        <div style={styles.submittedOn}>
          Submitted {formatDate(request.createdAt || request.submittedAt)}
        </div>
        
        <div style={{ display: 'flex', gap: '8px' }}>
          {onView && (
            <button
              style={styles.viewBtn}
              onClick={() => onView(request)}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#F8FAFC'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
            >
              View Details
            </button>
          )}
          
          {(status === 'PENDING' || status === 'APPROVED') && onCancel && (
            <button
              style={styles.cancelBtn}
              onClick={() => onCancel(request)}
              onMouseOver={(e) => e.currentTarget.style.opacity = '0.9'}
              onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
            >
              Cancel
            </button>
          )}

          {status === 'REJECTED' && onResubmit && (
            <button
              style={styles.resubmitBtn}
              onClick={() => onResubmit(request)}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1D4ED8'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#2563EB'}
            >
              Resubmit
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingCard;
