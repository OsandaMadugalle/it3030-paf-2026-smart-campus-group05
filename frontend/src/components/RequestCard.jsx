import React from 'react';
import StatusBadge from './StatusBadge';

const RequestCard = ({ request, onCancel, onView, onResubmit }) => {
  const status = request.status?.toLowerCase() || 'pending';

  const getBorderColor = () => {
    switch (status) {
      case 'approved': return '#10B981';
      case 'rejected': return '#EF4444';
      case 'pending': return '#F59E0B';
      default: return '#E2E8F0';
    }
  };

  const styles = {
    card: {
      backgroundColor: '#FFFFFF',
      borderRadius: '12px',
      border: '1px solid #E2E8F0',
      borderLeft: `4px solid ${getBorderColor()}`,
      padding: '20px',
      transition: 'all 0.2s ease',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '16px',
    },
    facilityName: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#0F172A',
      marginBottom: '4px',
    },
    purpose: {
      fontSize: '14px',
      color: '#64748B',
      lineHeight: '1.4',
    },
    details: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
      gap: '12px',
      marginBottom: '16px',
    },
    detailItem: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '8px',
    },
    detailIcon: {
      color: '#94A3B8',
      flexShrink: 0,
      marginTop: '2px',
    },
    detailContent: {
      display: 'flex',
      flexDirection: 'column',
    },
    detailLabel: {
      fontSize: '11px',
      color: '#94A3B8',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    },
    detailValue: {
      fontSize: '14px',
      color: '#0F172A',
      fontWeight: '500',
    },
    actions: {
      display: 'flex',
      gap: '10px',
      paddingTop: '16px',
      borderTop: '1px solid #F1F5F9',
    },
    viewBtn: {
      flex: 1,
      padding: '10px 16px',
      backgroundColor: '#F1F5F9',
      border: 'none',
      borderRadius: '8px',
      fontSize: '13px',
      fontWeight: '500',
      color: '#0F172A',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '6px',
    },
    cancelBtn: {
      padding: '10px 16px',
      backgroundColor: '#FEF2F2',
      border: 'none',
      borderRadius: '8px',
      fontSize: '13px',
      fontWeight: '500',
      color: '#DC2626',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    },
    resubmitBtn: {
      padding: '10px 16px',
      backgroundColor: '#DBEAFE',
      border: 'none',
      borderRadius: '8px',
      fontSize: '13px',
      fontWeight: '500',
      color: '#1D4ED8',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    },
    rejectionNote: {
      backgroundColor: '#FEF2F2',
      borderRadius: '8px',
      padding: '12px',
      marginBottom: '16px',
    },
    rejectionLabel: {
      fontSize: '12px',
      fontWeight: '600',
      color: '#DC2626',
      marginBottom: '4px',
    },
    rejectionText: {
      fontSize: '13px',
      color: '#7F1D1D',
    },
    requestId: {
      fontSize: '12px',
      color: '#94A3B8',
      fontFamily: 'monospace',
    },
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div
      style={styles.card}
      onMouseOver={(e) => {
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      <div style={styles.header}>
        <div>
          <h3 style={styles.facilityName}>
            {request.facility?.name || request.facilityName || 'Facility Request'}
          </h3>
          <p style={styles.purpose}>{request.purpose || 'No purpose specified'}</p>
        </div>
        <StatusBadge status={status} />
      </div>

      <div style={styles.details}>
        <div style={styles.detailItem}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={styles.detailIcon}>
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          <div style={styles.detailContent}>
            <span style={styles.detailLabel}>Preferred Date</span>
            <span style={styles.detailValue}>{formatDate(request.preferredDate)}</span>
          </div>
        </div>

        <div style={styles.detailItem}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={styles.detailIcon}>
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          <div style={styles.detailContent}>
            <span style={styles.detailLabel}>Time</span>
            <span style={styles.detailValue}>{request.preferredTime || '-'}</span>
          </div>
        </div>

        <div style={styles.detailItem}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={styles.detailIcon}>
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
          </svg>
          <div style={styles.detailContent}>
            <span style={styles.detailLabel}>Submitted</span>
            <span style={styles.detailValue}>{formatDate(request.createdAt || request.submittedAt)}</span>
          </div>
        </div>

        {request.duration && (
          <div style={styles.detailItem}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={styles.detailIcon}>
              <path d="M5 22h14"></path>
              <path d="M5 2h14"></path>
              <path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22"></path>
              <path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2"></path>
            </svg>
            <div style={styles.detailContent}>
              <span style={styles.detailLabel}>Duration</span>
              <span style={styles.detailValue}>{request.duration}</span>
            </div>
          </div>
        )}
      </div>

      {status === 'rejected' && request.rejectionReason && (
        <div style={styles.rejectionNote}>
          <p style={styles.rejectionLabel}>Rejection Reason</p>
          <p style={styles.rejectionText}>{request.rejectionReason}</p>
        </div>
      )}

      <div style={styles.actions}>
        {onView && (
          <button
            style={styles.viewBtn}
            onClick={() => onView(request)}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#E2E8F0'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#F1F5F9'}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
            View Details
          </button>
        )}
        {(status === 'pending' || status === 'approved') && onCancel && (
          <button
            style={styles.cancelBtn}
            onClick={() => onCancel(request)}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#FEE2E2'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#FEF2F2'}
          >
            Cancel
          </button>
        )}
        {status === 'rejected' && onResubmit && (
          <button
            style={styles.resubmitBtn}
            onClick={() => onResubmit(request)}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#BFDBFE'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#DBEAFE'}
          >
            Resubmit
          </button>
        )}
      </div>

      {request.id && (
        <div style={{ marginTop: '12px', textAlign: 'right' }}>
          <span style={styles.requestId}>ID: {request.id}</span>
        </div>
      )}
    </div>
  );
};

export default RequestCard;
