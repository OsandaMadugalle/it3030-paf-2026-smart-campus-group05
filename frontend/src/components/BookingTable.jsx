import React, { memo } from 'react';
import StatusBadge from './StatusBadge';

const BookingTable = memo(({ 
  requests = [], 
  showActions = true, 
  onApprove, 
  onReject, 
  onCancel, 
  onView,
  loading = false 
}) => {
  const styles = {
    container: {
      backgroundColor: '#FFFFFF',
      borderRadius: '12px',
      border: '1px solid #E2E8F0',
      overflow: 'hidden',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
    },
    thead: {
      backgroundColor: '#F8FAFC',
    },
    th: {
      padding: '14px 16px',
      textAlign: 'left',
      fontSize: '12px',
      fontWeight: '600',
      color: '#64748B',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      borderBottom: '1px solid #E2E8F0',
    },
    tr: {
      transition: 'background-color 0.2s ease',
    },
    td: {
      padding: '14px 16px',
      fontSize: '14px',
      color: '#0F172A',
      borderBottom: '1px solid #F1F5F9',
    },
    userCell: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
    },
    avatar: {
      width: '32px',
      height: '32px',
      borderRadius: '50%',
      backgroundColor: '#E2E8F0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '12px',
      fontWeight: '600',
      color: '#64748B',
    },
    userName: {
      fontWeight: '500',
    },
    facilityCell: {
      color: '#64748B',
    },
    dateCell: {
      fontSize: '13px',
      color: '#64748B',
    },
    actions: {
      display: 'flex',
      gap: '6px',
    },
    actionBtn: (color) => ({
      padding: '6px 12px',
      fontSize: '12px',
      fontWeight: '500',
      borderRadius: '6px',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      backgroundColor: color === 'green' ? '#D1FAE5' : color === 'red' ? '#FEE2E2' : '#F1F5F9',
      color: color === 'green' ? '#047857' : color === 'red' ? '#DC2626' : '#64748B',
    }),
    viewBtn: {
      padding: '6px 12px',
      fontSize: '12px',
      fontWeight: '500',
      borderRadius: '6px',
      border: '1px solid #E2E8F0',
      backgroundColor: '#FFFFFF',
      color: '#64748B',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    },
    emptyState: {
      textAlign: 'center',
      padding: '40px 20px',
      color: '#94A3B8',
      fontSize: '14px',
    },
    skeletonRow: {
      animation: 'shimmer 1.5s infinite',
      background: 'linear-gradient(90deg, #F1F5F9 25%, #E2E8F0 50%, #F1F5F9 75%)',
      backgroundSize: '200% 100%',
      height: '16px',
      borderRadius: '4px',
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

  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <table style={styles.table}>
          <thead style={styles.thead}>
            <tr>
              <th style={styles.th}>#</th>
              <th style={styles.th}>User</th>
              <th style={styles.th}>Facility</th>
              <th style={styles.th}>Purpose</th>
              <th style={styles.th}>Date</th>
              <th style={styles.th}>Status</th>
              {showActions && <th style={styles.th}>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3, 4, 5].map(i => (
              <tr key={i} style={styles.tr}>
                <td style={styles.td}><div style={{ ...styles.skeletonRow, width: '30px' }}></div></td>
                <td style={styles.td}><div style={{ ...styles.skeletonRow, width: '120px' }}></div></td>
                <td style={styles.td}><div style={{ ...styles.skeletonRow, width: '100px' }}></div></td>
                <td style={styles.td}><div style={{ ...styles.skeletonRow, width: '150px' }}></div></td>
                <td style={styles.td}><div style={{ ...styles.skeletonRow, width: '80px' }}></div></td>
                <td style={styles.td}><div style={{ ...styles.skeletonRow, width: '70px' }}></div></td>
                {showActions && <td style={styles.td}><div style={{ ...styles.skeletonRow, width: '100px' }}></div></td>}
              </tr>
            ))}
          </tbody>
        </table>
        <style>{`
          @keyframes shimmer {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
        `}</style>
      </div>
    );
  }

  if (!requests || requests.length === 0) {
    return (
      <div style={styles.container}>
        <div style={styles.emptyState}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '12px' }}>
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
          </svg>
          <p>No requests found</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <table style={styles.table}>
        <thead style={styles.thead}>
          <tr>
            <th style={styles.th}>#</th>
            <th style={styles.th}>User</th>
            <th style={styles.th}>Facility</th>
            <th style={styles.th}>Purpose</th>
            <th style={styles.th}>Preferred Date</th>
            <th style={styles.th}>Submitted</th>
            <th style={styles.th}>Status</th>
            {showActions && <th style={styles.th}>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {requests.map((request, index) => (
            <tr 
              key={request.id || index} 
              style={styles.tr}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#F8FAFC'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <td style={styles.td}>{index + 1}</td>
              <td style={styles.td}>
                <div style={styles.userCell}>
                  {request.requestedByAvatar ? (
                    <img 
                      src={request.requestedByAvatar} 
                      alt={request.requestedByName} 
                      style={{ ...styles.avatar, objectFit: 'cover' }} 
                    />
                  ) : (
                    <div style={styles.avatar}>{getInitials(request.requestedByName || request.user?.name || request.userName)}</div>
                  )}
                  <span style={styles.userName}>{request.requestedByName || request.user?.name || request.userName || 'Unknown'}</span>
                </div>
              </td>
              <td style={{ ...styles.td, ...styles.facilityCell }}>
                {request.resourceName || request.facility?.name || request.facilityName || 'N/A'}
              </td>
              <td style={styles.td}>
                <span style={{ maxWidth: '200px', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {request.purpose || '-'}
                </span>
              </td>
              <td style={{ ...styles.td, ...styles.dateCell }}>
                {formatDate(request.date || request.preferredDate)}
                {(request.startTime || request.preferredTime) && (
                  <span style={{ display: 'block', fontSize: '12px' }}>
                    {request.startTime} - {request.endTime}
                  </span>
                )}
              </td>
              <td style={{ ...styles.td, ...styles.dateCell }}>
                {formatDate(request.createdAt || request.submittedAt)}
              </td>
              <td style={styles.td}>
                <StatusBadge status={request.status || 'pending'} />
              </td>
              {showActions && (
                <td style={styles.td}>
                  <div style={styles.actions}>
                    {onView && (
                      <button
                        style={styles.viewBtn}
                        onClick={() => onView(request)}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#F8FAFC'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
                      >
                        View
                      </button>
                    )}
                    {(request.status?.toUpperCase() === 'PENDING' || request.status?.toUpperCase() === 'APPROVED') && (
                      <>
                        {request.status?.toUpperCase() === 'PENDING' && (
                          <>
                            {onApprove && (
                              <button
                                style={styles.actionBtn('green')}
                                onClick={() => onApprove(request)}
                                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#A7F3D0'}
                                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#D1FAE5'}
                              >
                                Approve
                              </button>
                            )}
                            {onReject && (
                              <button
                                style={styles.actionBtn('red')}
                                onClick={() => onReject(request)}
                                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#FECACA'}
                                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#FEE2E2'}
                              >
                                Reject
                              </button>
                            )}
                          </>
                        )}
                        {onCancel && (
                          <button
                            style={styles.actionBtn('gray')}
                            onClick={() => onCancel(request)}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#E2E8F0'}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#F1F5F9'}
                          >
                            Cancel
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});

export default BookingTable;
