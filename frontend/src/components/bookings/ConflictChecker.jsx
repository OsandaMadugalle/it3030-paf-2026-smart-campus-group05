import React, { useState, useEffect } from 'react';
import { bookingService } from '../../services/bookingService';

const ConflictChecker = ({ resourceId, date, startTime, endTime, onConflictResult }) => {
  const [checking, setChecking] = useState(false);
  const [conflictResult, setConflictResult] = useState(null);

  useEffect(() => {
    if (resourceId && date && startTime && endTime) {
      checkConflicts();
    }
  }, [resourceId, date, startTime, endTime]);

  const checkConflicts = async () => {
    try {
      setChecking(true);
      const result = await bookingService.checkConflicts(resourceId, date, startTime, endTime);
      setConflictResult(result);
      if (onConflictResult) {
        onConflictResult(result);
      }
    } catch (error) {
      console.error('Error checking conflicts:', error);
      setConflictResult({ hasConflict: true, error: 'Failed to check conflicts' });
    } finally {
      setChecking(false);
    }
  };

  if (!resourceId || !date || !startTime || !endTime) {
    return null;
  }

  return (
    <div className="mt-6 p-4 rounded-lg border">
      <div className="flex items-center gap-3">
        {checking ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            <span className="text-slate-600">Checking availability...</span>
          </>
        ) : conflictResult ? (
          conflictResult.hasConflict ? (
            <>
              <div className="text-red-500 text-xl">❌</div>
              <div>
                <p className="font-medium text-red-800">Conflict detected!</p>
                <p className="text-sm text-red-600">
                  This time slot conflicts with an existing booking.
                  {conflictResult.conflictingBookings && conflictResult.conflictingBookings.length > 0 && (
                    <span> ({conflictResult.conflictingBookings.length} conflicting booking(s))</span>
                  )}
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="text-green-500 text-xl">✅</div>
              <div>
                <p className="font-medium text-green-800">Available!</p>
                <p className="text-sm text-green-600">This time slot is available for booking.</p>
              </div>
            </>
          )
        ) : null}
      </div>
    </div>
  );
};

export default ConflictChecker;