import React, { useState, useEffect } from 'react';
import Modal from './Modal';

const FacilityForm = ({ isOpen, onClose, onSubmit, initialData = null, loading = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'hall',
    location: '',
    capacity: '',
    description: '',
    status: 'active',
    imageUrl: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        type: initialData.type || 'hall',
        location: initialData.location || '',
        capacity: initialData.capacity || '',
        description: initialData.description || '',
        status: initialData.status || 'active',
        imageUrl: initialData.imageUrl || '',
      });
    } else {
      setFormData({
        name: '',
        type: 'hall',
        location: '',
        capacity: '',
        description: '',
        status: 'active',
        imageUrl: '',
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  const facilityTypes = [
    { value: 'hall', label: 'Hall' },
    { value: 'lab', label: 'Laboratory' },
    { value: 'sports', label: 'Sports Facility' },
    { value: 'library', label: 'Library' },
    { value: 'cafeteria', label: 'Cafeteria' },
    { value: 'parking', label: 'Parking' },
    { value: 'dormitory', label: 'Dormitory' },
  ];

  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'maintenance', label: 'Under Maintenance' },
    { value: 'closed', label: 'Closed' },
  ];

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.capacity || formData.capacity <= 0) newErrors.capacity = 'Valid capacity is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({
        ...formData,
        capacity: parseInt(formData.capacity),
      });
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const styles = {
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
    },
    row: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '16px',
    },
    formGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '6px',
    },
    label: {
      fontSize: '14px',
      fontWeight: '500',
      color: '#0F172A',
    },
    required: {
      color: '#EF4444',
    },
    input: (hasError) => ({
      padding: '10px 14px',
      fontSize: '14px',
      border: `1px solid ${hasError ? '#EF4444' : '#E2E8F0'}`,
      borderRadius: '8px',
      outline: 'none',
      transition: 'all 0.2s ease',
      fontFamily: "'Inter', sans-serif",
    }),
    select: (hasError) => ({
      padding: '10px 14px',
      fontSize: '14px',
      border: `1px solid ${hasError ? '#EF4444' : '#E2E8F0'}`,
      borderRadius: '8px',
      outline: 'none',
      transition: 'all 0.2s ease',
      fontFamily: "'Inter', sans-serif",
      backgroundColor: '#FFFFFF',
      cursor: 'pointer',
    }),
    textarea: (hasError) => ({
      padding: '10px 14px',
      fontSize: '14px',
      border: `1px solid ${hasError ? '#EF4444' : '#E2E8F0'}`,
      borderRadius: '8px',
      outline: 'none',
      transition: 'all 0.2s ease',
      fontFamily: "'Inter', sans-serif",
      minHeight: '80px',
      resize: 'vertical',
    }),
    error: {
      fontSize: '12px',
      color: '#EF4444',
      marginTop: '4px',
    },
    buttonGroup: {
      display: 'flex',
      gap: '12px',
      justifyContent: 'flex-end',
      marginTop: '8px',
    },
    cancelBtn: {
      padding: '10px 20px',
      backgroundColor: '#F1F5F9',
      border: 'none',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '500',
      color: '#64748B',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    },
    submitBtn: {
      padding: '10px 24px',
      backgroundColor: '#2563EB',
      border: 'none',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '600',
      color: '#FFFFFF',
      cursor: loading ? 'not-allowed' : 'pointer',
      transition: 'all 0.2s ease',
      opacity: loading ? 0.7 : 1,
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    spinner: {
      width: '16px',
      height: '16px',
      border: '2px solid rgba(255,255,255,0.3)',
      borderTop: '2px solid #FFFFFF',
      borderRadius: '50%',
      animation: 'spin 0.8s linear infinite',
    },
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Facility' : 'Add New Facility'}
      size="md"
    >
      <form style={styles.form} onSubmit={handleSubmit}>
        <div style={styles.formGroup}>
          <label style={styles.label}>
            Name <span style={styles.required}>*</span>
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Enter facility name"
            style={styles.input(errors.name)}
            onFocus={(e) => e.currentTarget.style.borderColor = '#2563EB'}
            onBlur={(e) => e.currentTarget.style.borderColor = errors.name ? '#EF4444' : '#E2E8F0'}
          />
          {errors.name && <span style={styles.error}>{errors.name}</span>}
        </div>

        <div style={styles.row}>
          <div style={styles.formGroup}>
            <label style={styles.label}>
              Type <span style={styles.required}>*</span>
            </label>
            <select
              value={formData.type}
              onChange={(e) => handleChange('type', e.target.value)}
              style={styles.select(false)}
            >
              {facilityTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>
              Status <span style={styles.required}>*</span>
            </label>
            <select
              value={formData.status}
              onChange={(e) => handleChange('status', e.target.value)}
              style={styles.select(false)}
            >
              {statusOptions.map(status => (
                <option key={status.value} value={status.value}>{status.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div style={styles.row}>
          <div style={styles.formGroup}>
            <label style={styles.label}>
              Location <span style={styles.required}>*</span>
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => handleChange('location', e.target.value)}
              placeholder="Building A, Floor 2"
              style={styles.input(errors.location)}
              onFocus={(e) => e.currentTarget.style.borderColor = '#2563EB'}
              onBlur={(e) => e.currentTarget.style.borderColor = errors.location ? '#EF4444' : '#E2E8F0'}
            />
            {errors.location && <span style={styles.error}>{errors.location}</span>}
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>
              Capacity <span style={styles.required}>*</span>
            </label>
            <input
              type="number"
              value={formData.capacity}
              onChange={(e) => handleChange('capacity', e.target.value)}
              placeholder="50"
              min="1"
              style={styles.input(errors.capacity)}
              onFocus={(e) => e.currentTarget.style.borderColor = '#2563EB'}
              onBlur={(e) => e.currentTarget.style.borderColor = errors.capacity ? '#EF4444' : '#E2E8F0'}
            />
            {errors.capacity && <span style={styles.error}>{errors.capacity}</span>}
          </div>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Enter facility description (optional)"
            style={styles.textarea(false)}
            onFocus={(e) => e.currentTarget.style.borderColor = '#2563EB'}
            onBlur={(e) => e.currentTarget.style.borderColor = '#E2E8F0'}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Image URL</label>
          <input
            type="url"
            value={formData.imageUrl}
            onChange={(e) => handleChange('imageUrl', e.target.value)}
            placeholder="https://example.com/image.jpg"
            style={styles.input(false)}
            onFocus={(e) => e.currentTarget.style.borderColor = '#2563EB'}
            onBlur={(e) => e.currentTarget.style.borderColor = '#E2E8F0'}
          />
        </div>

        <div style={styles.buttonGroup}>
          <button
            type="button"
            style={styles.cancelBtn}
            onClick={onClose}
            disabled={loading}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#E2E8F0'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#F1F5F9'}
          >
            Cancel
          </button>
          <button
            type="submit"
            style={styles.submitBtn}
            disabled={loading}
            onMouseOver={(e) => !loading && (e.currentTarget.style.backgroundColor = '#1D4ED8')}
            onMouseOut={(e) => !loading && (e.currentTarget.style.backgroundColor = '#2563EB')}
          >
            {loading && <div style={styles.spinner}></div>}
            {initialData ? 'Update Facility' : 'Add Facility'}
          </button>
        </div>
      </form>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </Modal>
  );
};

export default FacilityForm;
