import React, { useState, useEffect } from 'react';
import { bookingService } from '../services/bookingService';
import StatusBadge from './StatusBadge';
import { showToast } from './Toast';

// Simple QR code using a free API — no library needed
const QRCodeImage = ({ value, size = 180 }) => {
  const encoded = encodeURIComponent(value);
  return (
    <img
      src={`https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encoded}&bgcolor=ffffff&color=0f172a&margin=10`}
      alt="QR Code"
      width={size}
      height={size}
      style={{ borderRadius: '8px', display: 'block' }}
    />
  );
};

const BookingQRCard = ({ booking }) => {
  const [showQR, setShowQR] = useState(false);

  // Generate QR data — encodes the booking info as a JSON string
  const qrData = JSON.stringify({
    bookingId: booking.id,
    facility: booking.resourceName,
    date: booking.date,
    time: `${booking.startTime} - ${booking.endTime}`,
    bookedBy: booking.requestedByName,
    status: booking.status,
  });

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
    });
  };

  const isToday = () => {
    const today = new Date().toISOString().split('T')[0];
    return booking.date === today;
  };


  const styles = {
    card: {
      backgroundColor: '#FFFFFF',
      borderRadius: '16px',
      border: '1px solid #E2E8F0',
      overflow: 'hidden',
      transition: 'all 0.2s ease',
    },
    cardHeader: {
      padding: '16px 20px',
      borderBottom: showQR ? '1px solid #E2E8F0' : 'none',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    },
    facilityName: {
      fontSize: '15px',
      fontWeight: '600',
      color: '#0F172A',
      marginBottom: '4px',
    },
    meta: {
      fontSize: '13px',
      color: '#64748B',
      display: 'flex',
      flexDirection: 'column',
      gap: '2px',
    },
    todayBadge: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      padding: '3px 8px',
      borderRadius: '12px',
      backgroundColor: '#DBEAFE',
      color: '#1D4ED8',
      fontSize: '11px',
      fontWeight: '600',
      marginBottom: '6px',
    },
    qrSection: {
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '16px',
      backgroundColor: '#F8FAFC',
    },
    qrLabel: {
      fontSize: '12px',
      color: '#64748B',
      textAlign: 'center',
      maxWidth: '200px',
      lineHeight: '1.5',
    },
    qrActions: {
      display: 'flex',
      gap: '8px',
    },
    showQRBtn: {
      padding: '8px 16px',
      borderRadius: '8px',
      border: 'none',
      backgroundColor: '#2563EB',
      color: '#FFFFFF',
      fontSize: '13px',
      fontWeight: '500',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      transition: 'all 0.15s ease',
    },
    bookingDetails: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '8px',
      padding: '0 20px 16px',
    },
    detailItem: {
      display: 'flex',
      flexDirection: 'column',
      gap: '2px',
    },
    detailLabel: {
      fontSize: '11px',
      color: '#94A3B8',
      fontWeight: '500',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
    },
    detailValue: {
      fontSize: '13px',
      color: '#0F172A',
      fontWeight: '500',
    },
    downloadBtn: {
      padding: '8px 16px',
      borderRadius: '8px',
      border: '1px solid #E2E8F0',
      backgroundColor: '#FFFFFF',
      color: '#0F172A',
      fontSize: '13px',
      fontWeight: '500',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      transition: 'all 0.15s ease',
    },
  };

  return (
    <div style={styles.card}>
      <div style={styles.cardHeader}>
        <div style={{ flex: 1 }}>
          {isToday() && (
            <div style={styles.todayBadge}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              Today
            </div>
          )}
          <div style={styles.facilityName}>{booking.resourceName}</div>
          <div style={styles.meta}>
            <span>{formatDate(booking.date)}</span>
            <span>{booking.startTime} – {booking.endTime}</span>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
          <StatusBadge status={booking.status?.toLowerCase()} />
          <button
            style={styles.showQRBtn}
            onClick={() => setShowQR(!showQR)}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1D4ED8'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#2563EB'}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7"/>
              <rect x="14" y="3" width="7" height="7"/>
              <rect x="3" y="14" width="7" height="7"/>
              <rect x="14" y="14" width="3" height="3"/>
              <rect x="18" y="14" width="3" height="3"/>
              <rect x="14" y="18" width="3" height="3"/>
              <rect x="18" y="18" width="3" height="3"/>
            </svg>
            {showQR ? 'Hide QR' : 'Show QR'}
          </button>
        </div>
      </div>

      {/* Booking details */}
      <div style={styles.bookingDetails}>
        <div style={styles.detailItem}>
          <span style={styles.detailLabel}>Purpose</span>
          <span style={styles.detailValue}>{booking.purpose || '-'}</span>
        </div>
        <div style={styles.detailItem}>
          <span style={styles.detailLabel}>Attendees</span>
          <span style={styles.detailValue}>{booking.expectedAttendees || '-'}</span>
        </div>
        <div style={styles.detailItem}>
          <span style={styles.detailLabel}>Booking ID</span>
          <span style={{ ...styles.detailValue, fontSize: '11px', fontFamily: 'monospace', color: '#64748B' }}>
            {booking.id?.substring(0, 12)}...
          </span>
        </div>
        {booking.approvedByName && (
          <div style={styles.detailItem}>
            <span style={styles.detailLabel}>Approved By</span>
            <span style={styles.detailValue}>{booking.approvedByName}</span>
          </div>
        )}
      </div>

      {/* QR Code section */}
      {showQR && (
        <div style={styles.qrSection}>
          <QRCodeImage value={qrData} size={180} />
          <p style={styles.qrLabel}>
            Show this QR code at the facility entrance for check-in verification
          </p>
          <div style={styles.qrActions}>
            <a
              href={`https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(qrData)}&bgcolor=ffffff&color=0f172a&margin=10`}
              download={`booking-${booking.id?.substring(0, 8)}.png`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: 'none' }}
            >
              <button style={styles.downloadBtn}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                Download QR
              </button>
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

// Main component — shows all approved bookings with QR codes
const BookingQRManager = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('upcoming');

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
        const data = await bookingService.getMyBookings();
        // Only show approved bookings
        const approved = (data || []).filter(b => b.status === 'APPROVED');
        setBookings(approved);
      } catch (err) {
        showToast('Failed to load bookings', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const today = new Date().toISOString().split('T')[0];

  const filteredBookings = bookings.filter(b => {
    if (filter === 'today') return b.date === today;
    if (filter === 'upcoming') return b.date >= today;
    if (filter === 'past') return b.date < today;
    return true;
  });

  const styles = {
    container: {},
    toolbar: {
      display: 'flex',
      gap: '8px',
      marginBottom: '16px',
      flexWrap: 'wrap',
    },
    filterBtn: (active) => ({
      padding: '6px 14px',
      borderRadius: '20px',
      border: active ? '2px solid #2563EB' : '1px solid #E2E8F0',
      backgroundColor: active ? '#EFF6FF' : '#FFFFFF',
      color: active ? '#2563EB' : '#64748B',
      fontSize: '13px',
      fontWeight: active ? '600' : '400',
      cursor: 'pointer',
      transition: 'all 0.15s ease',
    }),
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
      gap: '16px',
    },
    emptyState: {
      textAlign: 'center',
      padding: '48px 24px',
      backgroundColor: '#F8FAFC',
      borderRadius: '12px',
      border: '1px solid #E2E8F0',
    },
    emptyTitle: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#0F172A',
      marginBottom: '8px',
    },
    emptyMsg: {
      fontSize: '14px',
      color: '#64748B',
    },
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: '#64748B' }}>
        Loading your bookings...
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.toolbar}>
        {['upcoming', 'today', 'past', 'all'].map(f => (
          <button
            key={f}
            style={styles.filterBtn(filter === f)}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
        <span style={{ marginLeft: 'auto', fontSize: '13px', color: '#64748B', alignSelf: 'center' }}>
          {filteredBookings.length} approved booking{filteredBookings.length !== 1 ? 's' : ''}
        </span>
      </div>

      {filteredBookings.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>🎟️</div>
          <div style={styles.emptyTitle}>No approved bookings</div>
          <div style={styles.emptyMsg}>
            {filter === 'today'
              ? "You have no approved bookings for today."
              : "Once your booking requests are approved, QR codes will appear here."}
          </div>
        </div>
      ) : (
        <div style={styles.grid}>
          {filteredBookings.map(booking => (
            <BookingQRCard key={booking.id} booking={booking} />
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingQRManager;