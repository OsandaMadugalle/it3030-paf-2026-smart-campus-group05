import React from 'react';

const BookingTimeline = ({ status, createdAt, approvedAt, rejectionReason }) => {
  const steps = [
    {
      label: 'Submitted',
      date: createdAt,
      completed: true,
      current: status === 'PENDING'
    },
    {
      label: status === 'APPROVED' ? 'Approved' : status === 'REJECTED' ? 'Rejected' : 'Pending Review',
      date: approvedAt,
      completed: status !== 'PENDING',
      current: status !== 'PENDING' && status !== 'CANCELLED',
      error: status === 'REJECTED'
    },
    {
      label: 'Cancelled',
      date: null,
      completed: status === 'CANCELLED',
      current: false
    }
  ];

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  return (
    <div className="relative">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center flex-1">
            {/* Step Circle */}
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                step.error
                  ? 'bg-red-500 text-white'
                  : step.completed
                  ? 'bg-green-500 text-white'
                  : step.current
                  ? 'bg-blue-500 text-white'
                  : 'bg-slate-300 text-slate-600'
              }`}
            >
              {step.error ? '✕' : step.completed ? '✓' : index + 1}
            </div>

            {/* Step Label */}
            <div className="text-center mt-2">
              <div className={`text-sm font-medium ${
                step.current ? 'text-blue-600' : step.completed ? 'text-slate-800' : 'text-slate-500'
              }`}>
                {step.label}
              </div>
              {step.date && (
                <div className="text-xs text-slate-500 mt-1">
                  {formatDate(step.date)}
                </div>
              )}
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div
                className={`absolute top-5 left-1/2 transform translate-x-1/2 w-full h-0.5 ${
                  step.completed && steps[index + 1].completed ? 'bg-green-500' :
                  step.completed ? 'bg-blue-500' : 'bg-slate-300'
                }`}
                style={{
                  width: `${100 / (steps.length - 1)}%`,
                  left: `${(index * 100) / (steps.length - 1)}%`
                }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Rejection Reason */}
      {status === 'REJECTED' && rejectionReason && (
        <div className="mt-4 p-3 bg-red-50 rounded-lg">
          <p className="text-sm text-red-800">
            <span className="font-medium">Reason:</span> {rejectionReason}
          </p>
        </div>
      )}
    </div>
  );
};

export default BookingTimeline;