import React, { useState, useEffect, useCallback } from 'react';
import { bookingService } from '../services/bookingService';
import { getAllFacilities } from '../services/facilityService';

const OccupancyDashboard = () => {
  const [facilities, setFacilities] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');

  const today = new Date().toISOString().split('T')[0];
  const currentHour = new Date().getHours();
  const currentMinute = new Date().getMinutes();

  const fetchData = useCallback(async () => {
    try {
      const [facilitiesData, bookingsData] = await Promise.all([
        getAllFacilities(true).catch(() => []),
        bookingService.getAllBookings({ date: today }).catch(() => []),
      ]);
      setFacilities(facilitiesData || []);
      setBookings(bookingsData || []);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Failed to fetch occupancy data', err);
    } finally {
      setLoading(false);
    }
  }, [today]);

  useEffect(() => {
    fetchData();
    // Auto refresh every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [fetchData]);

  // Get current occupancy status for a facility
  const getFacilityOccupancy = (facility) => {
    if (facility.status !== 'active') {
      return { state: 'unavailable', booking: null, nextBooking: null };
    }

    const todayBookings = bookings.filter(b =>
      b.resourceId === facility.id &&
      b.date === today &&
      (b.status === 'APPROVED' || b.status === 'PENDING')
    );

    // Check if currently occupied
    const currentBooking = todayBookings.find(b => {
      const startHour = parseInt(b.startTime?.split(':')[0] || 0);
      const startMin = parseInt(b.startTime?.split(':')[1] || 0);
      const endHour = parseInt(b.endTime?.split(':')[0] || 0);
      const endMin = parseInt(b.endTime?.split(':')[1] || 0);
      const startTotal = startHour * 60 + startMin;
      const endTotal = endHour * 60 + endMin;
      const nowTotal = currentHour * 60 + currentMinute;
      return nowTotal >= startTotal && nowTotal < endTotal;
    });

    if (currentBooking) {
      return {
        state: currentBooking.status === 'APPROVED' ? 'occupied' : 'pending',
        booking: currentBooking,
        nextBooking: null,
      };
    }

    // Find next booking today
    const upcomingBookings = todayBookings
      .filter(b => {
        const startHour = parseInt(b.startTime?.split(':')[0] || 0);
        const startMin = parseInt(b.startTime?.split(':')[1] || 0);
        return startHour * 60 + startMin > currentHour * 60 + currentMinute;
      })
      .sort((a, b) => a.startTime?.localeCompare(b.startTime));

    return {
      state: 'available',
      booking: null,
      nextBooking: upcomingBookings[0] || null,
    };
  };

  // Stats
  const getStats = () => {
    let occupied = 0, available = 0, pending = 0, unavailable = 0;

    facilities.forEach(f => {
      const { state } = getFacilityOccupancy(f);
      if (state === 'occupied') occupied++;
      else if (state === 'available') available++;
      else if (state === 'pending') pending++;
      else unavailable++;
    });

    return { total: facilities.length, occupied, available, pending, unavailable };
  };

  const stats = getStats();

  // Filter facilities
  const filteredFacilities = facilities.filter(f => {
    const { state } = getFacilityOccupancy(f);
    const matchesStatus = filterStatus === 'all' || state === filterStatus;
    const matchesType = filterType === 'all' || f.type === filterType;
    return matchesStatus && matchesType;
  });

  const uniqueTypes = [...new Set(facilities.map(f => f.type).filter(Boolean))];

  const getStateColor = (state) => {
    const colors = {
      occupied: { bg: '#FEE2E2', border: '#FCA5A5', text: '#DC2626', dot: '#EF4444' },
      pending: { bg: '#FEF3C7', border: '#FCD34D', text: '#B45309', dot: '#F59E0B' },
      available: { bg: '#F0FDF4', border: '#86EFAC', text: '#16A34A', dot: '#22C55E' },
      unavailable: { bg: '#F8FAFC', border: '#E2E8F0', text: '#94A3B8', dot: '#CBD5E1' },
    };
    return colors[state] || colors.unavailable;
  };

  const getStateLabel = (state) => ({
    occupied: 'In Use',
    pending: 'Pending',
    available: 'Available',
    unavailable: 'Unavailable',
  }[state] || state);

  const styles = {
    container: {},
    statsRow: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
      gap: '12px',
      marginBottom: '20px',
    },
    statCard: (color) => ({
      backgroundColor: '#FFFFFF',
      borderRadius: '12px',
      border: '1px solid #E2E8F0',
      padding: '16px',
      textAlign: 'center',
      borderTop: `3px solid ${color}`,
    }),
    statValue: {
      fontSize: '28px',
      fontWeight: '700',
      color: '#0F172A',
      lineHeight: 1,
      marginBottom: '4px',
    },
    statLabel: {
      fontSize: '12px',
      color: '#64748B',
      fontWeight: '500',
    },
    toolbar: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '16px',
      flexWrap: 'wrap',
      gap: '12px',
    },
    filters: {
      display: 'flex',
      gap: '8px',
      flexWrap: 'wrap',
    },
    filterChip: (active) => ({
      padding: '6px 12px',
      borderRadius: '20px',
      border: active ? '2px solid #2563EB' : '1px solid #E2E8F0',
      backgroundColor: active ? '#EFF6FF' : '#FFFFFF',
      color: active ? '#2563EB' : '#64748B',
      fontSize: '12px',
      fontWeight: active ? '600' : '400',
      cursor: 'pointer',
      transition: 'all 0.15s ease',
    }),
    liveIndicator: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      fontSize: '12px',
      color: '#16A34A',
      fontWeight: '500',
    },
    liveDot: {
      width: '8px',
      height: '8px',
      borderRadius: '50%',
      backgroundColor: '#22C55E',
      animation: 'pulse 1.5s infinite',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
      gap: '16px',
    },
    facilityCard: (state) => {
      const colors = getStateColor(state);
      return {
        backgroundColor: colors.bg,
        borderRadius: '12px',
        border: `1px solid ${colors.border}`,
        padding: '16px',
        transition: 'all 0.2s ease',
        position: 'relative',
        overflow: 'hidden',
      };
    },
    cardTop: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '12px',
    },
    facilityName: {
      fontSize: '15px',
      fontWeight: '600',
      color: '#0F172A',
      marginBottom: '2px',
    },
    facilityType: {
      fontSize: '12px',
      color: '#64748B',
      textTransform: 'capitalize',
    },
    stateBadge: (state) => {
      const colors = getStateColor(state);
      return {
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
        padding: '4px 10px',
        borderRadius: '20px',
        backgroundColor: '#FFFFFF',
        border: `1px solid ${colors.border}`,
        fontSize: '12px',
        fontWeight: '600',
        color: colors.text,
        whiteSpace: 'nowrap',
      };
    },
    stateDot: (state) => ({
      width: '7px',
      height: '7px',
      borderRadius: '50%',
      backgroundColor: getStateColor(state).dot,
      animation: state === 'occupied' || state === 'available' ? 'pulse 2s infinite' : 'none',
    }),
    bookingInfo: {
      fontSize: '12px',
      color: '#475569',
      display: 'flex',
      flexDirection: 'column',
      gap: '4px',
      marginTop: '8px',
      paddingTop: '8px',
      borderTop: '1px solid rgba(0,0,0,0.06)',
    },
    bookingRow: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
    },
    locationRow: {
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      fontSize: '12px',
      color: '#64748B',
      marginBottom: '8px',
    },
    capacityBar: (percentage) => ({
      height: '4px',
      borderRadius: '2px',
      backgroundColor: '#E2E8F0',
      marginTop: '8px',
      overflow: 'hidden',
      position: 'relative',
    }),
    capacityFill: (state) => ({
      height: '100%',
      width: state === 'occupied' ? '100%' : state === 'pending' ? '60%' : '0%',
      backgroundColor: getStateColor(state).dot,
      borderRadius: '2px',
      transition: 'width 0.5s ease',
    }),
    lastUpdated: {
      fontSize: '11px',
      color: '#94A3B8',
    },
    emptyState: {
      textAlign: 'center',
      padding: '40px',
      color: '#94A3B8',
      fontSize: '14px',
    },
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: '#64748B' }}>
        Loading occupancy data...
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(0.85); }
        }
      `}</style>

      {/* Stats row */}
      <div style={styles.statsRow}>
        <div style={styles.statCard('#22C55E')}>
          <div style={styles.statValue}>{stats.available}</div>
          <div style={styles.statLabel}>Available Now</div>
        </div>
        <div style={styles.statCard('#EF4444')}>
          <div style={styles.statValue}>{stats.occupied}</div>
          <div style={styles.statLabel}>In Use</div>
        </div>
        <div style={styles.statCard('#F59E0B')}>
          <div style={styles.statValue}>{stats.pending}</div>
          <div style={styles.statLabel}>Pending</div>
        </div>
        <div style={styles.statCard('#CBD5E1')}>
          <div style={styles.statValue}>{stats.unavailable}</div>
          <div style={styles.statLabel}>Unavailable</div>
        </div>
        <div style={styles.statCard('#2563EB')}>
          <div style={styles.statValue}>{stats.total}</div>
          <div style={styles.statLabel}>Total Facilities</div>
        </div>
      </div>

      {/* Toolbar */}
      <div style={styles.toolbar}>
        <div style={styles.filters}>
          {['all', 'available', 'occupied', 'pending', 'unavailable'].map(s => (
            <button
              key={s}
              style={styles.filterChip(filterStatus === s)}
              onClick={() => setFilterStatus(s)}
            >
              {s === 'all' ? 'All' : getStateLabel(s)}
            </button>
          ))}
          {uniqueTypes.map(t => (
            <button
              key={t}
              style={styles.filterChip(filterType === t)}
              onClick={() => setFilterType(filterType === t ? 'all' : t)}
            >
              {t}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px' }}>
          <div style={styles.liveIndicator}>
            <span style={styles.liveDot}></span>
            Live — auto refreshes every 30s
          </div>
          <span style={styles.lastUpdated}>
            Last updated: {lastUpdated.toLocaleTimeString()}
          </span>
        </div>
      </div>

      {/* Facility cards grid */}
      {filteredFacilities.length === 0 ? (
        <div style={styles.emptyState}>No facilities match your filters.</div>
      ) : (
        <div style={styles.grid}>
          {filteredFacilities.map(facility => {
            const { state, booking, nextBooking } = getFacilityOccupancy(facility);
            return (
              <div key={facility.id} style={styles.facilityCard(state)}>
                <div style={styles.cardTop}>
                  <div>
                    <div style={styles.facilityName}>{facility.name}</div>
                    <div style={styles.facilityType}>{facility.type}</div>
                  </div>
                  <div style={styles.stateBadge(state)}>
                    <span style={styles.stateDot(state)}></span>
                    {getStateLabel(state)}
                  </div>
                </div>

                {facility.location && (
                  <div style={styles.locationRow}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                    {facility.location}
                  </div>
                )}

                {/* Booking info */}
                {state === 'occupied' && booking && (
                  <div style={styles.bookingInfo}>
                    <div style={styles.bookingRow}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"/>
                        <polyline points="12 6 12 12 16 14"/>
                      </svg>
                      <span style={{ color: '#DC2626', fontWeight: '500' }}>
                        {booking.startTime} – {booking.endTime}
                      </span>
                    </div>
                    <div style={styles.bookingRow}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                        <circle cx="12" cy="7" r="4"/>
                      </svg>
                      <span>{booking.requestedByName}</span>
                    </div>
                    {booking.purpose && (
                      <div style={styles.bookingRow}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                        </svg>
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {booking.purpose}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {state === 'pending' && booking && (
                  <div style={styles.bookingInfo}>
                    <div style={styles.bookingRow}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#B45309" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"/>
                        <polyline points="12 6 12 12 16 14"/>
                      </svg>
                      <span style={{ color: '#B45309', fontWeight: '500' }}>
                        Awaiting approval · {booking.startTime} – {booking.endTime}
                      </span>
                    </div>
                  </div>
                )}

                {state === 'available' && nextBooking && (
                  <div style={styles.bookingInfo}>
                    <div style={styles.bookingRow}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"/>
                        <polyline points="12 6 12 12 16 14"/>
                      </svg>
                      <span style={{ color: '#16A34A' }}>
                        Next booking: {nextBooking.startTime}
                      </span>
                    </div>
                  </div>
                )}

                {state === 'available' && !nextBooking && (
                  <div style={styles.bookingInfo}>
                    <div style={styles.bookingRow}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      <span style={{ color: '#16A34A' }}>Free for the rest of the day</span>
                    </div>
                  </div>
                )}

                {/* Capacity bar */}
                <div style={styles.capacityBar()}>
                  <div style={styles.capacityFill(state)} />
                </div>

                {/* Capacity label */}
                {facility.capacity && (
                  <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '4px' }}>
                    Capacity: {facility.capacity} people
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OccupancyDashboard;