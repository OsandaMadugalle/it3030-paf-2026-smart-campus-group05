import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { bookingService } from '../../services/bookingService';
import ConflictChecker from '../../components/bookings/ConflictChecker';
import LoadingSpinner from '../../components/LoadingSpinner';
import StepIndicator from '../../components/StepIndicator';

const CreateBooking = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [formData, setFormData] = useState({
    resourceId: '',
    purpose: '',
    date: '',
    startTime: '',
    endTime: '',
    expectedAttendees: 1,
    notes: ''
  });
  const [conflictResult, setConflictResult] = useState(null);

  useEffect(() => {
    loadFacilities();
  }, []);

  const loadFacilities = async () => {
    try {
      const response = await api.get('/facilities');
      setFacilities(response.data.filter(f => f.status === 'ACTIVE'));
    } catch (error) {
      console.error('Error loading facilities:', error);
    }
  };

  const handleFacilitySelect = (facility) => {
    setSelectedFacility(facility);
    setFormData(prev => ({
      ...prev,
      resourceId: facility.id
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateStep1 = () => {
    return selectedFacility !== null;
  };

  const validateStep2 = () => {
    const { purpose, date, startTime, endTime, expectedAttendees } = formData;
    return purpose.length >= 10 &&
           date &&
           startTime &&
           endTime &&
           new Date(`${date}T${endTime}`) > new Date(`${date}T${startTime}`) &&
           expectedAttendees >= 1 &&
           conflictResult?.hasConflict === false;
  };

  const handleNext = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    } else if (currentStep === 2 && validateStep2()) {
      setCurrentStep(3);
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const bookingData = {
        ...formData,
        expectedAttendees: parseInt(formData.expectedAttendees)
      };
      const response = await bookingService.createBooking(bookingData);
      navigate('/bookings/success', { state: { booking: response } });
    } catch (error) {
      console.error('Error creating booking:', error);
      alert('Failed to create booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getFacilityTypeColor = (type) => {
    const colors = {
      LECTURE_HALL: 'bg-blue-100 text-blue-800',
      LAB: 'bg-green-100 text-green-800',
      MEETING_ROOM: 'bg-purple-100 text-purple-800',
      EQUIPMENT: 'bg-orange-100 text-orange-800'
    };
    return colors[type] || 'bg-slate-100 text-slate-800';
  };

  if (loading && currentStep === 3) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Create New Booking</h1>
        <p className="text-slate-600">Book campus resources for your needs</p>
      </div>

      <StepIndicator currentStep={currentStep} totalSteps={3} />

      {/* Step 1: Select Resource */}
      {currentStep === 1 && (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">Select Resource</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {facilities.map(facility => (
              <div
                key={facility.id}
                onClick={() => handleFacilitySelect(facility)}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedFacility?.id === facility.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-slate-800">{facility.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getFacilityTypeColor(facility.type)}`}>
                    {facility.type.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-sm text-slate-600 mb-2">{facility.location}</p>
                <p className="text-sm text-slate-500">Capacity: {facility.capacity}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleNext}
              disabled={!validateStep1()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Booking Details */}
      {currentStep === 2 && selectedFacility && (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">Booking Details</h2>

          <div className="mb-6 p-4 bg-slate-50 rounded-lg">
            <h3 className="font-medium text-slate-800 mb-1">Selected Resource</h3>
            <p className="text-slate-600">{selectedFacility.name} - {selectedFacility.location}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Date *</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Expected Attendees *</label>
              <input
                type="number"
                name="expectedAttendees"
                value={formData.expectedAttendees}
                onChange={handleInputChange}
                min="1"
                max={selectedFacility.capacity}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Start Time *</label>
              <select
                name="startTime"
                value={formData.startTime}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select start time</option>
                {Array.from({ length: 13 }, (_, i) => {
                  const hour = 8 + i;
                  const timeString = `${hour.toString().padStart(2, '0')}:00`;
                  return (
                    <option key={timeString} value={timeString}>
                      {formatTime(timeString)}
                    </option>
                  );
                })}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">End Time *</label>
              <select
                name="endTime"
                value={formData.endTime}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select end time</option>
                {Array.from({ length: 13 }, (_, i) => {
                  const hour = 9 + i;
                  const timeString = `${hour.toString().padStart(2, '0')}:00`;
                  return (
                    <option key={timeString} value={timeString}>
                      {formatTime(timeString)}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">Purpose *</label>
            <textarea
              name="purpose"
              value={formData.purpose}
              onChange={handleInputChange}
              placeholder="Describe the purpose of this booking (minimum 10 characters)"
              rows={3}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">Notes (Optional)</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Any additional notes or requirements"
              rows={2}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Conflict Checker */}
          {formData.date && formData.startTime && formData.endTime && (
            <ConflictChecker
              resourceId={selectedFacility.id}
              date={formData.date}
              startTime={formData.startTime}
              endTime={formData.endTime}
              onConflictResult={setConflictResult}
            />
          )}

          <div className="mt-6 flex justify-between">
            <button
              onClick={handleBack}
              className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleNext}
              disabled={!validateStep2()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Review & Confirm */}
      {currentStep === 3 && selectedFacility && (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">Review & Confirm</h2>

          <div className="space-y-4">
            <div className="flex justify-between py-2 border-b border-slate-200">
              <span className="font-medium text-slate-700">Resource:</span>
              <span className="text-slate-800">{selectedFacility.name}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-200">
              <span className="font-medium text-slate-700">Type:</span>
              <span className="text-slate-800">{selectedFacility.type.replace('_', ' ')}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-200">
              <span className="font-medium text-slate-700">Location:</span>
              <span className="text-slate-800">{selectedFacility.location}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-200">
              <span className="font-medium text-slate-700">Date:</span>
              <span className="text-slate-800">{new Date(formData.date).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-200">
              <span className="font-medium text-slate-700">Time:</span>
              <span className="text-slate-800">{formatTime(formData.startTime)} - {formatTime(formData.endTime)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-200">
              <span className="font-medium text-slate-700">Duration:</span>
              <span className="text-slate-800">
                {Math.floor((new Date(`${formData.date}T${formData.endTime}`) - new Date(`${formData.date}T${formData.startTime}`)) / (1000 * 60))} minutes
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-200">
              <span className="font-medium text-slate-700">Attendees:</span>
              <span className="text-slate-800">{formData.expectedAttendees}</span>
            </div>
            <div className="py-2">
              <span className="font-medium text-slate-700">Purpose:</span>
              <p className="text-slate-800 mt-1">{formData.purpose}</p>
            </div>
            {formData.notes && (
              <div className="py-2">
                <span className="font-medium text-slate-700">Notes:</span>
                <p className="text-slate-800 mt-1">{formData.notes}</p>
              </div>
            )}
          </div>

          <div className="mt-6 flex justify-between">
            <button
              onClick={handleBack}
              className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-700 transition-colors"
            >
              {loading ? 'Creating...' : 'Confirm Booking'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateBooking;