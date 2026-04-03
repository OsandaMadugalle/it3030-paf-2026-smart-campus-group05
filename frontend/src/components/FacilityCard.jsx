import React from "react";
import StatusBadge from "./StatusBadge";

const FacilityCard = ({
  facility,
  onEdit,
  onDelete,
  onBook,
  selectable = false,
  selected = false,
  onSelect,
  showActions = true,
}) => {
  const styles = {
    card: {
      backgroundColor: "#FFFFFF",
      borderRadius: "12px",
      border: selected ? "2px solid #2563EB" : "1px solid #E2E8F0",
      overflow: "hidden",
      transition: "all 0.2s ease",
      cursor: selectable ? "pointer" : "default",
      boxShadow: selected
        ? "0 4px 12px rgba(37, 99, 235, 0.15)"
        : "0 1px 3px rgba(0,0,0,0.1)",
    },
    imageContainer: {
      height: "140px",
      backgroundColor: "#F1F5F9",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
    },
    image: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
    },
    imagePlaceholder: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "8px",
      color: "#94A3B8",
    },
    statusOverlay: {
      position: "absolute",
      top: "12px",
      right: "12px",
    },
    content: {
      padding: "16px",
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: "12px",
    },
    name: {
      fontSize: "16px",
      fontWeight: "600",
      color: "#0F172A",
      marginBottom: "4px",
    },
    typeBadge: {
      marginLeft: "8px",
    },
    info: {
      display: "flex",
      flexDirection: "column",
      gap: "8px",
      fontSize: "13px",
      color: "#64748B",
    },
    infoRow: {
      display: "flex",
      alignItems: "center",
      gap: "6px",
    },
    actions: {
      display: "flex",
      gap: "8px",
      marginTop: "16px",
      paddingTop: "16px",
      borderTop: "1px solid #E2E8F0",
    },
    editBtn: {
      flex: 1,
      padding: "8px 16px",
      backgroundColor: "#F1F5F9",
      border: "none",
      borderRadius: "6px",
      fontSize: "13px",
      fontWeight: "500",
      color: "#0F172A",
      cursor: "pointer",
      transition: "all 0.2s ease",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "6px",
    },
    deleteBtn: {
      padding: "8px 12px",
      backgroundColor: "#FEF2F2",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      transition: "all 0.2s ease",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    selectedCheck: {
      position: "absolute",
      top: "12px",
      left: "12px",
      width: "28px",
      height: "28px",
      borderRadius: "50%",
      backgroundColor: "#2563EB",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#FFFFFF",
    },
  };

  const handleClick = () => {
    if (selectable && onSelect) {
      onSelect(facility);
    }
  };

  const getTypeIcon = (type) => {
    const icons = {
      hall: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
        </svg>
      ),
      lab: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M9 3h6v11l4 4H5l4-4V3z"></path>
          <line x1="9" y1="3" x2="15" y2="3"></line>
        </svg>
      ),
      sports: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
        </svg>
      ),
      library: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
        </svg>
      ),
      cafeteria: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
          <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
          <line x1="6" y1="1" x2="6" y2="4"></line>
          <line x1="10" y1="1" x2="10" y2="4"></line>
          <line x1="14" y1="1" x2="14" y2="4"></line>
        </svg>
      ),
      default: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
        </svg>
      ),
    };
    return icons[type?.toLowerCase()] || icons.default;
  };

  return (
    <div
      style={styles.card}
      onClick={handleClick}
      onMouseOver={(e) => {
        if (!selectable) return;
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = "0 8px 16px rgba(0,0,0,0.12)";
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = selected
          ? "0 4px 12px rgba(37, 99, 235, 0.15)"
          : "0 1px 3px rgba(0,0,0,0.1)";
      }}
    >
      <div style={styles.imageContainer}>
        {facility.imageUrl ? (
          <img
            src={facility.imageUrl}
            alt={facility.name}
            style={styles.image}
          />
        ) : (
          <div style={styles.imagePlaceholder}>
            {getTypeIcon(facility.type)}
            <span style={{ fontSize: "12px" }}>No image</span>
          </div>
        )}
        <div style={styles.statusOverlay}>
          <StatusBadge status={facility.status || "active"} />
        </div>
        {selected && (
          <div style={styles.selectedCheck}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
        )}
      </div>
      <div style={styles.content}>
        <div style={styles.header}>
          <div>
            <h3 style={styles.name}>{facility.name}</h3>
            <StatusBadge status={facility.type || "hall"} size="sm" />
          </div>
        </div>
        <div style={styles.info}>
          <div style={styles.infoRow}>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <span>{facility.location || "No location"}</span>
          </div>
          <div style={styles.infoRow}>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            <span>Capacity: {facility.capacity || 0}</span>
          </div>
        </div>
        {showActions && (onEdit || onDelete || onBook) && (
          <div style={styles.actions}>
            {onBook && (
              <button
                style={{
                  flex: 1,
                  padding: "8px 16px",
                  backgroundColor: "#2563EB",
                  border: "none",
                  borderRadius: "6px",
                  fontSize: "13px",
                  fontWeight: "500",
                  color: "#FFFFFF",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  onBook(facility);
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.backgroundColor = "#1D4ED8")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.backgroundColor = "#2563EB")
                }
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                Book
              </button>
            )}
            {onEdit && (
              <button
                style={styles.editBtn}
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(facility);
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.backgroundColor = "#E2E8F0")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.backgroundColor = "#F1F5F9")
                }
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
                Edit
              </button>
            )}
            {onDelete && (
              <button
                style={styles.deleteBtn}
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(facility);
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.backgroundColor = "#FEE2E2")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.backgroundColor = "#FEF2F2")
                }
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#EF4444"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FacilityCard;
