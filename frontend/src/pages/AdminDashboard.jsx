import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useRole } from '../hooks/useRole';
import { useIsMobile } from '../hooks/useWindowSize';
import Sidebar from '../components/Sidebar';
import StatCard from '../components/StatCard';
import UserTable from '../components/UserTable';
import StatusBadge from '../components/StatusBadge';
import FacilityCard from '../components/FacilityCard';
import FacilityForm from '../components/FacilityForm';
import RequestTable from '../components/RequestTable';
import AnnouncementCard from '../components/AnnouncementCard';
import ActivityFeed from '../components/ActivityFeed';
import CSSBarChart from '../components/CSSBarChart';
import CSSPieChart from '../components/CSSPieChart';
import Modal from '../components/Modal';
import ConfirmModal from '../components/ConfirmModal';
import EmptyState from '../components/EmptyState';
import LoadingSpinner, { SkeletonCard } from '../components/LoadingSpinner';
import { showToast } from '../components/Toast';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { getUserInfo } = useRole();
  const userInfo = getUserInfo();
  const isMobile = useIsMobile();
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    if (activeTab === 'bookings') {
      navigate('/admin/bookings');
    }
  }, [activeTab, navigate]);
  
  // Data states
  const [users, setUsers] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [requests, setRequests] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [activities, setActivities] = useState([]);
  
  // Stats
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalFacilities: 0,
    pendingRequests: 0,
    approvedToday: 0,
    activeAnnouncements: 0,
    notificationsSent: 0,
  });
  
  // Facility states
  const [facilitySearch, setFacilitySearch] = useState('');
  const [facilityTypeFilter, setFacilityTypeFilter] = useState('');
  const [facilityStatusFilter, setFacilityStatusFilter] = useState('');
  const [showFacilityForm, setShowFacilityForm] = useState(false);
  const [editingFacility, setEditingFacility] = useState(null);
  const [facilityToDelete, setFacilityToDelete] = useState(null);
  
  // Request states
  const [requestSearch, setRequestSearch] = useState('');
  const [requestStatusFilter, setRequestStatusFilter] = useState('');
  const [requestFacilityFilter, setRequestFacilityFilter] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [requestAction, setRequestAction] = useState(null);
  const [actionNotes, setActionNotes] = useState('');
  const [requestPage, setRequestPage] = useState(1);
  
  // User states
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [userAction, setUserAction] = useState(null);
  const [selectedRole, setSelectedRole] = useState('');
  
  // Announcement states
  const [announcementTitle, setAnnouncementTitle] = useState('');
  const [announcementMessage, setAnnouncementMessage] = useState('');
  const [announcementTarget, setAnnouncementTarget] = useState('all');
  const [announcementPriority, setAnnouncementPriority] = useState('normal');
  const [announcementSchedule, setAnnouncementSchedule] = useState('now');
  const [announcementDate, setAnnouncementDate] = useState('');
  
  // Notification states
  const [notificationTitle, setNotificationTitle] = useState('');
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationTarget, setNotificationTarget] = useState('all');
  const [notificationType, setNotificationType] = useState('info');
  
  // Report states
  const [reportDateRange, setReportDateRange] = useState('week');
  
  // Loading states
  const [actionLoading, setActionLoading] = useState(false);

  const ROLES = ['ROLE_USER', 'ROLE_MODERATOR', 'ROLE_ADMIN'];
  
  const navItems = [
    { id: 'overview', label: 'Overview', icon: 'home' },
    { id: 'facilities', label: 'Facilities Management', icon: 'building' },
    { id: 'bookings', label: 'Bookings Management', icon: 'calendar' },
    { id: 'requests', label: 'Requests Overview', icon: 'file' },
    { id: 'users', label: 'Users & Roles', icon: 'users' },
    { id: 'announcements', label: 'Announcements', icon: 'megaphone' },
    { id: 'reports', label: 'Reports & Analytics', icon: 'chart' },
    { id: 'notifications', label: 'Notifications', icon: 'bell' },
    { id: 'settings', label: 'Settings', icon: 'settings' },
  ];

  // Fetch all data
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [usersRes, facilitiesRes, requestsRes, announcementsRes] = await Promise.all([
        api.get('/admin/users').catch(() => ({ data: [] })),
        api.get('/facilities').catch(() => ({ data: [] })),
        api.get('/requests').catch(() => ({ data: [] })),
        api.get('/announcements').catch(() => ({ data: [] })),
      ]);
      
      setUsers(usersRes.data || []);
      setFacilities(facilitiesRes.data || []);
      setRequests(requestsRes.data || []);
      setAnnouncements(announcementsRes.data || []);
      
      // Calculate stats
      const today = new Date().toDateString();
      setStats({
        totalUsers: usersRes.data?.length || 0,
        totalFacilities: facilitiesRes.data?.length || 0,
        pendingRequests: (requestsRes.data || []).filter(r => r.status?.toLowerCase() === 'pending').length,
        approvedToday: (requestsRes.data || []).filter(r => 
          r.status?.toLowerCase() === 'approved' && 
          new Date(r.updatedAt).toDateString() === today
        ).length,
        activeAnnouncements: (announcementsRes.data || []).filter(a => a.active !== false).length,
        notificationsSent: notifications.length,
      });
      
      // Generate mock activities
      setActivities([
        { id: 1, user: { name: 'John Doe' }, action: 'submitted a request for', target: 'Main Hall', timestamp: new Date(Date.now() - 300000) },
        { id: 2, user: { name: 'Jane Smith' }, action: 'approved request for', target: 'Lab 201', timestamp: new Date(Date.now() - 900000) },
        { id: 3, user: { name: 'Admin' }, action: 'created new facility', target: 'Sports Complex', timestamp: new Date(Date.now() - 1800000) },
        { id: 4, user: { name: 'Mike Johnson' }, action: 'cancelled request for', target: 'Library', timestamp: new Date(Date.now() - 3600000) },
        { id: 5, user: { name: 'Sarah Wilson' }, action: 'updated', target: 'Cafeteria status', timestamp: new Date(Date.now() - 7200000) },
      ]);
      
    } catch (err) {
      console.error('Failed to fetch data:', err);
      showToast('Failed to load data', 'error');
    } finally {
      setLoading(false);
    }
  }, [notifications.length]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  // Facility handlers
  const handleAddFacility = () => {
    setEditingFacility(null);
    setShowFacilityForm(true);
  };

  const handleEditFacility = (facility) => {
    setEditingFacility(facility);
    setShowFacilityForm(true);
  };

  const handleDeleteFacility = (facility) => {
    setFacilityToDelete(facility);
  };

  const confirmDeleteFacility = async () => {
    if (!facilityToDelete) return;
    setActionLoading(true);
    try {
      await api.delete(`/facilities/${facilityToDelete.id}`);
      showToast('Facility deleted successfully', 'success');
      setFacilityToDelete(null);
      fetchData();
    } catch (err) {
      showToast('Failed to delete facility', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleFacilitySubmit = async (data) => {
    setActionLoading(true);
    try {
      if (editingFacility) {
        await api.put(`/facilities/${editingFacility.id}`, data);
        showToast('Facility updated successfully', 'success');
      } else {
        await api.post('/facilities', data);
        showToast('Facility created successfully', 'success');
      }
      setShowFacilityForm(false);
      setEditingFacility(null);
      fetchData();
    } catch (err) {
      showToast('Failed to save facility', 'error');
    } finally {
      setActionLoading(false);
    }
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
        ? `/requests/${selectedRequest.id}/approve`
        : `/requests/${selectedRequest.id}/reject`;
      
      await api.put(endpoint, { notes: actionNotes });
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

  // User handlers
  const handleAssignRole = (user) => {
    setSelectedUser(user);
    setUserAction('assign');
    setSelectedRole('');
  };

  const handleRemoveRole = (user) => {
    setSelectedUser(user);
    setUserAction('remove');
    setSelectedRole('');
  };

  const handleDeleteUser = (user) => {
    setSelectedUser(user);
    setUserAction('delete');
  };

  const handleToggleUserStatus = (user) => {
    setSelectedUser(user);
    setUserAction('toggle');
  };

  const confirmUserAction = async () => {
    if (!selectedUser || !userAction) return;
    
    setActionLoading(true);
    try {
      switch (userAction) {
        case 'assign':
          if (!selectedRole) {
            showToast('Please select a role', 'warning');
            setActionLoading(false);
            return;
          }
          await api.post('/admin/roles/assign', { userId: selectedUser.id, role: selectedRole });
          showToast('Role assigned successfully', 'success');
          break;
        case 'remove':
          if (!selectedRole) {
            showToast('Please select a role', 'warning');
            setActionLoading(false);
            return;
          }
          await api.post('/admin/roles/remove', { userId: selectedUser.id, role: selectedRole });
          showToast('Role removed successfully', 'success');
          break;
        case 'delete':
          await api.delete(`/admin/users/${selectedUser.id}`);
          showToast('User deleted successfully', 'success');
          break;
        case 'toggle':
          await api.put(`/admin/users/${selectedUser.id}/toggle-status`);
          showToast('User status updated', 'success');
          break;
        default:
          break;
      }
      setSelectedUser(null);
      setUserAction(null);
      setSelectedRole('');
      fetchData();
    } catch (err) {
      showToast(`Failed to ${userAction} user`, 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Announcement handlers
  const handleSendAnnouncement = async (e) => {
    e.preventDefault();
    if (!announcementTitle.trim() || !announcementMessage.trim()) {
      showToast('Please fill in all required fields', 'warning');
      return;
    }
    
    setActionLoading(true);
    try {
      await api.post('/announcements', {
        title: announcementTitle,
        message: announcementMessage,
        target: announcementTarget,
        priority: announcementPriority,
        scheduledFor: announcementSchedule === 'later' ? announcementDate : null,
      });
      showToast('Announcement sent successfully', 'success');
      setAnnouncementTitle('');
      setAnnouncementMessage('');
      setAnnouncementTarget('all');
      setAnnouncementPriority('normal');
      setAnnouncementSchedule('now');
      setAnnouncementDate('');
      fetchData();
    } catch (err) {
      showToast('Failed to send announcement', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Notification handlers
  const handleSendNotification = async (e) => {
    e.preventDefault();
    if (!notificationTitle.trim() || !notificationMessage.trim()) {
      showToast('Please fill in all required fields', 'warning');
      return;
    }
    
    setActionLoading(true);
    try {
      await api.post('/notifications', {
        title: notificationTitle,
        message: notificationMessage,
        target: notificationTarget,
        type: notificationType,
      });
      showToast('Notification sent successfully', 'success');
      setNotifications(prev => [{
        id: Date.now(),
        title: notificationTitle,
        message: notificationMessage,
        target: notificationTarget,
        type: notificationType,
        sentAt: new Date().toISOString(),
        sentBy: userInfo?.name || 'Admin',
      }, ...prev]);
      setNotificationTitle('');
      setNotificationMessage('');
      setNotificationTarget('all');
      setNotificationType('info');
    } catch (err) {
      showToast('Failed to send notification', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Filtered data
  const filteredFacilities = facilities.filter(f => {
    const matchesSearch = !facilitySearch || 
      f.name?.toLowerCase().includes(facilitySearch.toLowerCase()) ||
      f.location?.toLowerCase().includes(facilitySearch.toLowerCase());
    const matchesType = !facilityTypeFilter || f.type?.toLowerCase() === facilityTypeFilter.toLowerCase();
    const matchesStatus = !facilityStatusFilter || f.status?.toLowerCase() === facilityStatusFilter.toLowerCase();
    return matchesSearch && matchesType && matchesStatus;
  });

  const filteredRequests = requests.filter(r => {
    const matchesSearch = !requestSearch || 
      r.user?.name?.toLowerCase().includes(requestSearch.toLowerCase()) ||
      r.facility?.name?.toLowerCase().includes(requestSearch.toLowerCase());
    const matchesStatus = !requestStatusFilter || r.status?.toLowerCase() === requestStatusFilter.toLowerCase();
    const matchesFacility = !requestFacilityFilter || r.facility?.id === requestFacilityFilter;
    return matchesSearch && matchesStatus && matchesFacility;
  });

  const filteredUsers = users.filter(u => {
    const matchesSearch = !userSearch || 
      u.name?.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email?.toLowerCase().includes(userSearch.toLowerCase());
    const matchesRole = !userRoleFilter || u.roles?.includes(userRoleFilter);
    return matchesSearch && matchesRole;
  });

  // Report data
  const requestsByFacility = facilities.map(f => ({
    label: f.name,
    value: requests.filter(r => r.facility?.id === f.id).length,
    color: '#2563EB',
  })).filter(d => d.value > 0).slice(0, 6);

  const requestsByStatus = [
    { label: 'Pending', value: requests.filter(r => r.status?.toLowerCase() === 'pending').length, color: '#F59E0B' },
    { label: 'Approved', value: requests.filter(r => r.status?.toLowerCase() === 'approved').length, color: '#10B981' },
    { label: 'Rejected', value: requests.filter(r => r.status?.toLowerCase() === 'rejected').length, color: '#EF4444' },
  ];

  const getLast7DaysData = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayStr = date.toLocaleDateString('en-US', { weekday: 'short' });
      const count = requests.filter(r => {
        const rDate = new Date(r.createdAt);
        return rDate.toDateString() === date.toDateString();
      }).length;
      days.push({ label: dayStr, value: count, color: '#2563EB' });
    }
    return days;
  };

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
      marginLeft: isMobile ? 0 : '260px',
      padding: isMobile ? '80px 16px 24px 16px' : '32px',
      maxWidth: isMobile ? '100%' : 'calc(100% - 260px)',
      transition: 'margin-left 0.3s ease, padding 0.3s ease',
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
      gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fit, minmax(180px, 1fr))',
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
    addBtn: {
      position: 'fixed',
      bottom: '32px',
      right: '32px',
      width: '56px',
      height: '56px',
      borderRadius: '50%',
      backgroundColor: '#2563EB',
      border: 'none',
      color: '#FFFFFF',
      fontSize: '24px',
      cursor: 'pointer',
      boxShadow: '0 4px 12px rgba(37, 99, 235, 0.4)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.2s ease',
      zIndex: 100,
    },
    quickActions: {
      display: 'flex',
      gap: '12px',
      flexWrap: 'wrap',
    },
    quickActionBtn: {
      padding: '12px 20px',
      backgroundColor: '#FFFFFF',
      border: '1px solid #E2E8F0',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '500',
      color: '#0F172A',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
    },
    formRow: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
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
      gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
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
  };

  // Render Overview Tab
  const renderOverview = () => (
    <>
      <div style={styles.header}>
        <h1 style={styles.greeting}>{getGreeting()}, {userInfo?.name?.split(' ')[0] || 'Admin'}!</h1>
        <p style={styles.subtitle}>Here's what's happening on your campus today.</p>
      </div>

      <div style={styles.statsGrid}>
        <StatCard title="Total Users" value={stats.totalUsers} icon="users" color="#2563EB" />
        <StatCard title="Total Facilities" value={stats.totalFacilities} icon="building" color="#10B981" />
        <StatCard title="Pending Requests" value={stats.pendingRequests} icon="clock" color="#F59E0B" />
        <StatCard title="Approved Today" value={stats.approvedToday} icon="check" color="#10B981" />
        <StatCard title="Active Announcements" value={stats.activeAnnouncements} icon="megaphone" color="#8B5CF6" />
        <StatCard title="Notifications Sent" value={stats.notificationsSent} icon="bell" color="#EC4899" />
      </div>

      <div style={styles.twoColGrid}>
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Recent Activity</h3>
          <ActivityFeed activities={activities} maxItems={5} />
        </div>

        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Quick Actions</h3>
          <div style={{ ...styles.card, display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button
              style={styles.quickActionBtn}
              onClick={() => { setActiveTab('facilities'); handleAddFacility(); }}
              onMouseOver={(e) => e.currentTarget.style.borderColor = '#2563EB'}
              onMouseOut={(e) => e.currentTarget.style.borderColor = '#E2E8F0'}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              Add Facility
            </button>
            <button
              style={styles.quickActionBtn}
              onClick={() => setActiveTab('announcements')}
              onMouseOver={(e) => e.currentTarget.style.borderColor = '#2563EB'}
              onMouseOut={(e) => e.currentTarget.style.borderColor = '#E2E8F0'}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2">
                <path d="M22 2L11 13"></path>
                <path d="M22 2L15 22L11 13L2 9L22 2Z"></path>
              </svg>
              Send Announcement
            </button>
            <button
              style={styles.quickActionBtn}
              onClick={() => setActiveTab('users')}
              onMouseOver={(e) => e.currentTarget.style.borderColor = '#2563EB'}
              onMouseOut={(e) => e.currentTarget.style.borderColor = '#E2E8F0'}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              Manage Users
            </button>
          </div>
        </div>
      </div>
    </>
  );

  // Render Bookings Tab
  const renderBookings = () => null;
  const renderFacilities = () => (
    <>
      <div style={styles.header}>
        <h1 style={styles.greeting}>Facilities Management</h1>
        <p style={styles.subtitle}>Manage all campus facilities and their availability.</p>
      </div>

      <div style={styles.statsGrid}>
        <StatCard title="Total Facilities" value={facilities.length} icon="building" color="#2563EB" />
        <StatCard title="Active" value={facilities.filter(f => f.status?.toLowerCase() === 'active').length} icon="check" color="#10B981" />
        <StatCard title="Under Maintenance" value={facilities.filter(f => f.status?.toLowerCase() === 'maintenance').length} icon="tool" color="#F59E0B" />
        <StatCard title="Closed" value={facilities.filter(f => f.status?.toLowerCase() === 'closed').length} icon="x" color="#EF4444" />
      </div>

      <div style={styles.filterBar}>
        <div style={styles.searchWrapper}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={styles.searchIcon}>
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="text"
            placeholder="Search facilities..."
            value={facilitySearch}
            onChange={(e) => setFacilitySearch(e.target.value)}
            style={styles.searchInput}
          />
        </div>
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
          <option value="dormitory">Dormitory</option>
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
      </div>

      {filteredFacilities.length === 0 ? (
        <EmptyState
          icon="building"
          title="No facilities found"
          message="No facilities match your search criteria. Try adjusting your filters or add a new facility."
          actionLabel="Add Facility"
          onAction={handleAddFacility}
        />
      ) : (
        <div style={styles.facilitiesGrid}>
          {filteredFacilities.map(facility => (
            <FacilityCard
              key={facility.id}
              facility={facility}
              onEdit={handleEditFacility}
              onDelete={handleDeleteFacility}
            />
          ))}
        </div>
      )}

      <button
        style={styles.addBtn}
        onClick={handleAddFacility}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)';
          e.currentTarget.style.backgroundColor = '#1D4ED8';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.backgroundColor = '#2563EB';
        }}
      >
        +
      </button>

      <FacilityForm
        isOpen={showFacilityForm}
        onClose={() => { setShowFacilityForm(false); setEditingFacility(null); }}
        onSubmit={handleFacilitySubmit}
        initialData={editingFacility}
        loading={actionLoading}
      />

      <ConfirmModal
        isOpen={!!facilityToDelete}
        onClose={() => setFacilityToDelete(null)}
        onConfirm={confirmDeleteFacility}
        title="Delete Facility"
        message={`Are you sure you want to delete "${facilityToDelete?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        confirmColor="#EF4444"
        loading={actionLoading}
      />
    </>
  );

  // Render Requests Tab
  const renderRequests = () => {
    const pageSize = 10;
    const totalPages = Math.ceil(filteredRequests.length / pageSize);
    const paginatedRequests = filteredRequests.slice((requestPage - 1) * pageSize, requestPage * pageSize);

    return (
      <>
        <div style={styles.header}>
          <h1 style={styles.greeting}>Requests Overview</h1>
          <p style={styles.subtitle}>Review and manage all facility requests.</p>
        </div>

        <div style={styles.statsGrid}>
          <StatCard title="Total Requests" value={requests.length} icon="file" color="#2563EB" />
          <StatCard title="Pending" value={requests.filter(r => r.status?.toLowerCase() === 'pending').length} icon="clock" color="#F59E0B" />
          <StatCard title="Approved" value={requests.filter(r => r.status?.toLowerCase() === 'approved').length} icon="check" color="#10B981" />
          <StatCard title="Rejected" value={requests.filter(r => r.status?.toLowerCase() === 'rejected').length} icon="x" color="#EF4444" />
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
          </select>
          <select
            value={requestFacilityFilter}
            onChange={(e) => setRequestFacilityFilter(e.target.value)}
            style={styles.select}
          >
            <option value="">All Facilities</option>
            {facilities.map(f => (
              <option key={f.id} value={f.id}>{f.name}</option>
            ))}
          </select>
        </div>

        <RequestTable
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
                  <p style={{ fontWeight: '500' }}>{selectedRequest.user?.name || 'Unknown'}</p>
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#64748B' }}>Facility</label>
                  <p style={{ fontWeight: '500' }}>{selectedRequest.facility?.name || 'N/A'}</p>
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#64748B' }}>Purpose</label>
                  <p>{selectedRequest.purpose || '-'}</p>
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#64748B' }}>Preferred Date</label>
                  <p>{selectedRequest.preferredDate ? new Date(selectedRequest.preferredDate).toLocaleDateString() : '-'}</p>
                </div>
              </div>
              
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

  // Render Users Tab
  const renderUsers = () => (
    <>
      <div style={styles.header}>
        <h1 style={styles.greeting}>Users & Roles</h1>
        <p style={styles.subtitle}>Manage users and their access permissions.</p>
      </div>

      <div style={styles.statsGrid}>
        <StatCard title="Total Users" value={users.length} icon="users" color="#2563EB" />
        <StatCard title="Moderators" value={users.filter(u => u.roles?.includes('ROLE_MODERATOR')).length} icon="shield" color="#F59E0B" />
        <StatCard title="Admins" value={users.filter(u => u.roles?.includes('ROLE_ADMIN')).length} icon="crown" color="#EF4444" />
      </div>

      <div style={styles.filterBar}>
        <div style={styles.searchWrapper}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={styles.searchIcon}>
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="text"
            placeholder="Search users..."
            value={userSearch}
            onChange={(e) => setUserSearch(e.target.value)}
            style={styles.searchInput}
          />
        </div>
        <select
          value={userRoleFilter}
          onChange={(e) => setUserRoleFilter(e.target.value)}
          style={styles.select}
        >
          <option value="">All Roles</option>
          {ROLES.map(role => (
            <option key={role} value={role}>{role.replace('ROLE_', '')}</option>
          ))}
        </select>
      </div>

      <div style={styles.card}>
        {loading ? (
          <LoadingSpinner />
        ) : filteredUsers.length === 0 ? (
          <EmptyState icon="users" title="No users found" message="No users match your search criteria." />
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>User</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Roles</th>
                <th style={styles.th}>Provider</th>
                <th style={styles.th}>Joined</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id}>
                  <td style={styles.td}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <img
                        src={user.picture || `https://ui-avatars.com/api/?name=${user.name}&background=E2E8F0&color=64748B`}
                        alt={user.name}
                        style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <span style={{ fontWeight: '500' }}>{user.name}</span>
                    </div>
                  </td>
                  <td style={{ ...styles.td, color: '#64748B' }}>{user.email}</td>
                  <td style={styles.td}>
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                      {user.roles?.map(role => (
                        <StatusBadge key={role} status={role} size="sm" />
                      ))}
                    </div>
                  </td>
                  <td style={styles.td}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748B' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      Google
                    </span>
                  </td>
                  <td style={{ ...styles.td, color: '#64748B' }}>
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}
                  </td>
                  <td style={styles.td}>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        onClick={() => handleAssignRole(user)}
                        style={{ 
                          padding: '6px 10px', 
                          backgroundColor: '#DBEAFE', 
                          border: 'none', 
                          borderRadius: '6px',
                          fontSize: '12px',
                          color: '#1D4ED8',
                          cursor: 'pointer',
                        }}
                      >
                        Assign
                      </button>
                      <button
                        onClick={() => handleRemoveRole(user)}
                        style={{ 
                          padding: '6px 10px', 
                          backgroundColor: '#FEF3C7', 
                          border: 'none', 
                          borderRadius: '6px',
                          fontSize: '12px',
                          color: '#B45309',
                          cursor: 'pointer',
                        }}
                      >
                        Remove
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user)}
                        style={{ 
                          padding: '6px 10px', 
                          backgroundColor: '#FEE2E2', 
                          border: 'none', 
                          borderRadius: '6px',
                          fontSize: '12px',
                          color: '#DC2626',
                          cursor: 'pointer',
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* User Action Modal */}
      <Modal
        isOpen={!!selectedUser && userAction}
        onClose={() => { setSelectedUser(null); setUserAction(null); setSelectedRole(''); }}
        title={
          userAction === 'assign' ? 'Assign Role' :
          userAction === 'remove' ? 'Remove Role' :
          userAction === 'delete' ? 'Delete User' :
          'Toggle User Status'
        }
        size="sm"
      >
        {selectedUser && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <p style={{ color: '#64748B', marginBottom: '4px' }}>Selected User</p>
              <p style={{ fontWeight: '600' }}>{selectedUser.name}</p>
              <p style={{ fontSize: '13px', color: '#64748B' }}>{selectedUser.email}</p>
            </div>

            {(userAction === 'assign' || userAction === 'remove') && (
              <div style={styles.formGroup}>
                <label style={styles.label}>Select Role</label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  style={styles.select}
                >
                  <option value="">Choose a role...</option>
                  {ROLES.filter(role => 
                    userAction === 'assign' 
                      ? !selectedUser.roles?.includes(role)
                      : selectedUser.roles?.includes(role)
                  ).map(role => (
                    <option key={role} value={role}>{role.replace('ROLE_', '')}</option>
                  ))}
                </select>
              </div>
            )}

            {userAction === 'delete' && (
              <p style={{ color: '#EF4444', backgroundColor: '#FEF2F2', padding: '12px', borderRadius: '8px' }}>
                ⚠️ This action cannot be undone. The user will be permanently deleted.
              </p>
            )}

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                style={{ ...styles.submitBtn, backgroundColor: '#F1F5F9', color: '#64748B' }}
                onClick={() => { setSelectedUser(null); setUserAction(null); setSelectedRole(''); }}
              >
                Cancel
              </button>
              <button
                style={{ 
                  ...styles.submitBtn,
                  backgroundColor: userAction === 'delete' ? '#EF4444' : '#2563EB',
                }}
                onClick={confirmUserAction}
                disabled={actionLoading || ((userAction === 'assign' || userAction === 'remove') && !selectedRole)}
              >
                {actionLoading ? 'Processing...' : 'Confirm'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );

  // Render Announcements Tab
  const renderAnnouncements = () => (
    <>
      <div style={styles.header}>
        <h1 style={styles.greeting}>Announcements</h1>
        <p style={styles.subtitle}>Create and manage campus-wide announcements.</p>
      </div>

      <div style={styles.twoColGrid}>
        <div style={styles.card}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '20px' }}>Send New Announcement</h3>
          <form style={styles.form} onSubmit={handleSendAnnouncement}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Title <span style={{ color: '#EF4444' }}>*</span></label>
              <input
                type="text"
                value={announcementTitle}
                onChange={(e) => setAnnouncementTitle(e.target.value)}
                placeholder="Announcement title"
                style={styles.input}
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Message <span style={{ color: '#EF4444' }}>*</span></label>
              <textarea
                value={announcementMessage}
                onChange={(e) => setAnnouncementMessage(e.target.value)}
                placeholder="Write your announcement message..."
                style={styles.textarea}
                required
              />
              <span style={{ fontSize: '12px', color: '#94A3B8' }}>{announcementMessage.length}/500 characters</span>
            </div>
            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Target Audience</label>
                <select
                  value={announcementTarget}
                  onChange={(e) => setAnnouncementTarget(e.target.value)}
                  style={styles.select}
                >
                  <option value="all">All Users</option>
                  <option value="ROLE_USER">Students/Staff Only</option>
                  <option value="ROLE_MODERATOR">Moderators Only</option>
                </select>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Priority</label>
                <select
                  value={announcementPriority}
                  onChange={(e) => setAnnouncementPriority(e.target.value)}
                  style={styles.select}
                >
                  <option value="normal">Normal</option>
                  <option value="urgent">Urgent</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
            </div>
            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Schedule</label>
                <select
                  value={announcementSchedule}
                  onChange={(e) => setAnnouncementSchedule(e.target.value)}
                  style={styles.select}
                >
                  <option value="now">Send Now</option>
                  <option value="later">Schedule for Later</option>
                </select>
              </div>
              {announcementSchedule === 'later' && (
                <div style={styles.formGroup}>
                  <label style={styles.label}>Date & Time</label>
                  <input
                    type="datetime-local"
                    value={announcementDate}
                    onChange={(e) => setAnnouncementDate(e.target.value)}
                    style={styles.input}
                  />
                </div>
              )}
            </div>
            <button
              type="submit"
              style={{ ...styles.submitBtn, opacity: actionLoading ? 0.7 : 1 }}
              disabled={actionLoading}
            >
              {actionLoading ? 'Sending...' : 'Send Announcement'}
            </button>
          </form>
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600' }}>Recent Announcements</h3>
            <span style={{ 
              backgroundColor: '#DBEAFE', 
              color: '#1D4ED8', 
              padding: '4px 10px', 
              borderRadius: '12px', 
              fontSize: '12px',
              fontWeight: '600',
            }}>
              {announcements.length} Active
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {announcements.length === 0 ? (
              <EmptyState icon="bell" title="No announcements" message="No announcements have been sent yet." />
            ) : (
              announcements.slice(0, 5).map((announcement, index) => (
                <AnnouncementCard
                  key={announcement.id || index}
                  title={announcement.title}
                  message={announcement.message}
                  priority={announcement.priority}
                  sentBy={announcement.sentBy || 'Admin'}
                  date={announcement.createdAt || announcement.sentAt}
                  isRead={true}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );

  // Render Reports Tab
  const renderReports = () => (
    <>
      <div style={styles.header}>
        <h1 style={styles.greeting}>Reports & Analytics</h1>
        <p style={styles.subtitle}>View insights and statistics about campus operations.</p>
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
        <button
          style={{ ...styles.submitBtn, backgroundColor: '#F1F5F9', color: '#64748B' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '6px' }}>
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          Export Report
        </button>
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
          title="Most Requested" 
          value={requestsByFacility[0]?.label || 'N/A'} 
          icon="building" 
          color="#F59E0B" 
        />
        <StatCard title="Peak Day" value="Monday" icon="calendar" color="#8B5CF6" />
      </div>

      <div style={styles.chartsGrid}>
        <CSSBarChart
          title="Requests by Facility"
          data={requestsByFacility}
          horizontal={true}
        />
        <CSSPieChart
          title="Requests by Status"
          data={requestsByStatus}
          size={180}
        />
      </div>

      <div style={{ marginTop: '24px' }}>
        <CSSBarChart
          title="Requests per Day (Last 7 Days)"
          data={getLast7DaysData()}
          horizontal={false}
          maxHeight={250}
        />
      </div>

      <div style={{ ...styles.card, marginTop: '24px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>Recent Activity Log</h3>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>User</th>
              <th style={styles.th}>Action</th>
              <th style={styles.th}>Facility</th>
              <th style={styles.th}>Date</th>
              <th style={styles.th}>Status</th>
            </tr>
          </thead>
          <tbody>
            {activities.slice(0, 5).map((activity, index) => (
              <tr key={index}>
                <td style={styles.td}>{activity.user?.name || 'Unknown'}</td>
                <td style={styles.td}>{activity.action}</td>
                <td style={styles.td}>{activity.target}</td>
                <td style={{ ...styles.td, color: '#64748B' }}>
                  {new Date(activity.timestamp).toLocaleDateString()}
                </td>
                <td style={styles.td}>
                  <StatusBadge status={activity.action?.includes('approve') ? 'approved' : activity.action?.includes('reject') ? 'rejected' : 'pending'} size="sm" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );

  // Render Notifications Tab
  const renderNotifications = () => (
    <>
      <div style={styles.header}>
        <h1 style={styles.greeting}>Notifications</h1>
        <p style={styles.subtitle}>Send and manage notifications to users.</p>
      </div>

      <div style={styles.twoColGrid}>
        <div style={styles.card}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '20px' }}>Send Notification</h3>
          <form style={styles.form} onSubmit={handleSendNotification}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Title <span style={{ color: '#EF4444' }}>*</span></label>
              <input
                type="text"
                value={notificationTitle}
                onChange={(e) => setNotificationTitle(e.target.value)}
                placeholder="Notification title"
                style={styles.input}
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Message <span style={{ color: '#EF4444' }}>*</span></label>
              <textarea
                value={notificationMessage}
                onChange={(e) => setNotificationMessage(e.target.value)}
                placeholder="Write your notification message..."
                style={styles.textarea}
                required
                maxLength={500}
              />
              <span style={{ fontSize: '12px', color: '#94A3B8' }}>{notificationMessage.length}/500 characters</span>
            </div>
            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Target</label>
                <select
                  value={notificationTarget}
                  onChange={(e) => setNotificationTarget(e.target.value)}
                  style={styles.select}
                >
                  <option value="all">All Users</option>
                  <option value="ROLE_USER">Users Only</option>
                  <option value="ROLE_MODERATOR">Moderators Only</option>
                </select>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Type</label>
                <select
                  value={notificationType}
                  onChange={(e) => setNotificationType(e.target.value)}
                  style={styles.select}
                >
                  <option value="info">Info</option>
                  <option value="warning">Warning</option>
                  <option value="alert">Alert</option>
                </select>
              </div>
            </div>
            <button
              type="submit"
              style={{ ...styles.submitBtn, opacity: actionLoading ? 0.7 : 1 }}
              disabled={actionLoading}
            >
              {actionLoading ? 'Sending...' : 'Send Notification'}
            </button>
          </form>
        </div>

        <div style={styles.card}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '20px' }}>Sent Notifications</h3>
          {notifications.length === 0 ? (
            <EmptyState icon="bell" title="No notifications" message="No notifications have been sent yet." />
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Title</th>
                  <th style={styles.th}>Target</th>
                  <th style={styles.th}>Type</th>
                  <th style={styles.th}>Sent</th>
                </tr>
              </thead>
              <tbody>
                {notifications.slice(0, 10).map((notif, index) => (
                  <tr key={notif.id || index}>
                    <td style={styles.td}>{notif.title}</td>
                    <td style={{ ...styles.td, color: '#64748B' }}>{notif.target || 'All'}</td>
                    <td style={styles.td}>
                      <StatusBadge status={notif.type || 'info'} size="sm" />
                    </td>
                    <td style={{ ...styles.td, color: '#64748B' }}>
                      {new Date(notif.sentAt || notif.timestamp).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );

  // Render Settings Tab
  const renderSettings = () => (
    <>
      <div style={styles.header}>
        <h1 style={styles.greeting}>Settings</h1>
        <p style={styles.subtitle}>Configure system settings and preferences.</p>
      </div>

      <div style={styles.card}>
        <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '20px' }}>General Settings</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', backgroundColor: '#F8FAFC', borderRadius: '8px' }}>
            <div>
              <p style={{ fontWeight: '500' }}>Email Notifications</p>
              <p style={{ fontSize: '13px', color: '#64748B' }}>Receive email notifications for important events</p>
            </div>
            <label style={{ position: 'relative', display: 'inline-block', width: '48px', height: '24px' }}>
              <input type="checkbox" defaultChecked style={{ opacity: 0, width: 0, height: 0 }} />
              <span style={{ 
                position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0,
                backgroundColor: '#2563EB', borderRadius: '24px', transition: '0.3s',
              }}>
                <span style={{
                  position: 'absolute', content: '', height: '18px', width: '18px',
                  left: '26px', bottom: '3px', backgroundColor: 'white', borderRadius: '50%', transition: '0.3s',
                }}></span>
              </span>
            </label>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', backgroundColor: '#F8FAFC', borderRadius: '8px' }}>
            <div>
              <p style={{ fontWeight: '500' }}>Auto-approve Requests</p>
              <p style={{ fontSize: '13px', color: '#64748B' }}>Automatically approve requests from verified users</p>
            </div>
            <label style={{ position: 'relative', display: 'inline-block', width: '48px', height: '24px' }}>
              <input type="checkbox" style={{ opacity: 0, width: 0, height: 0 }} />
              <span style={{ 
                position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0,
                backgroundColor: '#E2E8F0', borderRadius: '24px', transition: '0.3s',
              }}>
                <span style={{
                  position: 'absolute', content: '', height: '18px', width: '18px',
                  left: '4px', bottom: '3px', backgroundColor: 'white', borderRadius: '50%', transition: '0.3s',
                }}></span>
              </span>
            </label>
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
      case 'facilities': return renderFacilities();
      case 'bookings': return renderBookings();
      case 'requests': return renderRequests();
      case 'users': return renderUsers();
      case 'announcements': return renderAnnouncements();
      case 'reports': return renderReports();
      case 'notifications': return renderNotifications();
      case 'settings': return renderSettings();
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
        onNavClick={setActiveTab}
        isOpen={sidebarOpen}
        onToggle={setSidebarOpen}
      />
      <main style={styles.main}>
        {renderContent()}
      </main>
    </div>
  );
};

export default AdminDashboard;
