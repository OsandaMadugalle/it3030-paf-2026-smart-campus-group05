import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
import BookingCard from '../components/bookings/BookingCard';
import AnnouncementCard from '../components/AnnouncementCard';
import StepIndicator from '../components/StepIndicator';
import Modal from '../components/Modal';
import ConfirmModal from '../components/ConfirmModal';
import EmptyState from '../components/EmptyState';
import LoadingSpinner, { SkeletonCard } from '../components/LoadingSpinner';
import { showToast } from '../components/Toast';
import FacilityCalendar from '../components/FacilityCalendar';
import BookingQRManager from '../components/BookingQRManager';
import IncidentManager from './IncidentManager';

const UserDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { getUserInfo } = useRole();
  const userInfo = getUserInfo();
  const isMobile = useIsMobile();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("home");
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
  const [myRequests, setMyRequests] = useState([]);
  const [announcements, setAnnouncements] = useState([]);

  // Stats
  const [stats, setStats] = useState({
    totalRequests: 0,
    pendingRequests: 0,
    approvedRequests: 0,
    rejectedRequests: 0,
  });

  // Wizard states (3-step form)
  const [wizardStep, setWizardStep] = useState(1);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [facilitySearch, setFacilitySearch] = useState("");
  const [requestForm, setRequestForm] = useState({
    purpose: "",
    designation: "",
    preferredDate: "",
    timeSlot: "",
    customStartTime: "",
    customEndTime: "",
    attendeeCount: "",
    additionalNotes: "",
  });
  const [showRequestForm, setShowRequestForm] = useState(false);

  // My Bookings states
  const [requestFilter, setRequestFilter] = useState("");
  const [requestToCancel, setRequestToCancel] = useState(null);

  // Loading states
  const [actionLoading, setActionLoading] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: 'home' },
    { id: 'calendar', label: 'Availability', icon: 'calendar' },
    { id: 'requests', label: 'Bookings', icon: 'file' },
    { id: 'qr', label: 'QR Codes', icon: 'qr' },
    { id: 'notifications-view', label: 'Notifications', icon: 'bell' },
    { id: 'incidents', label: 'Help Desk / Incidents', icon: 'hammer-wrench' },
    { id: 'profile', label: 'My Profile', icon: 'user' },
  ];

  const timeSlots = [
    "08:00 - 09:00",
    "09:00 - 10:00",
    "10:00 - 11:00",
    "11:00 - 12:00",
    "12:00 - 13:00",
    "13:00 - 14:00",
    "14:00 - 15:00",
    "15:00 - 16:00",
    "16:00 - 17:00",
    "17:00 - 18:00",
  ];

  const wizardSteps = [
    { id: 1, title: "Select Facility" },
    { id: 2, title: "Booking Details" },
    { id: 3, title: "Review & Submit" },
  ];

  // Fetch all data
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [facilitiesRes, requestsRes, announcementsRes] = await Promise.all([
        api.get("/facilities").catch(() => ({ data: [] })),
        api.get("/bookings/my").catch(() => ({ data: [] })),
        api.get("/announcements").catch(() => ({ data: [] })),
      ]);

      setFacilities(
        (facilitiesRes.data || []).filter(
          (f) => f.status?.toLowerCase() === "active",
        ),
      );
      setMyRequests(requestsRes.data || []);
      setAnnouncements(announcementsRes.data || []);

      // Calculate stats
      const requestsData = requestsRes.data || [];
      setStats({
        totalRequests: requestsData.length,
        pendingRequests: requestsData.filter(
          (r) => r.status?.toLowerCase() === "pending",
        ).length,
        approvedRequests: requestsData.filter(
          (r) => r.status?.toLowerCase() === "approved",
        ).length,
        rejectedRequests: requestsData.filter(
          (r) => r.status?.toLowerCase() === "rejected",
        ).length,
      });
    } catch (err) {
      console.error("Failed to fetch data:", err);
      showToast("Failed to load data", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();

    // Subscribe to personal booking updates
    if (userInfo?.id) {
      webSocketService.connect();
      const topic = `/user/${userInfo.id}/queue/bookings`;
      
      const subscription = webSocketService.subscribe(topic, (updatedBooking) => {
        // Refresh local data to show latest status
        fetchData();
        showToast(`Your booking for ${updatedBooking.resourceName} is now ${updatedBooking.status}`, 'info');
      });

      return () => {
        webSocketService.unsubscribe(topic);
      };
    }
  }, [fetchData, userInfo?.id]);

  // Memoized sorted requests (latest first)
  const sortedRequests = useMemo(() => {
    return [...myRequests].sort((a, b) => {
      // Sort by creation date or updated date if available, fallback to id
      const dateA = new Date(a.createdAt || a.id);
      const dateB = new Date(b.createdAt || b.id);
      return dateB - dateA;
    });
  }, [myRequests]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  // Wizard handlers
  const handleSelectFacility = (facility) => {
    setSelectedFacility(facility);
    setWizardStep(2);
  };

  const handleFormChange = (field, value) => {
    setRequestForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleNextStep = () => {
    if (wizardStep === 1 && !selectedFacility) {
      showToast("Please select a facility", "warning");
      return;
    }
    if (wizardStep === 2) {
      if (!requestForm.purpose.trim()) {
        showToast("Please enter a purpose", "warning");
        return;
      }
      if (!requestForm.designation) {
        showToast("Please select your designation", "warning");
        return;
      }
      if (!requestForm.preferredDate) {
        showToast("Please select a date", "warning");
        return;
      }
      if (!requestForm.timeSlot) {
        showToast("Please select a time slot", "warning");
        return;
      }
      if (requestForm.timeSlot === "custom") {
        if (!requestForm.customStartTime || !requestForm.customEndTime) {
          showToast(
            "Please specify both start and end times for custom slot",
            "warning",
          );
          return;
        }
        if (requestForm.customStartTime >= requestForm.customEndTime) {
          showToast("End time must be after start time", "warning");
          return;
        }
      }
    }
    setWizardStep((prev) => Math.min(3, prev + 1));
  };

  const handlePrevStep = () => {
    setWizardStep((prev) => Math.max(1, prev - 1));
  };

  const handleSubmitRequest = async () => {
    setActionLoading(true);
    try {
      // Parse the time slot
      let startTimeStr, endTimeStr;
      if (requestForm.timeSlot === "custom") {
        startTimeStr = requestForm.customStartTime;
        endTimeStr = requestForm.customEndTime;
      } else {
        [startTimeStr, endTimeStr] = requestForm.timeSlot.split(" - ");
      }

      await api.post("/bookings", {
        resourceId: selectedFacility.id,
        purpose: requestForm.purpose,
        designation: requestForm.designation,
        date: requestForm.preferredDate,
        startTime: startTimeStr,
        endTime: endTimeStr,
        expectedAttendees: requestForm.attendeeCount
          ? parseInt(requestForm.attendeeCount)
          : 1,
        notes: requestForm.additionalNotes,
      });
      showToast("Booking submitted successfully!", "success");
      // Reset wizard
      setWizardStep(1);
      setSelectedFacility(null);
      setRequestForm({
        purpose: "",
        designation: "",
        preferredDate: "",
        timeSlot: "",
        customStartTime: "",
        customEndTime: "",
        attendeeCount: "",
        additionalNotes: "",
      });
      setShowRequestForm(false);
      setActiveTab("requests");
      fetchData();
    } catch (err) {
      console.error("Submission error:", err);
      showToast(
        err.response?.data?.message || "Failed to submit booking",
        "error",
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleResetWizard = () => {
    setWizardStep(1);
    setSelectedFacility(null);
    setRequestForm({
      purpose: "",
      designation: "",
      preferredDate: "",
      timeSlot: "",
      customStartTime: "",
      customEndTime: "",
      attendeeCount: "",
      additionalNotes: "",
    });
  };

  const handleCalendarBookSlot = (facility, date, time) => {
    setSelectedFacility(facility);
    setRequestForm(prev => ({
      ...prev,
      preferredDate: date,
      timeSlot: time,
    }));
    setWizardStep(2);
    setShowRequestForm(true);
    setActiveTab('requests');
  };

  // Request handlers
  const handleCancelRequest = (request) => {
    setRequestToCancel(request);
  };

  const confirmCancelRequest = async () => {
    if (!requestToCancel) return;
    setActionLoading(true);
    try {
      await api.put(`/bookings/${requestToCancel.id}/cancel`, {
        reason: "Cancelled by user",
      });
      showToast("Booking cancelled successfully", "success");
      setRequestToCancel(null);
      fetchData();
    } catch (err) {
      console.error("Cancellation error:", err);
      showToast("Failed to cancel booking", "error");
    } finally {
      setActionLoading(false);
    }
  };

  // Filtered data
  const filteredRequests = sortedRequests.filter((r) => {
    return (
      !requestFilter || r.status?.toLowerCase() === requestFilter.toLowerCase()
    );
  });

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const handleRefresh = async () => {
    showToast("Refreshing data...", "info");
    await fetchData();
  };

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };

  const styles = {
    layout: {
      display: "flex",
      minHeight: "100vh",
      backgroundColor: "#F8FAFC",
      fontFamily: "'Inter', sans-serif",
    },
    main: {
      flex: 1,
      marginLeft: isMobile ? 0 : "240px",
      padding: isMobile ? "80px 16px 24px 16px" : "0px",
      maxWidth: isMobile ? "100%" : "calc(100% - 240px)",
      transition: "margin-left 0.3s ease, padding 0.3s ease",
      backgroundColor: '#F8FAFC',
      minHeight: '100vh',
    },
    contentArea: {
      padding: isMobile ? '0' : '32px',
    },
    header: {
      marginBottom: "32px",
    },
    greeting: {
      fontSize: isMobile ? "22px" : "28px",
      fontWeight: "700",
      color: "#0F172A",
      marginBottom: "8px",
    },
    subtitle: {
      fontSize: "14px",
      color: "#64748B",
    },
    statsGrid: {
      display: "grid",
      gridTemplateColumns: isMobile
        ? "repeat(2, 1fr)"
        : "repeat(auto-fit, minmax(140px, 1fr))",
      gap: isMobile ? "12px" : "16px",
      marginBottom: "32px",
    },
    section: {
      marginBottom: "32px",
    },
    sectionTitle: {
      fontSize: "18px",
      fontWeight: "600",
      color: "#0F172A",
      marginBottom: "16px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    },
    card: {
      backgroundColor: "#FFFFFF",
      borderRadius: "12px",
      border: "1px solid #E2E8F0",
      padding: "24px",
    },
    filterBar: {
      display: "flex",
      gap: "12px",
      marginBottom: "20px",
      flexWrap: "wrap",
    },
    select: {
      padding: "10px 14px",
      fontSize: "14px",
      border: "1px solid #E2E8F0",
      borderRadius: "8px",
      outline: "none",
      fontFamily: "'Inter', sans-serif",
      backgroundColor: "#FFFFFF",
      cursor: "pointer",
      minWidth: "150px",
    },
    facilitiesGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
      gap: "20px",
    },
    requestsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
      gap: "20px",
    },
    announcementsGrid: {
      display: "flex",
      flexDirection: "column",
      gap: "16px",
    },
    form: {
      display: "flex",
      flexDirection: "column",
      gap: "16px",
    },
    formRow: {
      display: "grid",
      gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
      gap: "16px",
    },
    formGroup: {
      display: "flex",
      flexDirection: "column",
      gap: "6px",
    },
    label: {
      fontSize: "14px",
      fontWeight: "500",
      color: "#0F172A",
    },
    input: {
      padding: "10px 14px",
      fontSize: "14px",
      border: "1px solid #E2E8F0",
      borderRadius: "8px",
      outline: "none",
      fontFamily: "'Inter', sans-serif",
    },
    textarea: {
      padding: "10px 14px",
      fontSize: "14px",
      border: "1px solid #E2E8F0",
      borderRadius: "8px",
      outline: "none",
      fontFamily: "'Inter', sans-serif",
      minHeight: "100px",
      resize: "vertical",
    },
    submitBtn: {
      padding: "12px 24px",
      backgroundColor: "#2563EB",
      border: "none",
      borderRadius: "8px",
      fontSize: "14px",
      fontWeight: "600",
      color: "#FFFFFF",
      cursor: "pointer",
      transition: "all 0.2s ease",
    },
    secondaryBtn: {
      padding: "12px 24px",
      backgroundColor: "#F1F5F9",
      border: "none",
      borderRadius: "8px",
      fontSize: "14px",
      fontWeight: "600",
      color: "#64748B",
      cursor: "pointer",
      transition: "all 0.2s ease",
    },
    wizardContainer: {
      maxWidth: "800px",
      margin: "0 auto",
    },
    wizardContent: {
      marginTop: "32px",
    },
    previewCard: {
      backgroundColor: "#F8FAFC",
      borderRadius: "12px",
      padding: "24px",
      border: "1px solid #E2E8F0",
    },
    previewRow: {
      display: "flex",
      justifyContent: "space-between",
      padding: "12px 0",
      borderBottom: "1px solid #E2E8F0",
    },
    previewLabel: {
      color: "#64748B",
      fontSize: "14px",
    },
    previewValue: {
      fontWeight: "500",
      color: "#0F172A",
      fontSize: "14px",
    },
    twoColGrid: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "24px",
    },
    profileCard: {
      backgroundColor: "#FFFFFF",
      borderRadius: "16px",
      border: "1px solid #E2E8F0",
      padding: "32px",
      textAlign: "center",
      maxWidth: "400px",
      margin: "0 auto",
    },
    profileAvatar: {
      width: "100px",
      height: "100px",
      borderRadius: "50%",
      objectFit: "cover",
      marginBottom: "16px",
      border: "4px solid #E2E8F0",
    },
    profileName: {
      fontSize: "24px",
      fontWeight: "700",
      color: "#0F172A",
      marginBottom: "4px",
    },
    profileEmail: {
      fontSize: "14px",
      color: "#64748B",
      marginBottom: "16px",
    },
    profileInfo: {
      display: "flex",
      flexDirection: "column",
      gap: "12px",
      marginTop: "24px",
      textAlign: "left",
    },
    profileInfoItem: {
      display: "flex",
      justifyContent: "space-between",
      padding: "12px 16px",
      backgroundColor: "#F8FAFC",
      borderRadius: "8px",
    },
    quickActionCard: {
      padding: "20px",
      backgroundColor: "#FFFFFF",
      border: "1px solid #E2E8F0",
      borderRadius: "12px",
      cursor: "pointer",
      transition: "all 0.2s ease",
    },
    emptyAction: {
      marginTop: "16px",
    },
  };

  // Render Home Tab
  const renderHome = () => (
    <>
      <div style={styles.header}>
        <h1 style={styles.greeting}>
          {getGreeting()}, {userInfo?.name?.split(" ")[0] || "User"}!
        </h1>
        <p style={styles.subtitle}>
          Welcome to Smart Campus. Here's your dashboard overview.
        </p>
      </div>

      <div style={styles.statsGrid}>
        <StatCard
          title="Total Bookings"
          value={stats.totalRequests}
          icon="file"
          color="#2563EB"
        />
        <StatCard
          title="Pending"
          value={stats.pendingRequests}
          icon="clock"
          color="#F59E0B"
        />
        <StatCard
          title="Approved"
          value={stats.approvedRequests}
          icon="check"
          color="#10B981"
        />
        <StatCard
          title="Rejected"
          value={stats.rejectedRequests}
          icon="x"
          color="#EF4444"
        />
      </div>

      <div style={styles.twoColGrid}>
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Recent Announcements</h3>
          {announcements.length === 0 ? (
            <div style={styles.card}>
              <EmptyState
                icon="bell"
                title="No announcements"
                message="There are no announcements at this time."
              />
            </div>
          ) : (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "12px" }}
            >
              {announcements.slice(0, 3).map((announcement, index) => (
                <AnnouncementCard
                  key={announcement.id || index}
                  title={announcement.title}
                  message={announcement.message}
                  priority={announcement.priority}
                  sentBy={announcement.sentBy || "Campus Admin"}
                  date={announcement.createdAt || announcement.sentAt}
                />
              ))}
              {announcements.length > 3 && (
                <button
                  onClick={() => setActiveTab("announcements")}
                  style={{ ...styles.secondaryBtn, alignSelf: "flex-start" }}
                >
                  View All Announcements →
                </button>
              )}
            </div>
          )}
        </div>

        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Quick Actions</h3>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            <div
              style={styles.quickActionCard}
              onClick={() => {
                setActiveTab("requests");
                setShowRequestForm(true);
                setWizardStep(1);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = "#2563EB";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = "#E2E8F0";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "12px" }}
              >
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "10px",
                    backgroundColor: "#DBEAFE",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#2563EB"
                    strokeWidth="2"
                  >
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                </div>
                <div>
                  <p style={{ fontWeight: "600", marginBottom: "2px" }}>
                    Submit Facility Booking
                  </p>
                  <p style={{ fontSize: "13px", color: "#64748B" }}>
                    Book a campus facility for your event
                  </p>
                </div>
              </div>
            </div>

            <div
              style={styles.quickActionCard}
              onClick={() => setActiveTab("requests")}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = "#2563EB";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = "#E2E8F0";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "12px" }}
              >
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "10px",
                    backgroundColor: "#D1FAE5",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="2"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                  </svg>
                </div>
                <div>
                  <p style={{ fontWeight: "600", marginBottom: "2px" }}>
                    View My Bookings
                  </p>
                  <p style={{ fontSize: "13px", color: "#64748B" }}>
                    Track status of your facility bookings
                  </p>
                </div>
              </div>
            </div>

            <div
              style={styles.quickActionCard}
              onClick={() => {
                setActiveTab("incidents"); // Make sure this matches your nav item ID
                setShowRequestForm(true); // Using your existing modal state name for consistency
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = "#2563EB";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = "#E2E8F0";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "12px" }}
              >
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "10px",
                    backgroundColor: "#FEE2E2",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#DC2626"
                    strokeWidth="2"
                  >
                    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
                  </svg>
                </div>
                <div>
                  <p style={{ fontWeight: "600", marginBottom: "2px" }}>
                    Raise Incident Ticket
                  </p>
                  <p style={{ fontSize: "13px", color: "#64748B" }}>
                    Report a facility fault or maintenance issue
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Bookings Summary */}
      {myRequests.length > 0 && (
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>
            Recent Bookings
            <button
              onClick={() => setActiveTab("requests")}
              style={{
                ...styles.secondaryBtn,
                padding: "8px 16px",
                fontSize: "13px",
              }}
            >
              View All
            </button>
          </h3>
          <div style={styles.requestsGrid}>
            {myRequests.slice(0, 3).map((request, index) => (
              <BookingCard
                key={request.id || index}
                request={request}
                onCancel={
                  request.status?.toUpperCase() === "PENDING" ||
                  request.status?.toUpperCase() === "APPROVED"
                    ? handleCancelRequest
                    : undefined
                }
              />
            ))}
          </div>
        </div>
      )}
    </>
  );

  // Render Submit Booking form
  const renderSubmitRequest = () => (
    <div style={styles.wizardContainer}>
      <StepIndicator steps={wizardSteps} currentStep={wizardStep} />

      <div style={styles.wizardContent}>
        {/* Step 1: Select Facility */}
        {wizardStep === 1 && (
          <>
            <h3
              style={{
                fontSize: "18px",
                fontWeight: "600",
                marginBottom: "20px",
              }}
            >
              Select a Facility
            </h3>

            <div style={{ marginBottom: "20px", position: "relative" }}>
              <input
                type="text"
                placeholder="Search facilities by name or location..."
                value={facilitySearch}
                onChange={(e) => setFacilitySearch(e.target.value)}
                style={{
                  ...styles.input,
                  paddingLeft: "40px",
                  borderRadius: "10px",
                }}
              />
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#64748B"
                strokeWidth="2"
                style={{
                  position: "absolute",
                  left: "14px",
                  top: "50%",
                  transform: "translateY(-50%)",
                }}
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>

            {facilities.filter(f => 
              f.name?.toLowerCase().includes(facilitySearch.toLowerCase()) || 
              f.location?.toLowerCase().includes(facilitySearch.toLowerCase())
            ).length === 0 ? (
              <EmptyState
                icon="building"
                title={facilitySearch ? "No matching facilities" : "No facilities available"}
                message={facilitySearch ? `No facilities found matching "${facilitySearch}"` : "There are no active facilities available for booking at this time."}
              />
            ) : (
              <div style={styles.facilitiesGrid}>
                {facilities
                  .filter(f => 
                    f.name?.toLowerCase().includes(facilitySearch.toLowerCase()) || 
                    f.location?.toLowerCase().includes(facilitySearch.toLowerCase())
                  )
                  .map((facility) => (
                    <FacilityCard
                      key={facility.id}
                      facility={facility}
                      selectable
                      selected={selectedFacility?.id === facility.id}
                      onSelect={handleSelectFacility}
                      showActions={false}
                    />
                  ))
                }
              </div>
            )}
          </>
        )}

        {/* Step 2: Booking Details */}
        {wizardStep === 2 && (
          <>
            <h3
              style={{
                fontSize: "18px",
                fontWeight: "600",
                marginBottom: "20px",
              }}
            >
              Booking Details
            </h3>
            <div style={styles.card}>
              <div
                style={{
                  marginBottom: "20px",
                  padding: "12px",
                  backgroundColor: "#F8FAFC",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "8px",
                    backgroundColor: "#DBEAFE",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#2563EB"
                    strokeWidth="2"
                  >
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                  </svg>
                </div>
                <div>
                  <p style={{ fontWeight: "600" }}>{selectedFacility?.name}</p>
                  <p style={{ fontSize: "13px", color: "#64748B" }}>
                    {selectedFacility?.location || selectedFacility?.type}
                  </p>
                </div>
              </div>

              <form style={styles.form}>
                <div style={styles.formRow}>
                  <div style={{ ...styles.formGroup, flex: 2 }}>
                    <label style={styles.label}>
                      Purpose <span style={{ color: "#EF4444" }}>*</span>
                    </label>
                    <input
                      type="text"
                      value={requestForm.purpose}
                      onChange={(e) =>
                        handleFormChange("purpose", e.target.value)
                      }
                      placeholder="e.g., Team meeting, Workshop, Club event"
                      style={styles.input}
                      required
                    />
                  </div>

                  <div style={{ ...styles.formGroup, flex: 1 }}>
                    <label style={styles.label}>
                      Designation <span style={{ color: "#EF4444" }}>*</span>
                    </label>
                    <select
                      value={requestForm.designation}
                      onChange={(e) =>
                        handleFormChange("designation", e.target.value)
                      }
                      style={styles.select}
                      required
                    >
                      <option value="">Select your designation</option>
                      <option value="student">Student</option>
                      <option value="batch_rep">Batch Representative</option>
                      <option value="lecturer">Lecturer / Faculty</option>
                      <option value="staff">Staff Member</option>
                      <option value="club_pres">Club President</option>
                      <option value="admin">Administrator</option>
                      <option value="moderator">Moderator</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div style={styles.formRow}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>
                      Preferred Date <span style={{ color: "#EF4444" }}>*</span>
                    </label>
                    <input
                      type="date"
                      value={requestForm.preferredDate}
                      onChange={(e) =>
                        handleFormChange("preferredDate", e.target.value)
                      }
                      min={getMinDate()}
                      style={styles.input}
                      required
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>
                      Time Slot <span style={{ color: "#EF4444" }}>*</span>
                    </label>
                    <select
                      value={requestForm.timeSlot}
                      onChange={(e) =>
                        handleFormChange("timeSlot", e.target.value)
                      }
                      style={styles.select}
                      required
                    >
                      <option value="">Select time slot</option>
                      {timeSlots.map((slot) => (
                        <option key={slot} value={slot}>
                          {slot}
                        </option>
                      ))}
                      <option value="custom">Custom Time Slot</option>
                    </select>
                  </div>
                </div>

                {requestForm.timeSlot === "custom" && (
                  <div style={{ ...styles.formGroup, backgroundColor: '#F8FAFC', padding: '16px', borderRadius: '8px', marginBottom: '20px' }}>
                    <label style={{ ...styles.label, marginBottom: '12px', display: 'block', fontWeight: '600', color: '#1E293B' }}>
                      Custom Time Window
                    </label>
                    <div
                      style={{
                        display: "flex",
                        gap: "20px",
                        alignItems: "center",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          flex: 1,
                        }}
                      >
                        <label
                          style={{
                            fontSize: "12px",
                            color: "#64748B",
                            marginBottom: "6px",
                          }}
                        >
                          Start Time
                        </label>
                        <input
                          type="time"
                          value={requestForm.customStartTime}
                          onChange={(e) =>
                            handleFormChange(
                              "customStartTime",
                              e.target.value,
                            )
                          }
                          style={styles.input}
                          required={requestForm.timeSlot === "custom"}
                        />
                      </div>
                      <div
                        style={{
                          marginTop: "20px",
                          color: "#94A3B8",
                          fontWeight: '600'
                        }}
                      >
                        TO
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          flex: 1,
                        }}
                      >
                        <label
                          style={{
                            fontSize: "12px",
                            color: "#64748B",
                            marginBottom: "6px",
                          }}
                        >
                          End Time
                        </label>
                        <input
                          type="time"
                          value={requestForm.customEndTime}
                          onChange={(e) =>
                            handleFormChange("customEndTime", e.target.value)
                          }
                          style={styles.input}
                          required={requestForm.timeSlot === "custom"}
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div style={styles.formRow}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Expected Attendees</label>
                    <input
                      type="number"
                      value={requestForm.attendeeCount}
                      onChange={(e) =>
                        handleFormChange("attendeeCount", e.target.value)
                      }
                      placeholder="e.g., 50"
                      style={styles.input}
                      min="1"
                    />
                  </div>
                  <div style={{ flex: 1 }}></div> {/* Spacer for alignment */}
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Additional Notes</label>
                  <textarea
                    value={requestForm.additionalNotes}
                    onChange={(e) =>
                      handleFormChange("additionalNotes", e.target.value)
                    }
                    placeholder="Any special requirements or notes..."
                    style={styles.textarea}
                  />
                </div>
              </form>
            </div>
          </>
        )}

        {/* Step 3: Review & Submit */}
        {wizardStep === 3 && (
          <>
            <h3
              style={{
                fontSize: "18px",
                fontWeight: "600",
                marginBottom: "20px",
              }}
            >
              Review & Confirm
            </h3>
            <div style={styles.previewCard}>
              <h4
                style={{
                  fontSize: "16px",
                  fontWeight: "600",
                  marginBottom: "16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#2563EB"
                  strokeWidth="2"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                </svg>
                Booking Summary
              </h4>

              <div style={styles.previewRow}>
                <span style={styles.previewLabel}>Facility</span>
                <span style={styles.previewValue}>
                  {selectedFacility?.name}
                </span>
              </div>
              <div style={styles.previewRow}>
                <span style={styles.previewLabel}>Location</span>
                <span style={styles.previewValue}>
                  {selectedFacility?.location || "-"}
                </span>
              </div>
              <div style={styles.previewRow}>
                <span style={styles.previewLabel}>Purpose</span>
                <span style={styles.previewValue}>{requestForm.purpose}</span>
              </div>
              <div style={styles.previewRow}>
                <span style={styles.previewLabel}>Designation</span>
                <span style={styles.previewValue}>
                  {requestForm.designation === "batch_rep"
                    ? "Batch Representative"
                    : requestForm.designation === "lecturer"
                      ? "Lecturer"
                      : requestForm.designation === "other"
                        ? "Other"
                        : "-"}
                </span>
              </div>
              <div style={styles.previewRow}>
                <span style={styles.previewLabel}>Date</span>
                <span style={styles.previewValue}>
                  {requestForm.preferredDate
                    ? new Date(requestForm.preferredDate).toLocaleDateString(
                        "en-US",
                        {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        },
                      )
                    : "-"}
                </span>
              </div>
              <div style={styles.previewRow}>
                <span style={styles.previewLabel}>Time Slot</span>
                <span style={styles.previewValue}>
                  {requestForm.timeSlot === "custom"
                    ? `${requestForm.customStartTime} - ${requestForm.customEndTime}`
                    : requestForm.timeSlot}
                </span>
              </div>
              {requestForm.attendeeCount && (
                <div style={styles.previewRow}>
                  <span style={styles.previewLabel}>Expected Attendees</span>
                  <span style={styles.previewValue}>
                    {requestForm.attendeeCount}
                  </span>
                </div>
              )}
              {requestForm.additionalNotes && (
                <div
                  style={{
                    ...styles.previewRow,
                    borderBottom: "none",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  <span style={styles.previewLabel}>Additional Notes</span>
                  <span style={{ ...styles.previewValue, fontWeight: "400" }}>
                    {requestForm.additionalNotes}
                  </span>
                </div>
              )}
            </div>

            <div
              style={{
                marginTop: "16px",
                padding: "12px 16px",
                backgroundColor: "#FEF3C7",
                borderRadius: "8px",
                display: "flex",
                alignItems: "flex-start",
                gap: "10px",
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#B45309"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <p style={{ fontSize: "13px", color: "#92400E" }}>
                Your request will be reviewed by a moderator. You'll receive a
                notification once it's approved or rejected.
              </p>
            </div>
          </>
        )}

        {/* Navigation Buttons */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "32px",
          }}
        >
          <div>
            {wizardStep > 1 && (
              <button onClick={handlePrevStep} style={styles.secondaryBtn}>
                ← Back
              </button>
            )}
          </div>
          <div style={{ display: "flex", gap: "12px" }}>
            <button onClick={handleResetWizard} style={styles.secondaryBtn}>
              Reset
            </button>
            {wizardStep < 3 ? (
              <button
                onClick={handleNextStep}
                style={styles.submitBtn}
                disabled={wizardStep === 1 && !selectedFacility}
              >
                Next →
              </button>
            ) : (
              <button
                onClick={handleSubmitRequest}
                style={{ ...styles.submitBtn, backgroundColor: "#10B981" }}
                disabled={actionLoading}
              >
                {actionLoading ? "Submitting..." : "Submit Booking"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // Render My Bookings Tab
  const renderMyRequests = () => (
    <>
      <Modal
        isOpen={showRequestForm}
        onClose={() => setShowRequestForm(false)}
        title="Submit Facility Booking"
        size="xl"
      >
        {renderSubmitRequest()}
      </Modal>

      <div>
        <div style={styles.header}>
          <h1 style={styles.greeting}>My Bookings</h1>
          <p style={styles.subtitle}>
            View and manage your facility bookings in one place.
          </p>
        </div>

        <div style={styles.statsGrid}>
          <StatCard
            title="Total"
            value={stats.totalRequests}
            icon="file"
            color="#2563EB"
          />
          <StatCard
            title="Pending"
            value={stats.pendingRequests}
            icon="clock"
            color="#F59E0B"
          />
          <StatCard
            title="Approved"
            value={stats.approvedRequests}
            icon="check"
            color="#10B981"
          />
          <StatCard
            title="Rejected"
            value={stats.rejectedRequests}
            icon="x"
            color="#EF4444"
          />
        </div>

        <div style={styles.filterBar}>
          <select
            value={requestFilter}
            onChange={(e) => setRequestFilter(e.target.value)}
            style={styles.select}
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <button
            onClick={() => {
              setShowRequestForm(true);
              setWizardStep(1);
            }}
            style={{ ...styles.submitBtn, padding: "10px 18px" }}
          >
            + New Booking
          </button>
        </div>

        {filteredRequests.length === 0 ? (
          <EmptyState
            icon="file"
            title="No bookings found"
            message="You have no bookings matching the selected filter."
          />
        ) : (
          <div style={styles.requestsGrid}>
            {filteredRequests.map((request, index) => (
              <BookingCard
                key={request.id || index}
                request={request}
                onCancel={
                  request.status?.toUpperCase() === "PENDING" ||
                  request.status?.toUpperCase() === "APPROVED"
                    ? handleCancelRequest
                    : undefined
                }
              />
            ))}
          </div>
        )}

        <ConfirmModal
          isOpen={!!requestToCancel}
          onClose={() => setRequestToCancel(null)}
          onConfirm={confirmCancelRequest}
          title="Cancel Booking"
          message={`Are you sure you want to cancel your booking for "${requestToCancel?.facility?.name || "this facility"}"?`}
          confirmLabel="Cancel Booking"
          confirmColor="#EF4444"
          loading={actionLoading}
        />
      </div>
    </>
  );

  // Render Announcements Tab
  const renderAnnouncements = () => (
    <>
      <div style={styles.header}>
        <h1 style={styles.greeting}>Announcements</h1>
        <p style={styles.subtitle}>
          Stay updated with the latest campus announcements.
        </p>
      </div>

      {announcements.length === 0 ? (
        <EmptyState
          icon="bell"
          title="No announcements"
          message="There are no announcements to display at this time."
        />
      ) : (
        <div style={styles.announcementsGrid}>
          {announcements.map((announcement, index) => (
            <AnnouncementCard
              key={announcement.id || index}
              title={announcement.title}
              message={announcement.message}
              priority={announcement.priority}
              sentBy={announcement.sentBy || "Campus Admin"}
              date={announcement.createdAt || announcement.sentAt}
            />
          ))}
        </div>
      )}
    </>
  );

  // Render Profile Tab
  const renderProfile = () => (
    <>
      <div style={styles.header}>
        <h1 style={styles.greeting}>My Profile</h1>
        <p style={styles.subtitle}>View your account information.</p>
      </div>

      <div style={styles.profileCard}>
        <img
          src={
            userInfo?.avatarUrl ||
            userInfo?.picture ||
            `https://ui-avatars.com/api/?name=${userInfo?.name}&background=2563EB&color=fff&size=200`
          }
          alt={userInfo?.name}
          style={styles.profileAvatar}
          onError={(e) => {
            e.target.src = `https://ui-avatars.com/api/?name=${userInfo?.name}&background=2563EB&color=fff&size=200`;
          }}
        />
        <h2 style={styles.profileName}>{userInfo?.name || "User"}</h2>
        <p style={styles.profileEmail}>{userInfo?.email || "-"}</p>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "8px",
            marginBottom: "8px",
          }}
        >
          {userInfo?.roles?.map((role) => (
            <StatusBadge key={role} status={role} />
          ))}
        </div>

        <div style={styles.profileInfo}>
          <div style={styles.profileInfoItem}>
            <span style={{ color: "#64748B", fontSize: "14px" }}>
              Signed in with
            </span>
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontWeight: "500",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google
            </span>
          </div>
          <div style={styles.profileInfoItem}>
            <span style={{ color: "#64748B", fontSize: "14px" }}>
              Total Bookings
            </span>
            <span style={{ fontWeight: "600" }}>{stats.totalRequests}</span>
          </div>
          <div style={styles.profileInfoItem}>
            <span style={{ color: "#64748B", fontSize: "14px" }}>
              Approved Bookings
            </span>
            <span style={{ fontWeight: "600", color: "#10B981" }}>
              {stats.approvedRequests}
            </span>
          </div>
          <div style={styles.profileInfoItem}>
            <span style={{ color: "#64748B", fontSize: "14px" }}>
              Account Status
            </span>
            <StatusBadge status="active" />
          </div>
        </div>

        <button
          onClick={handleLogout}
          style={{
            marginTop: "24px",
            padding: "12px 32px",
            backgroundColor: "#FEF2F2",
            border: "1px solid #FEE2E2",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: "600",
            color: "#DC2626",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            margin: "24px auto 0",
          }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
          Sign Out
        </button>
      </div>
    </>
  );

  const renderCalendar = () => (
    <>
      <div style={styles.header}>
        <h1 style={styles.greeting}>Facility Availability</h1>
        <p style={styles.subtitle}>See what's free and book instantly by clicking a slot.</p>
      </div>
      <FacilityCalendar onBookSlot={handleCalendarBookSlot} />
    </>
  );

  const renderQRCodes = () => (
    <>
      <div style={styles.header}>
        <h1 style={styles.greeting}>My QR Codes</h1>
        <p style={styles.subtitle}>Show your QR code at the facility for check-in verification.</p>
      </div>
      <BookingQRManager />
    </>
  );

  const renderContent = () => {
    if (loading && activeTab === "home") {
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {[1, 2, 3, 4].map((i) => (
            <SkeletonCard key={i} height="100px" />
          ))}
        </div>
      );
    }

    switch (activeTab) {
      case 'home': return renderHome();
      case 'requests': return renderMyRequests();
      case 'announcements': return renderAnnouncements();
      case 'profile': return renderProfile();
      case 'calendar': return renderCalendar();
      case 'qr': return renderQRCodes();
      case 'incidents' : return <IncidentManager/>;
      default: return renderHome();
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
            title={navItems.find(item => item.id === activeTab)?.label || 'User Dashboard'} 
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

export default UserDashboard;
