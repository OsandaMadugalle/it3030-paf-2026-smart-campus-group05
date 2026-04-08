import React, { useState, useEffect, useCallback } from 'react';
import { bookingService } from '../services/bookingService';
import { getAllFacilities } from '../services/facilityService';
import LoadingSpinner from './LoadingSpinner';
import { showToast } from './Toast';

const TIME_SLOTS = [
  '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
];

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const FacilityCalendar = ({ onBookSlot }) => {
  const [facilities, setFacilities] = useState([]);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [weekStart, setWeekStart] = useState(getMonday(new Date()));
  const [loading, setLoading] = useState(false);
  const [loadingFacilities, setLoadingFacilities] = useState(true);
  const [hoveredSlot, setHoveredSlot] = useState(null);

  // Get Monday of the current week
  function getMonday(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    d.setDate(diff);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  // Get array of 7 dates for the week
  const getWeekDays = () => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(weekStart);
      d.setDate(d.getDate() + i);
      return d;
    });
  };

  const weekDays = getWeekDays();

  // Format date to YYYY-MM-DD
  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  // Format date for display
  const formatDisplayDate = (date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Check if date is today
  const isToday = (date) => {
    return formatDate(date) === formatDate(new Date());
  };

  // Check if date is in the past
  const isPast = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  // Load facilities
  useEffect(() => {
    const fetchFacilities = async () => {
      setLoadingFacilities(true);
      try {
        const data = await getAllFacilities(false);
        const active = data.filter(f => f.status === 'active');
        setFacilities(active);
        if (active.length > 0) setSelectedFacility(active[0]);
      } catch (err) {
        showToast('Failed to load facilities', 'error');
      } finally {
        setLoadingFacilities(false);
      }
    };
    fetchFacilities();
  }, []);

  // Load bookings when facility or week changes
  const fetchBookings = useCallback(async () => {
    if (!selectedFacility) return;
    setLoading(true);
    try {
      const data = await bookingService.getResourceBookings(selectedFacility.id);
      setBookings(data || []);
    } catch (err) {
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, [selectedFacility]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  // Get booking for a specific date and time slot
  const getBookingForSlot = (date, timeSlot) => {
    const dateStr = formatDate(date);
    const slotHour = parseInt(timeSlot.split(':')[0]);

    return bookings.find(b => {
      // Handle both "2026-04-06" and "2026-04-06T00:00:00" formats
      const bookingDate = b.date ? String(b.date).split('T')[0] : '';
      if (bookingDate !== dateStr) return false;
      if (b.status === 'CANCELLED' || b.status === 'REJECTED') return false;
      const startHour = parseInt(b.startTime?.split(':')[0] || 0);
      const endHour = parseInt(b.endTime?.split(':')[0] || 0);
      return slotHour >= startHour && slotHour < endHour;
    });
  };

  // Get slot status
  const getSlotStatus = (date, timeSlot) => {
    if (isPast(date)) return 'past';
    const booking = getBookingForSlot(date, timeSlot);
    if (!booking) return 'available';
    if (booking.status === 'APPROVED') return 'approved';
    if (booking.status === 'PENDING') return 'pending';
    return 'available';
  };

  // Handle slot click
  const handleSlotClick = (date, timeSlot) => {
    if (isPast(date)) return;
    const status = getSlotStatus(date, timeSlot);
    if (status !== 'available') return;

    if (onBookSlot) {
      onBookSlot({
        facility: selectedFacility,
        date: formatDate(date),
        startTime: timeSlot,
        endTime: TIME_SLOTS[TIME_SLOTS.indexOf(timeSlot) + 1] || '18:00',
      });
    }
  };

  // Navigate weeks
  const prevWeek = () => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() - 7);
    setWeekStart(d);
  };

  const nextWeek = () => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + 7);
    setWeekStart(d);
  };

  const goToToday = () => setWeekStart(getMonday(new Date()));

  const styles = {
    container: {
      backgroundColor: '#FFFFFF',
      borderRadius: '16px',
      border: '1px solid #E2E8F0',
      overflow: 'hidden',
    },
    header: {
      padding: '20px 24px',
      borderBottom: '1px solid #E2E8F0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '12px',
    },
    title: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#0F172A',
    },
    controls: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    navBtn: {
      width: '32px',
      height: '32px',
      borderRadius: '6px',
      border: '1px solid #E2E8F0',
      backgroundColor: '#FFFFFF',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '14px',
      color: '#64748B',
      transition: 'all 0.15s ease',
    },
    todayBtn: {
      padding: '6px 12px',
      borderRadius: '6px',
      border: '1px solid #E2E8F0',
      backgroundColor: '#FFFFFF',
      cursor: 'pointer',
      fontSize: '13px',
      fontWeight: '500',
      color: '#0F172A',
      transition: 'all 0.15s ease',
    },
    weekRange: {
      fontSize: '14px',
      fontWeight: '500',
      color: '#0F172A',
      minWidth: '180px',
      textAlign: 'center',
    },
    facilitySelector: {
      padding: '12px 24px',
      borderBottom: '1px solid #E2E8F0',
      display: 'flex',
      gap: '8px',
      overflowX: 'auto',
    },
    facilityChip: (selected) => ({
      padding: '6px 14px',
      borderRadius: '20px',
      border: selected ? '2px solid #2563EB' : '1px solid #E2E8F0',
      backgroundColor: selected ? '#EFF6FF' : '#FFFFFF',
      color: selected ? '#2563EB' : '#64748B',
      fontSize: '13px',
      fontWeight: selected ? '600' : '400',
      cursor: 'pointer',
      whiteSpace: 'nowrap',
      transition: 'all 0.15s ease',
    }),
    calendarWrapper: {
      overflowX: 'auto',
    },
    calendar: {
      minWidth: '700px',
    },
    calendarHeader: {
      display: 'grid',
      gridTemplateColumns: '64px repeat(7, 1fr)',
      borderBottom: '1px solid #E2E8F0',
    },
    dayHeader: (isToday, isPast) => ({
      padding: '12px 8px',
      textAlign: 'center',
      fontSize: '12px',
      fontWeight: '600',
      color: isToday ? '#2563EB' : isPast ? '#CBD5E1' : '#64748B',
      borderLeft: '1px solid #F1F5F9',
    }),
    timeColumn: {
      padding: '0',
    },
    calendarRow: {
      display: 'grid',
      gridTemplateColumns: '64px repeat(7, 1fr)',
      borderBottom: '1px solid #F1F5F9',
    },
    timeLabel: {
      padding: '0 8px',
      height: '48px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      fontSize: '11px',
      color: '#94A3B8',
      fontWeight: '500',
    },
    slot: (status, isHovered) => {
      const base = {
        height: '48px',
        borderLeft: '1px solid #F1F5F9',
        cursor: 'default',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '11px',
        fontWeight: '500',
        transition: 'all 0.15s ease',
        position: 'relative',
      };

      if (status === 'past') {
        return { ...base, backgroundColor: '#F8FAFC', cursor: 'not-allowed' };
      }
      if (status === 'approved') {
        return { ...base, backgroundColor: '#FEE2E2', color: '#DC2626', cursor: 'not-allowed' };
      }
      if (status === 'pending') {
        return { ...base, backgroundColor: '#FEF3C7', color: '#B45309', cursor: 'not-allowed' };
      }
      // available
      return {
        ...base,
        backgroundColor: isHovered ? '#DBEAFE' : '#F0FDF4',
        color: isHovered ? '#1D4ED8' : '#16A34A',
        cursor: 'pointer',
        border: isHovered ? '1px solid #93C5FD' : '1px solid transparent',
      };
    },
    legend: {
      padding: '12px 24px',
      borderTop: '1px solid #E2E8F0',
      display: 'flex',
      gap: '20px',
      flexWrap: 'wrap',
    },
    legendItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      fontSize: '12px',
      color: '#64748B',
    },
    legendDot: (color) => ({
      width: '12px',
      height: '12px',
      borderRadius: '3px',
      backgroundColor: color,
    }),
    loadingOverlay: {
      padding: '40px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    clickHint: {
      fontSize: '11px',
      color: '#64748B',
      padding: '8px 24px',
      borderTop: '1px solid #F1F5F9',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
    },
  };

  if (loadingFacilities) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingOverlay}><LoadingSpinner /></div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <p style={styles.title}>Facility Availability Calendar</p>
          <p style={{ fontSize: '13px', color: '#64748B', marginTop: '2px' }}>
            Click a green slot to book instantly
          </p>
        </div>
        <div style={styles.controls}>
          <button
            style={styles.navBtn}
            onClick={prevWeek}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#F1F5F9'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
          >
            ←
          </button>
          <span style={styles.weekRange}>
            {formatDisplayDate(weekDays[0])} – {formatDisplayDate(weekDays[6])}
          </span>
          <button
            style={styles.navBtn}
            onClick={nextWeek}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#F1F5F9'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
          >
            →
          </button>
          <button
            style={styles.todayBtn}
            onClick={goToToday}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#F1F5F9'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
          >
            Today
          </button>
        </div>
      </div>

      {/* Facility selector */}
      <div style={styles.facilitySelector}>
        {facilities.map(f => (
          <button
            key={f.id}
            style={styles.facilityChip(selectedFacility?.id === f.id)}
            onClick={() => setSelectedFacility(f)}
          >
            {f.name}
          </button>
        ))}
      </div>

      {/* Calendar grid */}
      <div style={styles.calendarWrapper}>
        {loading ? (
          <div style={styles.loadingOverlay}><LoadingSpinner /></div>
        ) : (
          <div style={styles.calendar}>
            {/* Day headers */}
            <div style={styles.calendarHeader}>
              <div /> {/* empty corner */}
              {weekDays.map((day, i) => (
                <div key={i} style={styles.dayHeader(isToday(day), isPast(day))}>
                  <div>{DAYS[day.getDay()]}</div>
                  <div style={{
                    marginTop: '4px',
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: isToday(day) ? '#2563EB' : 'transparent',
                    color: isToday(day) ? '#FFFFFF' : 'inherit',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '4px auto 0',
                    fontSize: '13px',
                    fontWeight: isToday(day) ? '700' : '600',
                  }}>
                    {day.getDate()}
                  </div>
                </div>
              ))}
            </div>

            {/* Time slots */}
            {TIME_SLOTS.slice(0, -1).map((slot, slotIdx) => (
              <div key={slot} style={styles.calendarRow}>
                <div style={styles.timeLabel}>{slot}</div>
                {weekDays.map((day, dayIdx) => {
                  const status = getSlotStatus(day, slot);
                  const booking = getBookingForSlot(day, slot);
                  const slotKey = `${dayIdx}-${slotIdx}`;
                  const isHovered = hoveredSlot === slotKey && status === 'available';

                  return (
                    <div
                      key={dayIdx}
                      style={styles.slot(status, isHovered)}
                      onClick={() => handleSlotClick(day, slot)}
                      onMouseEnter={() => status === 'available' && setHoveredSlot(slotKey)}
                      onMouseLeave={() => setHoveredSlot(null)}
                      title={
                        status === 'approved' ? `Booked: ${booking?.requestedByName || 'Someone'} — ${booking?.purpose || ''}` :
                        status === 'pending' ? `Pending: ${booking?.purpose || ''}` :
                        status === 'past' ? 'Past slot' :
                        'Click to book'
                      }
                    >
                      {status === 'approved' && (
                        <span style={{ fontSize: '10px', padding: '0 4px', textAlign: 'center', lineHeight: 1.2 }}>
                          Booked
                        </span>
                      )}
                      {status === 'pending' && (
                        <span style={{ fontSize: '10px', padding: '0 4px', textAlign: 'center', lineHeight: 1.2 }}>
                          Pending
                        </span>
                      )}
                      {status === 'available' && isHovered && (
                        <span style={{ fontSize: '10px' }}>+ Book</span>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Legend */}
      <div style={styles.legend}>
        <div style={styles.legendItem}>
          <div style={styles.legendDot('#BBF7D0')} />
          Available — click to book
        </div>
        <div style={styles.legendItem}>
          <div style={styles.legendDot('#FEE2E2')} />
          Booked (Approved)
        </div>
        <div style={styles.legendItem}>
          <div style={styles.legendDot('#FEF3C7')} />
          Pending approval
        </div>
        <div style={styles.legendItem}>
          <div style={styles.legendDot('#F8FAFC')} />
          Past / Unavailable
        </div>
      </div>

      {onBookSlot && (
        <div style={styles.clickHint}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          Clicking a green slot will pre-fill the booking form with your selected facility and time
        </div>
      )}
    </div>
  );
};

export default FacilityCalendar;