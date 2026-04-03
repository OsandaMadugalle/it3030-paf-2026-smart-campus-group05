import api from './api';

// Normalise facility data from backend (UPPERCASE enums) to frontend (lowercase)
const normaliseFacility = (facility) => ({
  ...facility,
  // Backend returns ACTIVE/OUT_OF_SERVICE, frontend expects active/maintenance/closed
  status: normaliseStatus(facility.status),
  // Backend returns LECTURE_HALL/LAB/MEETING_ROOM/EQUIPMENT, frontend expects hall/lab etc.
  type: normaliseType(facility.type),
});

const normaliseStatus = (status) => {
  if (!status) return 'active';
  const map = {
    'ACTIVE': 'active',
    'OUT_OF_SERVICE': 'maintenance',
    'active': 'active',
    'maintenance': 'maintenance',
    'closed': 'closed',
  };
  return map[status] || status.toLowerCase();
};

const normaliseType = (type) => {
  if (!type) return 'hall';
  const map = {
    'LECTURE_HALL': 'hall',
    'LAB': 'lab',
    'MEETING_ROOM': 'hall',
    'EQUIPMENT': 'default',
    'hall': 'hall',
    'lab': 'lab',
    'sports': 'sports',
    'library': 'library',
    'cafeteria': 'cafeteria',
    'parking': 'parking',
    'dormitory': 'dormitory',
  };
  return map[type] || type.toLowerCase();
};

// Denormalise — convert frontend values back to backend enums before sending
const denormaliseFacility = (data) => ({
  ...data,
  status: denormaliseStatus(data.status),
  type: denormaliseType(data.type),
});

const denormaliseStatus = (status) => {
  const map = {
    'active': 'ACTIVE',
    'maintenance': 'OUT_OF_SERVICE',
    'closed': 'OUT_OF_SERVICE',
    'ACTIVE': 'ACTIVE',
    'OUT_OF_SERVICE': 'OUT_OF_SERVICE',
  };
  return map[status] || 'ACTIVE';
};

const denormaliseType = (type) => {
  const map = {
    'hall': 'LECTURE_HALL',
    'lab': 'LAB',
    'sports': 'LECTURE_HALL',
    'library': 'MEETING_ROOM',
    'cafeteria': 'LECTURE_HALL',
    'parking': 'EQUIPMENT',
    'dormitory': 'LECTURE_HALL',
    'LECTURE_HALL': 'LECTURE_HALL',
    'LAB': 'LAB',
    'MEETING_ROOM': 'MEETING_ROOM',
    'EQUIPMENT': 'EQUIPMENT',
  };
  return map[type] || 'LECTURE_HALL';
};

//  API calls 

// Get all facilities (admin sees all, users see active only)
export const getAllFacilities = async (adminView = false) => {
  const res = await api.get(`/facilities${adminView ? '?adminView=true' : ''}`);
  const data = Array.isArray(res.data) ? res.data : [];
  return data.map(normaliseFacility);
};

// Search facilities with filters
export const searchFacilities = async ({ keyword, type, minCapacity, location } = {}) => {
  const params = new URLSearchParams();
  if (keyword) params.append('keyword', keyword);
  if (type) params.append('type', denormaliseType(type));
  if (minCapacity) params.append('minCapacity', minCapacity);
  if (location) params.append('location', location);

  const res = await api.get(`/facilities/search?${params.toString()}`);
  const data = Array.isArray(res.data) ? res.data : [];
  return data.map(normaliseFacility);
};

// Get single facility by ID
export const getFacilityById = async (id) => {
  const res = await api.get(`/facilities/${id}`);
  return normaliseFacility(res.data);
};

// Create facility (Admin only)
export const createFacility = async (data) => {
  const payload = denormaliseFacility(data);
  const res = await api.post('/facilities', payload);
  return normaliseFacility(res.data);
};

// Update facility (Admin only)
export const updateFacility = async (id, data) => {
  const payload = denormaliseFacility(data);
  const res = await api.put(`/facilities/${id}`, payload);
  return normaliseFacility(res.data);
};

// Toggle status (Admin only)
export const setFacilityStatus = async (id, status) => {
  const backendStatus = denormaliseStatus(status);
  const res = await api.patch(`/facilities/${id}/status?status=${backendStatus}`);
  return normaliseFacility(res.data);
};

// Delete facility (Admin only)
export const deleteFacility = async (id) => {
  await api.delete(`/facilities/${id}`);
};