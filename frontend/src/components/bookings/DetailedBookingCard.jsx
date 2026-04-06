import React from 'react';
import StatusBadge from '../StatusBadge';

const DetailedBookingCard = ({ booking, onCancel, onView, onResubmit }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
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

  const getStatusBorderColor = (status) => {
    const colors = {
      PENDING: 'border-yellow-200',
      APPROVED: 'border-green-200',
      REJECTED: 'border-red-200',
      CANCELLED: 'border-slate-200'
    };
    return colors[status] || 'border-slate-200';
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

  const handleCancel = () => {
    const reason = prompt('Please provide a reason for cancellation:');
    if (reason && onCancel) {
      onCancel(booking.id, reason);
    }
  };

  const handleResubmit = () => {
    if (onResubmit) {
      onResubmit(booking);
    }
  };

  return (
    <div className={`bg-white rounded-xl border-l-4 ${getStatusBorderColor(booking.status)} border border-slate-200 p-6 hover:shadow-md transition-shadow`}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-slate-800">{booking.resourceName}</h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              booking.resourceType === 'LECTURE_HALL' ? 'bg-blue-100 text-blue-800' :
              booking.resourceType === 'LAB' ? 'bg-green-100 text-green-800' :
              booking.resourceType === 'MEETING_ROOM' ? 'bg-purple-100 text-purple-800' :
              'bg-orange-100 text-orange-800'
            }`}>
              {booking.resourceType.replace('_', ' ')}
            </span>
            <StatusBadge status={booking.status} />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-slate-600">
            <div>
              <span className="font-medium">Date:</span>
              <div>{formatDate(booking.date)}</div>
            </div>
            <div>
              <span className="font-medium">Time:</span>
              <div>{formatTime(booking.startTime)} - {formatTime(booking.endTime)}</div>
            </div>
            <div>
              <span className="font-medium">Duration:</span>
              <div>{getDurationText(booking.duration)}</div>
            </div>
            <div>
              <span className="font-medium">Attendees:</span>
              <div>{booking.expectedAttendees}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-slate-700 line-clamp-2">{booking.purpose}</p>
      </div>

      {/* Status-specific content */}
      {booking.status === 'REJECTED' && booking.rejectionReason && (
        <div className="mb-4 p-3 bg-red-50 rounded-lg">
          <p className="text-sm text-red-800">
            <span className="font-medium">Rejection reason:</span> {booking.rejectionReason}
          </p>
        </div>
      )}

      {booking.status === 'CANCELLED' && booking.cancellationReason && (
        <div className="mb-4 p-3 bg-slate-50 rounded-lg">
          <p className="text-sm text-slate-600">
            <span className="font-medium">Cancellation reason:</span> {booking.cancellationReason}
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-between items-center">
        <div className="text-xs text-slate-500">
          Submitted {new Date(booking.createdAt).toLocaleDateString()}
        </div>

        <div className="flex gap-2">
          {booking.canCancel && onCancel && (
            <button
              onClick={handleCancel}
              className={`px-3 py-1 text-sm ${
                booking.status === 'PENDING' ? 'bg-slate-600' : 'bg-red-600'
              } text-white rounded-lg hover:opacity-90 transition-colors`}
            >
              Cancel
            </button>
          )}

          {booking.status === 'APPROVED' && (
            <button
              onClick={() => window.print()}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Print
            </button>
          )}

          {booking.status === 'REJECTED' && onResubmit && (
            <button
              onClick={handleResubmit}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Resubmit
            </button>
          )}

          {onView && (
            <button
              onClick={() => onView(booking)}
              className="px-3 py-1 text-sm border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
            >
              View Details
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailedBookingCard;