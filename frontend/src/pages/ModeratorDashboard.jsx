import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';
import webSocketService from '../services/websocketService';
import { useRole } from '../hooks/useRole';
import { useIsMobile } from '../hooks/useWindowSize';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import FacilityCard from '../components/FacilityCard';
import BookingTable from '../components/BookingTable';
import ActivityFeed from '../components/ActivityFeed';
import OccupancyDashboard from '../components/OccupancyDashboard';
import CSSBarChart from '../components/CSSBarChart';
import CSSPieChart from '../components/CSSPieChart';
import Modal from '../components/Modal';
import EmptyState from '../components/EmptyState';
import LoadingSpinner, { SkeletonCard } from '../components/LoadingSpinner';
import { showToast } from '../components/Toast';
import IncidentManager from './IncidentManager';

const ModeratorDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { getUserInfo } = useRole();
  const userInfo = getUserInfo();
  const isMobile = useIsMobile();
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  // Auto-switch tab based on notification redirect state
  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
      // Clear state
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Data states
  const [facilities, setFacilities] = useState([]);
  const [requests, setRequests] = useState([]);
  const [activities, setActivities] = useState([]);
  
  // Stats
  const [stats, setStats] = useState({
    totalFacilities: 0,
    activeFacilities: 0,
    pendingRequests: 0,
    todayApprovals: 0,
    maintenanceCount: 0,
    usersOnline: 0,
  });
  
  // Campus Monitor states
  const [facilityTypeFilter, setFacilityTypeFilter] = useState('');
  const [facilityStatusFilter, setFacilityStatusFilter] = useState('');
  
  // Request states
  const [requestSearch, setRequestSearch] = useState('');
  const [requestStatusFilter, setRequestStatusFilter] = useState('pending');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [requestAction, setRequestAction] = useState(null);
  const [actionNotes, setActionNotes] = useState('');
  const [requestPage, setRequestPage] = useState(1);
  
  // Notification states
  // Loading states
  const [actionLoading, setActionLoading] = useState(false);
  
  // Report states
  const [reportDateRange, setReportDateRange] = useState('week');

  const navItems = [
    { id: 'overview', label: 'Overview', icon: 'home' },
    { id: 'monitor', label: 'Campus Monitor', icon: 'monitor' },
    { id: 'requests', label: 'Facility Requests', icon: 'file' },
    { id: 'occupancy', label: 'Live Occupancy', icon: 'users' },
    { id: 'notifications-view', label: 'Notifications Center', icon: 'bell' },
    { id: 'reports', label: 'Reports', icon: 'chart' },
    { id: 'profile', label: 'My Profile', icon: 'shield' },
    { id: 'incidents', label: 'Help Desk / Incidents', icon: 'tool' }
  ];

  // Fetch all data
  const fetchData = useCallback(async () => {
  setLoading(true);
  try {
    // 1. Added api.get('/activities') to the parallel calls
    const [facilitiesRes, requestsRes, activitiesRes] = await Promise.all([
      api.get('/facilities?adminView=true').catch(() => ({ data: [] })),
      api.get('/bookings').catch(() => ({ data: [] })),
      api.get('/activities').catch(() => ({ data: [] })), // New Call
    ]);
    
    setFacilities(facilitiesRes.data || []);
    setRequests(requestsRes.data || []);
    
    // 2. Map the Real Backend Data to match your existing ActivityFeed structure
    // Backend: userName -> Frontend: user.name
    // Backend: targetResource -> Frontend: target
    const realActivities = (activitiesRes.data || []).map(act => ({
      id: act.id,
      user: { name: act.userName }, 
      action: act.action,
      target: act.targetResource,
      timestamp: new Date(act.timestamp) // Ensure it's a JS Date object
    }));

    setActivities(realActivities);

    // 3. Calculate stats (Kept your existing logic)
    const today = new Date().toDateString();
    const facilitiesData = facilitiesRes.data || [];
    const requestsData = requestsRes.data || [];
    
    setStats({
      totalFacilities: facilitiesData.length,
      activeFacilities: facilitiesData.filter(f => f.status?.toLowerCase() === 'active').length,
      pendingRequests: requestsData.filter(r => r.status?.toLowerCase() === 'pending').length,
      todayApprovals: requestsData.filter(r => 
        r.status?.toLowerCase() === 'approved' && 
        new Date(r.updatedAt || r.createdAt).toDateString() === today
      ).length,
      maintenanceCount: facilitiesData.filter(f => f.status?.toLowerCase() === 'maintenance').length,
      usersOnline: Math.floor(Math.random() * 50) + 10, // Keep your mock online count
    });
    
    } catch (err) {
      console.error('Failed to fetch data:', err);
      showToast('Failed to load data', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleRefresh = async () => {
    showToast("Refreshing data...", "info");
    await fetchData();
  };

  useEffect(() => {
    fetchData();

    // Subscribe to booking updates
    webSocketService.connect();
    const subscription = webSocketService.subscribe('/topic/bookings', (updatedBooking) => {
      // Refresh data when a booking is created or updated
      fetchData();
      showToast(`Booking Update: ${updatedBooking.resourceName} - ${updatedBooking.status}`, 'info');
    });

    // NEW: Activity Feed subscription
    const activitySub = webSocketService.subscribe('/topic/activities', (newActivity) => {
      setActivities(prev => [newActivity, ...prev].slice(0, 10)); // Add new activity to top
    });

    return () => {
      webSocketService.unsubscribe('/topic/bookings');
      webSocketService.unsubscribe('/topic/activities');
    };
  }, [fetchData]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  // Request handlers
  const handleApproveRequest = (request) => {
    setSelectedRequest(request);
    setRequestAction('approve');
    setActionNotes('');
  };

  const handleRejectRequest = (request) => {
    setSelectedRequest(request);
    setRequestAction('reject');
    setActionNotes('');
  };

  const handleViewRequest = (request) => {
    setSelectedRequest(request);
    setRequestAction('view');
  };

  const confirmRequestAction = async () => {
    if (!selectedRequest || !requestAction) return;
    if (requestAction === 'view') {
      setSelectedRequest(null);
      setRequestAction(null);
      return;
    }
    
    setActionLoading(true);
    try {
      const endpoint = requestAction === 'approve' 
        ? `/bookings/${selectedRequest.id}/approve`
        : `/bookings/${selectedRequest.id}/reject`;
      
      const payload = {
        status: requestAction === 'approve' ? 'APPROVED' : 'REJECTED',
        reason: actionNotes
      };
      
      await api.put(endpoint, payload);
      showToast(`Request ${requestAction}d successfully`, 'success');
      setSelectedRequest(null);
      setRequestAction(null);
      setActionNotes('');
      fetchData();
    } catch (err) {
      showToast(`Failed to ${requestAction} request`, 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Filtered data
  const filteredFacilities = facilities.filter(f => {
    const matchesType = !facilityTypeFilter || f.type?.toLowerCase() === facilityTypeFilter.toLowerCase();
    const matchesStatus = !facilityStatusFilter || f.status?.toLowerCase() === facilityStatusFilter.toLowerCase();
    return matchesType && matchesStatus;
  });

  const filteredRequests = requests.filter(r => {
    const matchesSearch = !requestSearch || 
      r.user?.name?.toLowerCase().includes(requestSearch.toLowerCase()) ||
      r.facility?.name?.toLowerCase().includes(requestSearch.toLowerCase());
    const matchesStatus = !requestStatusFilter || r.status?.toLowerCase() === requestStatusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  // Report data
  const requestsByFacility = facilities.map(f => ({
    label: f.name?.length > 15 ? f.name.substring(0, 15) + '...' : f.name,
    value: requests.filter(r => r.facility?.id === f.id).length,
    color: '#2563EB',
  })).filter(d => d.value > 0).slice(0, 6);

  const requestsByStatus = [
    { label: 'Pending', value: requests.filter(r => r.status?.toLowerCase() === 'pending').length, color: '#F59E0B' },
    { label: 'Approved', value: requests.filter(r => r.status?.toLowerCase() === 'approved').length, color: '#10B981' },
    { label: 'Rejected', value: requests.filter(r => r.status?.toLowerCase() === 'rejected').length, color: '#EF4444' },
  ];

  const facilityUsageData = facilities.slice(0, 5).map(f => ({
    label: f.name?.length > 12 ? f.name.substring(0, 12) + '...' : f.name,
    value: Math.floor(Math.random() * 100), // Mock usage percentage
    color: f.status?.toLowerCase() === 'active' ? '#10B981' : '#F59E0B',
  }));

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const styles = {
    layout: {
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: '#F8FAFC',
      fontFamily: "'Inter', sans-serif",
    },
    main: {
      flex: 1,
      marginLeft: isMobile ? 0 : '240px',
      padding: isMobile ? '80px 16px 24px 16px' : '0px',
      maxWidth: isMobile ? '100%' : 'calc(100% - 240px)',
      transition: 'margin-left 0.3s ease, padding 0.3s ease',
      minHeight: '100vh',
    },
    contentArea: {
      padding: isMobile ? '0' : '32px',
    },
    header: {
      marginBottom: '32px',
    },
    greeting: {
      fontSize: isMobile ? '22px' : '28px',
      fontWeight: '700',
      color: '#0F172A',
      marginBottom: '8px',
    },
    subtitle: {
      fontSize: '14px',
      color: '#64748B',
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fit, minmax(160px, 1fr))',
      gap: isMobile ? '12px' : '20px',
      marginBottom: '32px',
    },
    section: {
      marginBottom: '32px',
    },
    sectionTitle: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#0F172A',
      marginBottom: '16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    card: {
      backgroundColor: '#FFFFFF',
      borderRadius: '12px',
      border: '1px solid #E2E8F0',
      padding: '24px',
    },
    filterBar: {
      display: 'flex',
      gap: '12px',
      marginBottom: '20px',
      flexWrap: 'wrap',
    },
    searchInput: {
      flex: 1,
      minWidth: '200px',
      padding: '10px 14px 10px 40px',
      fontSize: '14px',
      border: '1px solid #E2E8F0',
      borderRadius: '8px',
      outline: 'none',
      fontFamily: "'Inter', sans-serif",
    },
    searchWrapper: {
      position: 'relative',
      flex: 1,
      minWidth: '200px',
    },
    searchIcon: {
      position: 'absolute',
      left: '12px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#94A3B8',
    },
    select: {
      padding: '10px 14px',
      fontSize: '14px',
      border: '1px solid #E2E8F0',
      borderRadius: '8px',
      outline: 'none',
      fontFamily: "'Inter', sans-serif",
      backgroundColor: '#FFFFFF',
      cursor: 'pointer',
      minWidth: '150px',
    },
    facilitiesGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: '20px',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
    },
    formRow: {
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
    input: {
      padding: '10px 14px',
      fontSize: '14px',
      border: '1px solid #E2E8F0',
      borderRadius: '8px',
      outline: 'none',
      fontFamily: "'Inter', sans-serif",
    },
    textarea: {
      padding: '10px 14px',
      fontSize: '14px',
      border: '1px solid #E2E8F0',
      borderRadius: '8px',
      outline: 'none',
      fontFamily: "'Inter', sans-serif",
      minHeight: '100px',
      resize: 'vertical',
    },
    submitBtn: {
      padding: '12px 24px',
      backgroundColor: '#2563EB',
      border: 'none',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '600',
      color: '#FFFFFF',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      alignSelf: 'flex-start',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
    },
    th: {
      padding: '12px 16px',
      textAlign: 'left',
      fontSize: '12px',
      fontWeight: '600',
      color: '#64748B',
      textTransform: 'uppercase',
      borderBottom: '1px solid #E2E8F0',
      backgroundColor: '#F8FAFC',
    },
    td: {
      padding: '14px 16px',
      fontSize: '14px',
      color: '#0F172A',
      borderBottom: '1px solid #F1F5F9',
    },
    chartsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
      gap: '24px',
    },
    twoColGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '24px',
    },
    pagination: {
      display: 'flex',
      justifyContent: 'center',
      gap: '8px',
      marginTop: '20px',
    },
    pageBtn: (active) => ({
      padding: '8px 12px',
      backgroundColor: active ? '#2563EB' : '#FFFFFF',
      color: active ? '#FFFFFF' : '#64748B',
      border: '1px solid #E2E8F0',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '14px',
    }),
    statusIndicator: (status) => ({
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
    }),
    statusDot: (status) => ({
      width: '10px',
      height: '10px',
      borderRadius: '50%',
      backgroundColor: status === 'active' ? '#10B981' : status === 'maintenance' ? '#F59E0B' : '#EF4444',
      animation: status === 'active' ? 'pulse 2s infinite' : 'none',
    }),
    liveIndicator: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      fontSize: '12px',
      color: '#10B981',
      fontWeight: '600',
    },
    liveDot: {
      width: '8px',
      height: '8px',
      borderRadius: '50%',
      backgroundColor: '#10B981',
      animation: 'pulse 1.5s infinite',
    },
  };

  // Render Overview Tab
  const renderOverview = () => (
    <>
      <div style={{...styles.header, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <div>
          <h1 style={styles.greeting}>{getGreeting()}, {userInfo?.name?.split(' ')[0] || 'Moderator'}!</h1>
          <p style={styles.subtitle}>Here's an overview of campus operations.</p>
        </div>
        <button 
          onClick={handleRefresh}
          className="refresh-btn"
          title="Refresh Data"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="23 4 23 10 17 10"></polyline>
            <polyline points="1 20 1 14 7 14"></polyline>
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
          </svg>
        </button>
      </div>

      <div style={styles.statsGrid}>
        <StatCard title="Total Facilities" value={stats.totalFacilities} icon="building" color="#2563EB" />
        <StatCard title="Active" value={stats.activeFacilities} icon="check" color="#10B981" />
        <StatCard title="Under Maintenance" value={stats.maintenanceCount} icon="tool" color="#F59E0B" />
        <StatCard title="Pending Requests" value={stats.pendingRequests} icon="clock" color="#EF4444" />
        <StatCard title="Today's Approvals" value={stats.todayApprovals} icon="check-circle" color="#10B981" />
        <StatCard title="Users Online" value={stats.usersOnline} icon="users" color="#8B5CF6" />
      </div>

      <div style={styles.twoColGrid}>
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>
            Recent Activity
            <span style={styles.liveIndicator}>
              <span style={styles.liveDot}></span>
              Live
            </span>
          </h3>
          <ActivityFeed activities={activities} maxItems={5} autoRefresh={30000} />
        </div>

        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Quick Actions</h3>
          <div style={{ ...styles.card, display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button
              style={{ padding: '12px 20px', backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '14px', fontWeight: '500', color: '#0F172A', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
              onClick={() => setActiveTab('requests')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
              </svg>
              Review Pending Requests ({stats.pendingRequests})
            </button>
            <button
              style={{ padding: '12px 20px', backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '14px', fontWeight: '500', color: '#0F172A', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
              onClick={() => setActiveTab('monitor')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                <line x1="8" y1="21" x2="16" y2="21"></line>
                <line x1="12" y1="17" x2="12" y2="21"></line>
              </svg>
              Open Campus Monitor
            </button>
            <button
              style={{ padding: '12px 20px', backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '14px', fontWeight: '500', color: '#0F172A', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
              onClick={() => setActiveTab('notifications')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2">
                <path d="M22 2L11 13"></path>
                <path d="M22 2L15 22L11 13L2 9L22 2Z"></path>
              </svg>
              Send Notification
            </button>
            <button
              style={{ padding: '12px 20px', backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '14px', fontWeight: '500', color: '#0F172A', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
              onClick={() => setActiveTab('incidents')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2">
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
              </svg>
              Review Pending Tickets
            </button>
          </div>
        </div>
      </div>

      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Facility Status Overview</h3>
        <div style={styles.facilitiesGrid}>
          {facilities.slice(0, 4).map(facility => (
            <div key={facility.id} style={{ ...styles.card, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontWeight: '500', marginBottom: '4px' }}>{facility.name}</p>
                <p style={{ fontSize: '13px', color: '#64748B' }}>{facility.type || 'Facility'}</p>
              </div>
              <StatusBadge status={facility.status} />
            </div>
          ))}
        </div>
      </div>
    </>
  );

  // Render Campus Monitor Tab
  const renderMonitor = () => (
    <>
      <div style={styles.header}>
        <h1 style={styles.greeting}>Campus Monitor</h1>
        <p style={styles.subtitle}>Real-time overview of all campus facilities.</p>
      </div>

      <div style={styles.filterBar}>
        <select
          value={facilityTypeFilter}
          onChange={(e) => setFacilityTypeFilter(e.target.value)}
          style={styles.select}
        >
          <option value="">All Types</option>
          <option value="hall">Hall</option>
          <option value="lab">Laboratory</option>
          <option value="sports">Sports</option>
          <option value="library">Library</option>
          <option value="cafeteria">Cafeteria</option>
          <option value="parking">Parking</option>
        </select>
        <select
          value={facilityStatusFilter}
          onChange={(e) => setFacilityStatusFilter(e.target.value)}
          style={styles.select}
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="maintenance">Maintenance</option>
          <option value="closed">Closed</option>
        </select>
        <div style={{ marginLeft: 'auto', ...styles.liveIndicator }}>
          <span style={styles.liveDot}></span>
          Live Status
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <div style={{ ...styles.card, textAlign: 'center' }}>
          <p style={{ fontSize: '32px', fontWeight: '700', color: '#10B981' }}>{stats.activeFacilities}</p>
          <p style={{ color: '#64748B', fontSize: '13px' }}>Active Facilities</p>
        </div>
        <div style={{ ...styles.card, textAlign: 'center' }}>
          <p style={{ fontSize: '32px', fontWeight: '700', color: '#F59E0B' }}>{stats.maintenanceCount}</p>
          <p style={{ color: '#64748B', fontSize: '13px' }}>Under Maintenance</p>
        </div>
        <div style={{ ...styles.card, textAlign: 'center' }}>
          <p style={{ fontSize: '32px', fontWeight: '700', color: '#EF4444' }}>{facilities.filter(f => f.status?.toLowerCase() === 'closed').length}</p>
          <p style={{ color: '#64748B', fontSize: '13px' }}>Closed</p>
        </div>
      </div>

      {filteredFacilities.length === 0 ? (
        <EmptyState
          icon="building"
          title="No facilities found"
          message="No facilities match your filter criteria."
        />
      ) : (
        <div style={styles.facilitiesGrid}>
          {filteredFacilities.map(facility => (
            <FacilityCard
              key={facility.id}
              facility={facility}
              showActions={false}
            />
          ))}
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
      `}</style>
    </>
  );

  // Render Requests Tab
  const renderRequests = () => {
    const pageSize = 10;
    const totalPages = Math.ceil(filteredRequests.length / pageSize);
    const paginatedRequests = filteredRequests.slice((requestPage - 1) * pageSize, requestPage * pageSize);

    return (
      <>
        <div style={{...styles.header, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <div>
            <h1 style={styles.greeting}>Facility Requests</h1>
            <p style={styles.subtitle}>Review and manage facility booking requests.</p>
          </div>
          <button 
            onClick={handleRefresh}
            className="refresh-btn"
            title="Refresh Data"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="23 4 23 10 17 10"></polyline>
              <polyline points="1 20 1 14 7 14"></polyline>
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
            </svg>
          </button>
        </div>

        <div style={styles.statsGrid}>
          <StatCard title="Pending" value={requests.filter(r => r.status?.toLowerCase() === 'pending').length} icon="clock" color="#F59E0B" />
          <StatCard title="Approved" value={requests.filter(r => r.status?.toLowerCase() === 'approved').length} icon="check" color="#10B981" />
          <StatCard title="Rejected" value={requests.filter(r => r.status?.toLowerCase() === 'rejected').length} icon="x" color="#EF4444" />
          <StatCard title="Total" value={requests.length} icon="file" color="#2563EB" />
        </div>

        <div style={styles.filterBar}>
          <div style={styles.searchWrapper}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={styles.searchIcon}>
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              placeholder="Search by user or facility..."
              value={requestSearch}
              onChange={(e) => setRequestSearch(e.target.value)}
              style={styles.searchInput}
            />
          </div>
          <select
            value={requestStatusFilter}
            onChange={(e) => setRequestStatusFilter(e.target.value)}
            style={styles.select}
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <BookingTable
          requests={paginatedRequests}
          onApprove={handleApproveRequest}
          onReject={handleRejectRequest}
          onView={handleViewRequest}
          loading={loading}
        />

        {totalPages > 1 && (
          <div style={styles.pagination}>
            <button
              style={styles.pageBtn(false)}
              onClick={() => setRequestPage(p => Math.max(1, p - 1))}
              disabled={requestPage === 1}
            >
              ←
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                style={styles.pageBtn(requestPage === i + 1)}
                onClick={() => setRequestPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button
              style={styles.pageBtn(false)}
              onClick={() => setRequestPage(p => Math.min(totalPages, p + 1))}
              disabled={requestPage === totalPages}
            >
              →
            </button>
          </div>
        )}

        {/* Request Action Modal */}
        <Modal
          isOpen={!!selectedRequest && requestAction}
          onClose={() => { setSelectedRequest(null); setRequestAction(null); }}
          title={requestAction === 'view' ? 'Request Details' : 
                 requestAction === 'approve' ? 'Approve Request' : 'Reject Request'}
          size="md"
        >
          {selectedRequest && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: '#64748B' }}>User</label>
                  <p style={{ fontWeight: '500' }}>{selectedRequest.requestedByName || selectedRequest.user?.name || 'Unknown'}</p>
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#64748B' }}>Email</label>
                  <p>{selectedRequest.requestedByEmail || selectedRequest.user?.email || '-'}</p>
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#64748B' }}>Facility</label>
                  <p style={{ fontWeight: '500' }}>{selectedRequest.resourceName || selectedRequest.facility?.name || 'N/A'}</p>
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#64748B' }}>Current Status</label>
                  <StatusBadge status={selectedRequest.status} />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#64748B' }}>Purpose</label>
                  <p>{selectedRequest.purpose || '-'}</p>
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#64748B' }}>Designation</label>
                  <p>{selectedRequest.designation === 'batch_rep' ? 'Batch Representative' :
                      selectedRequest.designation === 'lecturer' ? 'Lecturer / Faculty' :
                      selectedRequest.designation === 'student' ? 'Student' :
                      selectedRequest.designation === 'staff' ? 'Staff Member' :
                      selectedRequest.designation === 'club_pres' ? 'Club President' :
                      selectedRequest.designation === 'admin' ? 'Administrator' :
                      selectedRequest.designation === 'moderator' ? 'Moderator' :
                      selectedRequest.designation === 'other' ? 'Other' : (selectedRequest.designation || '-')}</p>
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#64748B' }}>Preferred Date</label>
                  <p>{selectedRequest.date || selectedRequest.preferredDate ? new Date(selectedRequest.date || selectedRequest.preferredDate).toLocaleDateString() : '-'}</p>
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#64748B' }}>Time Slot</label>
                  <p>{selectedRequest.startTime ? `${selectedRequest.startTime} - ${selectedRequest.endTime}` : (selectedRequest.timeSlot || '-')}</p>
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#64748B' }}>Submitted</label>
                  <p>{selectedRequest.createdAt ? new Date(selectedRequest.createdAt).toLocaleString() : '-'}</p>
                </div>
              </div>
              
              {(selectedRequest.notes || selectedRequest.additionalNotes) && (
                <div>
                  <label style={{ fontSize: '12px', color: '#64748B' }}>Additional Notes</label>
                  <p style={{ backgroundColor: '#F8FAFC', padding: '12px', borderRadius: '8px', marginTop: '4px' }}>
                    {selectedRequest.notes || selectedRequest.additionalNotes}
                  </p>
                </div>
              )}
              
              {requestAction !== 'view' && (
                <div style={styles.formGroup}>
                  <label style={styles.label}>
                    {requestAction === 'approve' ? 'Notes (optional)' : 'Rejection Reason'}
                    {requestAction === 'reject' && <span style={{ color: '#EF4444' }}> *</span>}
                  </label>
                  <textarea
                    value={actionNotes}
                    onChange={(e) => setActionNotes(e.target.value)}
                    placeholder={requestAction === 'approve' ? 'Add any notes for the user...' : 'Please provide a reason for rejection...'}
                    style={styles.textarea}
                    required={requestAction === 'reject'}
                  />
                </div>
              )}
              
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
                <button
                  style={{ ...styles.submitBtn, backgroundColor: '#F1F5F9', color: '#64748B' }}
                  onClick={() => { setSelectedRequest(null); setRequestAction(null); }}
                >
                  {requestAction === 'view' ? 'Close' : 'Cancel'}
                </button>
                {requestAction !== 'view' && (
                  <button
                    style={{ 
                      ...styles.submitBtn, 
                      backgroundColor: requestAction === 'approve' ? '#10B981' : '#EF4444',
                      opacity: actionLoading ? 0.7 : 1,
                    }}
                    onClick={confirmRequestAction}
                    disabled={actionLoading || (requestAction === 'reject' && !actionNotes.trim())}
                  >
                    {actionLoading ? 'Processing...' : requestAction === 'approve' ? 'Approve' : 'Reject'}
                  </button>
                )}
              </div>
            </div>
          )}
        </Modal>
      </>
    );
  };

  // Render Reports Tab
  const renderReports = () => (
    <>
      <div style={styles.header}>
        <h1 style={styles.greeting}>Reports</h1>
        <p style={styles.subtitle}>Facility usage and request statistics.</p>
      </div>

      <div style={styles.filterBar}>
        <select
          value={reportDateRange}
          onChange={(e) => setReportDateRange(e.target.value)}
          style={styles.select}
        >
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="year">This Year</option>
        </select>
      </div>

      <div style={styles.statsGrid}>
        <StatCard title="Total Requests" value={requests.length} icon="file" color="#2563EB" />
        <StatCard 
          title="Approval Rate" 
          value={`${requests.length > 0 ? Math.round((requests.filter(r => r.status?.toLowerCase() === 'approved').length / requests.length) * 100) : 0}%`} 
          icon="percent" 
          color="#10B981" 
        />
        <StatCard 
          title="Avg Response Time" 
          value="2.5h" 
          icon="clock" 
          color="#F59E0B" 
        />
        <StatCard title="Active Facilities" value={stats.activeFacilities} icon="building" color="#8B5CF6" />
      </div>

      <div style={styles.chartsGrid}>
        <CSSBarChart
          title="Requests by Facility"
          data={requestsByFacility.length > 0 ? requestsByFacility : [{ label: 'No data', value: 0, color: '#E2E8F0' }]}
          horizontal={true}
        />
        <CSSPieChart
          title="Request Status Distribution"
          data={requestsByStatus}
          size={180}
        />
      </div>

      <div style={{ marginTop: '24px' }}>
        <CSSBarChart
          title="Facility Usage (%)"
          data={facilityUsageData.length > 0 ? facilityUsageData : [{ label: 'No data', value: 0, color: '#E2E8F0' }]}
          horizontal={false}
          maxHeight={250}
        />
      </div>
    </>
  );

  // Render Profile Tab
  const renderProfile = () => (
    <>
      <div style={styles.header}>
        <h1 style={styles.greeting}>My Profile</h1>
        <p style={styles.subtitle}>View and manage your personal account information.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 2fr', gap: '24px' }}>
        <div style={{ ...styles.card, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <div style={{ 
            width: '120px', 
            height: '120px', 
            borderRadius: '50%', 
            backgroundColor: '#2563EB',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '40px',
            fontWeight: '600',
            color: '#FFFFFF',
            marginBottom: '20px',
            overflow: 'hidden',
            border: '4px solid #F1F5F9'
          }}>
            {userInfo?.avatarUrl || userInfo?.picture ? (
              <img 
                src={userInfo.avatarUrl || userInfo.picture} 
                alt={userInfo.name} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.innerText = userInfo?.name?.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
                }}
              />
            ) : (
              userInfo?.name?.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
            )}
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#0F172A', marginBottom: '4px' }}>{userInfo?.name}</h2>
          <p style={{ color: '#64748B', marginBottom: '20px' }}>{userInfo?.email}</p>
          
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '24px' }}>
            {userInfo?.roles?.map(role => (
              <span key={role} style={{ 
                backgroundColor: '#DBEAFE', 
                color: '#1D4ED8', 
                padding: '4px 12px', 
                borderRadius: '9999px', 
                fontSize: '12px', 
                fontWeight: '600',
                textTransform: 'uppercase'
              }}>
                {role.replace('ROLE_', '')}
              </span>
            ))}
          </div>

          <div style={{ width: '100%', borderTop: '1px solid #E2E8F0', paddingTop: '24px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#64748B', fontSize: '14px' }}>Account Type</span>
                <span style={{ fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {userInfo?.provider === 'google' && (
                    <svg width="16" height="16" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                  )}
                  {userInfo?.provider || 'Local'}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#64748B', fontSize: '14px' }}>Status</span>
                <span style={{ color: '#10B981', fontWeight: '700', fontSize: '13px' }}>ACTIVE</span>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={styles.card}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>Moderator Insight</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px' }}>
              <div style={{ padding: '16px', backgroundColor: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                <p style={{ color: '#64748B', fontSize: '13px', marginBottom: '8px' }}>Trust Level</p>
                <p style={{ fontSize: '18px', fontWeight: '700', color: '#0F172A' }}>Verified</p>
              </div>
              <div style={{ padding: '16px', backgroundColor: '#ECFDF5', borderRadius: '12px', border: '1px solid #D1FAE5' }}>
                <p style={{ color: '#059669', fontSize: '13px', marginBottom: '8px' }}>Assigned Zone</p>
                <p style={{ fontSize: '18px', fontWeight: '700', color: '#059669' }}>Main Campus</p>
              </div>
            </div>
          </div>

          <div style={styles.card}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>Security & Sessions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', backgroundColor: '#F8FAFC', borderRadius: '12px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2"><path d="M18.36 6.64a9 9 0 1 1-12.73 0"></path><line x1="12" y1="2" x2="12" y2="12"></line></svg>
                    <p style={{ fontWeight: '600', fontSize: '15px', margin: 0 }}>Current Session</p>
                  </div>
                  <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>Manage your active login session</p>
                </div>
                <button 
                  onClick={handleLogout}
                  style={{ 
                    padding: '8px 20px', 
                    backgroundColor: '#FEE2E2', 
                    color: '#DC2626', 
                    border: 'none', 
                    borderRadius: '8px', 
                    fontWeight: '600',
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  Sign Out
                </button>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', backgroundColor: '#F8FAFC', borderRadius: '12px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0369A1" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                    <p style={{ fontWeight: '600', fontSize: '15px', margin: 0 }}>System Support</p>
                  </div>
                  <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>Access staff support channels</p>
                </div>
                <button 
                  onClick={() => navigate('/contact')}
                  style={{ 
                    padding: '8px 20px', 
                    backgroundColor: '#E0F2FE', 
                    color: '#0369A1', 
                    border: 'none', 
                    borderRadius: '8px', 
                    fontWeight: '600',
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  Contact
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  const renderContent = () => {
    if (loading && activeTab === 'overview') {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {[1, 2, 3, 4].map(i => <SkeletonCard key={i} height="100px" />)}
        </div>
      );
    }

    switch (activeTab) {
      case 'overview': return renderOverview();
      case 'monitor': return renderMonitor();
      case 'requests': return renderRequests();
      case 'occupancy': return <OccupancyDashboard />;
      case 'reports': return renderReports();
      case 'profile': return renderProfile();
      case 'incidents': return <IncidentManager />;
      default: return renderOverview();
    }
  };

  return (
    <div style={styles.layout}>
      <Sidebar
        navItems={navItems}
        userInfo={userInfo}
        onLogout={handleLogout}
        activeItem={activeTab}
        onNavClick={(id) => {
          if (id === 'notifications-view') {
            navigate('/notifications');
          } else {
            setActiveTab(id);
          }
        }}
        isOpen={sidebarOpen}
        onToggle={setSidebarOpen}
      />
      <main style={styles.main}>
        {!isMobile && (
          <Navbar 
            title={navItems.find(item => item.id === activeTab)?.label || 'Moderator Dashboard'} 
            userInfo={userInfo} 
            onLogout={handleLogout} 
          />
        )}
        <div style={styles.contentArea}>
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default ModeratorDashboard;
