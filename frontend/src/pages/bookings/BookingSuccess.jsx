import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const BookingSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const booking = location.state?.booking;

  return (
    <div className="max-w-2xl mx-auto p-6 text-center">
      <div className="bg-white rounded-xl border border-slate-200 p-10 mt-12">
        {/* Success icon */}
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-8 h-8 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-slate-800 mb-2">Booking Submitted!</h1>
        <p className="text-slate-600 mb-6">
          Your booking request has been submitted and is pending approval.
        </p>

        {booking && (
          <div className="text-left bg-slate-50 rounded-lg p-4 mb-8 space-y-2">
            {booking.resourceName && (
              <div className="flex justify-between text-sm">
                <span className="font-medium text-slate-700">Resource:</span>
                <span className="text-slate-800">{booking.resourceName}</span>
              </div>
            )}
            {booking.date && (
              <div className="flex justify-between text-sm">
                <span className="font-medium text-slate-700">Date:</span>
                <span className="text-slate-800">
                  {new Date(booking.date).toLocaleDateString()}
                </span>
              </div>
            )}
            {booking.startTime && booking.endTime && (
              <div className="flex justify-between text-sm">
                <span className="font-medium text-slate-700">Time:</span>
                <span className="text-slate-800">
                  {booking.startTime} – {booking.endTime}
                </span>
              </div>
            )}
            {booking.status && (
              <div className="flex justify-between text-sm">
                <span className="font-medium text-slate-700">Status:</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  {booking.status}
                </span>
              </div>
            )}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate('/bookings/my')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            View My Bookings
          </button>
          <button
            onClick={() => navigate('/bookings/create')}
            className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
          >
            Make Another Booking
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccess;
