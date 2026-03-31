import React, { useState, useEffect } from 'react';
import { bookingService } from '../../services/bookingService';
import BookingCard from '../../components/bookings/BookingCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import StatusBadge from '../../components/StatusBadge';
import { useRole } from '../../hooks/useRole';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const { hasRole } = useRole();

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const data = await bookingService.getMyBookings();
      setBookings(data);
    } catch (error) {
      console.error('Error loading bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId, reason) => {
    try {
      await bookingService.cancelBooking(bookingId, reason);
      await loadBookings(); // Refresh the list
    } catch (error) {
      console.error('Error cancelling booking:', error);
      alert('Failed to cancel booking. Please try again.');
    }
  };

  const handleResubmitBooking = (booking) => {
    // Navigate to create booking with pre-filled data
    // This would need to be implemented with routing
    console.log('Resubmit booking:', booking);
  };

  const getFilteredBookings = () => {
    if (activeTab === 'all') return bookings;
    const statusMap = {
      pending: 'PENDING',
      approved: 'APPROVED',
      rejected: 'REJECTED',
      cancelled: 'CANCELLED'
    };
    return bookings.filter(booking => booking.status === statusMap[activeTab]);
  };

  const getStats = () => {
    const stats = {
      total: bookings.length,
      pending: bookings.filter(b => b.status === 'PENDING').length,
      approved: bookings.filter(b => b.status === 'APPROVED').length,
      rejected: bookings.filter(b => b.status === 'REJECTED').length,
      cancelled: bookings.filter(b => b.status === 'CANCELLED').length
    };
    return stats;
  };

  const filteredBookings = getFilteredBookings();
  const stats = getStats();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">My Bookings</h1>
        <p className="text-slate-600">Manage your campus resource bookings</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="text-2xl font-bold text-slate-800">{stats.total}</div>
          <div className="text-sm text-slate-600">Total</div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
          <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          <div className="text-sm text-yellow-600">Pending</div>
        </div>
        <div className="bg-green-50 p-4 rounded-xl border border-green-200">
          <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
          <div className="text-sm text-green-600">Approved</div>
        </div>
        <div className="bg-red-50 p-4 rounded-xl border border-red-200">
          <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
          <div className="text-sm text-red-600">Rejected</div>
        </div>
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div className="text-2xl font-bold text-slate-600">{stats.cancelled}</div>
          <div className="text-sm text-slate-600">Cancelled</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6 bg-slate-100 p-1 rounded-lg">
        {[
          { key: 'all', label: 'All', count: stats.total },
          { key: 'pending', label: 'Pending', count: stats.pending },
          { key: 'approved', label: 'Approved', count: stats.approved },
          { key: 'rejected', label: 'Rejected', count: stats.rejected },
          { key: 'cancelled', label: 'Cancelled', count: stats.cancelled }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? 'bg-white text-slate-800 shadow-sm'
                : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <EmptyState
          title={`No ${activeTab === 'all' ? '' : activeTab} bookings`}
          description={
            activeTab === 'all'
              ? "You haven't made any bookings yet."
              : `You don't have any ${activeTab} bookings.`
          }
          action={
            activeTab === 'all' ? {
              label: 'Create Booking',
              onClick: () => window.location.href = '/bookings/create'
            } : null
          }
        />
      ) : (
        <div className="space-y-4">
          {filteredBookings.map(booking => (
            <BookingCard
              key={booking.id}
              booking={booking}
              onCancel={handleCancelBooking}
              onResubmit={handleResubmitBooking}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;