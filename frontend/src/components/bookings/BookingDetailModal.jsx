import React from 'react';
import StatusBadge from '../StatusBadge';
import BookingTimeline from './BookingTimeline';

const BookingDetailModal = ({ booking, isOpen, onClose }) => {
  if (!isOpen || !booking) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getDurationText = (duration) => {
    if (!duration) return '';
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-200">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Booking Details</h2>
              <p className="text-slate-600 mt-1">Booking #{booking.id.slice(-8)}</p>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Status and Timeline */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <StatusBadge status={booking.status} />
              <span className="text-sm text-slate-500">
                Submitted {new Date(booking.createdAt).toLocaleDateString()}
              </span>
            </div>
            <BookingTimeline
              status={booking.status}
              createdAt={booking.createdAt}
              approvedAt={booking.approvedAt}
              rejectionReason={booking.rejectionReason}
            />
          </div>

          {/* Resource Information */}
          <div className="bg-slate-50 rounded-lg p-4">
            <h3 className="font-semibold text-slate-800 mb-3">Resource Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-sm font-medium text-slate-600">Resource:</span>
                <p className="text-slate-800">{booking.resourceName}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-slate-600">Type:</span>
                <p className="text-slate-800">{booking.resourceType.replace('_', ' ')}</p>
              </div>
            </div>
          </div>

          {/* Booking Details */}
          <div className="bg-slate-50 rounded-lg p-4">
            <h3 className="font-semibold text-slate-800 mb-3">Booking Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-sm font-medium text-slate-600">Date:</span>
                <p className="text-slate-800">{formatDate(booking.date)}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-slate-600">Time:</span>
                <p className="text-slate-800">
                  {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium text-slate-600">Duration:</span>
                <p className="text-slate-800">{getDurationText(booking.duration)}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-slate-600">Expected Attendees:</span>
                <p className="text-slate-800">{booking.expectedAttendees}</p>
              </div>
            </div>
          </div>

          {/* User Information */}
          <div className="bg-slate-50 rounded-lg p-4">
            <h3 className="font-semibold text-slate-800 mb-3">Requested By</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-sm font-medium text-slate-600">Name:</span>
                <p className="text-slate-800">{booking.requestedByName}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-slate-600">Email:</span>
                <p className="text-slate-800">{booking.requestedByEmail}</p>
              </div>
            </div>
          </div>

          {/* Purpose */}
          <div className="bg-slate-50 rounded-lg p-4">
            <h3 className="font-semibold text-slate-800 mb-3">Purpose</h3>
            <p className="text-slate-800">{booking.purpose}</p>
          </div>

          {/* Rejection/Cancellation Reasons */}
          {booking.status === 'REJECTED' && booking.rejectionReason && (
            <div className="bg-red-50 rounded-lg p-4">
              <h3 className="font-semibold text-red-800 mb-3">Rejection Reason</h3>
              <p className="text-red-800">{booking.rejectionReason}</p>
              {booking.approvedByName && (
                <p className="text-sm text-red-600 mt-2">
                  Rejected by {booking.approvedByName} on {new Date(booking.approvedAt).toLocaleDateString()}
                </p>
              )}
            </div>
          )}

          {booking.status === 'CANCELLED' && booking.cancellationReason && (
            <div className="bg-slate-50 rounded-lg p-4">
              <h3 className="font-semibold text-slate-800 mb-3">Cancellation Reason</h3>
              <p className="text-slate-800">{booking.cancellationReason}</p>
            </div>
          )}

          {/* Approval Information */}
          {booking.status === 'APPROVED' && booking.approvedByName && (
            <div className="bg-green-50 rounded-lg p-4">
              <h3 className="font-semibold text-green-800 mb-3">Approval Information</h3>
              <p className="text-green-800">
                Approved by {booking.approvedByName} on {new Date(booking.approvedAt).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-slate-600 text-white rounded-lg font-medium hover:bg-slate-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailModal;