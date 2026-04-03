import React, { useState, useEffect } from "react";
import Modal from "./Modal";

const FacilityForm = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  loading = false,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    type: "hall",
    location: "",
    capacity: "",
    description: "",
    status: "active",
    imageUrl: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        type: initialData.type || "hall",
        location: initialData.location || "",
        capacity: initialData.capacity || "",
        description: initialData.description || "",
        status: initialData.status || "active",
        imageUrl: initialData.imageUrl || "",
      });
    } else {
      setFormData({
        name: "",
        type: "hall",
        location: "",
        capacity: "",
        description: "",
        status: "active",
        imageUrl: "",
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  const facilityTypes = [
    { value: "hall", label: "Hall" },
    { value: "lab", label: "Laboratory" },
    { value: "sports", label: "Sports Facility" },
    { value: "library", label: "Library" },
    { value: "cafeteria", label: "Cafeteria" },
    { value: "parking", label: "Parking" },
    { value: "dormitory", label: "Dormitory" },
  ];

  const statusOptions = [
    { value: "active", label: "Active" },
    { value: "maintenance", label: "Under Maintenance" },
    { value: "closed", label: "Closed" },
  ];

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.location.trim()) newErrors.location = "Location is required";
    if (!formData.capacity || formData.capacity <= 0)
      newErrors.capacity = "Valid capacity is required";
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
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const styles = {
    form: {
      display: "flex",
      flexDirection: "column",
      gap: "20px",
    },
    row: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
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
    required: {
      color: "#EF4444",
    },
    input: (hasError) => ({
      padding: "10px 14px",
      fontSize: "14px",
      border: `1px solid ${hasError ? "#EF4444" : "#E2E8F0"}`,
      borderRadius: "8px",
      outline: "none",
      transition: "all 0.2s ease",
      fontFamily: "'Inter', sans-serif",
    }),
    select: (hasError) => ({
      padding: "10px 14px",
      fontSize: "14px",
      border: `1px solid ${hasError ? "#EF4444" : "#E2E8F0"}`,
      borderRadius: "8px",
      outline: "none",
      transition: "all 0.2s ease",
      fontFamily: "'Inter', sans-serif",
      backgroundColor: "#FFFFFF",
      cursor: "pointer",
    }),
    textarea: (hasError) => ({
      padding: "10px 14px",
      fontSize: "14px",
      border: `1px solid ${hasError ? "#EF4444" : "#E2E8F0"}`,
      borderRadius: "8px",
      outline: "none",
      transition: "all 0.2s ease",
      fontFamily: "'Inter', sans-serif",
      minHeight: "80px",
      resize: "vertical",
    }),
    error: {
      fontSize: "12px",
      color: "#EF4444",
      marginTop: "4px",
    },
    buttonGroup: {
      display: "flex",
      gap: "12px",
      justifyContent: "flex-end",
      marginTop: "8px",
    },
    cancelBtn: {
      padding: "10px 20px",
      backgroundColor: "#F1F5F9",
      border: "none",
      borderRadius: "8px",
      fontSize: "14px",
      fontWeight: "500",
      color: "#64748B",
      cursor: "pointer",
      transition: "all 0.2s ease",
    },
    submitBtn: {
      padding: "10px 24px",
      backgroundColor: "#2563EB",
      border: "none",
      borderRadius: "8px",
      fontSize: "14px",
      fontWeight: "600",
      color: "#FFFFFF",
      cursor: loading ? "not-allowed" : "pointer",
      transition: "all 0.2s ease",
      opacity: loading ? 0.7 : 1,
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    spinner: {
      width: "16px",
      height: "16px",
      border: "2px solid rgba(255,255,255,0.3)",
      borderTop: "2px solid #FFFFFF",
      borderRadius: "50%",
      animation: "spin 0.8s linear infinite",
    },
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? "Edit Facility" : "Add New Facility"}
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
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="Enter facility name"
            style={styles.input(errors.name)}
            onFocus={(e) => (e.currentTarget.style.borderColor = "#2563EB")}
            onBlur={(e) =>
              (e.currentTarget.style.borderColor = errors.name
                ? "#EF4444"
                : "#E2E8F0")
            }
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
              onChange={(e) => handleChange("type", e.target.value)}
              style={styles.select(false)}
            >
              {facilityTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>
              Status <span style={styles.required}>*</span>
            </label>
            <select
              value={formData.status}
              onChange={(e) => handleChange("status", e.target.value)}
              style={styles.select(false)}
            >
              {statusOptions.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
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
              onChange={(e) => handleChange("location", e.target.value)}
              placeholder="Building A, Floor 2"
              style={styles.input(errors.location)}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#2563EB")}
              onBlur={(e) =>
                (e.currentTarget.style.borderColor = errors.location
                  ? "#EF4444"
                  : "#E2E8F0")
              }
            />
            {errors.location && (
              <span style={styles.error}>{errors.location}</span>
            )}
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>
              Capacity <span style={styles.required}>*</span>
            </label>
            <input
              type="number"
              value={formData.capacity}
              onChange={(e) => handleChange("capacity", e.target.value)}
              placeholder="50"
              min="1"
              style={styles.input(errors.capacity)}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#2563EB")}
              onBlur={(e) =>
                (e.currentTarget.style.borderColor = errors.capacity
                  ? "#EF4444"
                  : "#E2E8F0")
              }
            />
            {errors.capacity && (
              <span style={styles.error}>{errors.capacity}</span>
            )}
          </div>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="Enter facility description (optional)"
            style={styles.textarea(false)}
            onFocus={(e) => (e.currentTarget.style.borderColor = "#2563EB")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "#E2E8F0")}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Facility Image (optional)</label>

          <input
            type="file"
            id="facilityImageInput"
            accept="image/jpeg,image/png,image/webp"
            style={{ display: "none" }}
            onChange={(e) => {
              const file = e.target.files[0];
              if (!file) return;
              if (file.size > 2 * 1024 * 1024) {
                alert("Image must be smaller than 2MB");
                e.target.value = "";
                return;
              }
              const reader = new FileReader();
              reader.onloadend = () => {
                handleChange("imageUrl", reader.result);
              };
              reader.readAsDataURL(file);
            }}
          />

          {!formData.imageUrl ? (
            <div
              onClick={() =>
                document.getElementById("facilityImageInput").click()
              }
              style={{
                border: "2px dashed #E2E8F0",
                borderRadius: "8px",
                padding: "32px 16px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "8px",
                cursor: "pointer",
                transition: "all 0.2s ease",
                backgroundColor: "#F8FAFC",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = "#2563EB";
                e.currentTarget.style.backgroundColor = "#EFF6FF";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = "#E2E8F0";
                e.currentTarget.style.backgroundColor = "#F8FAFC";
              }}
            >
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#94A3B8"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21 15 16 10 5 21"></polyline>
              </svg>
              <p
                style={{
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#64748B",
                  margin: 0,
                }}
              >
                Click to upload image
              </p>
              <p style={{ fontSize: "12px", color: "#94A3B8", margin: 0 }}>
                JPG, PNG, WEBP — max 2MB
              </p>
            </div>
          ) : (
            <div
              style={{
                position: "relative",
                borderRadius: "8px",
                overflow: "hidden",
                border: "1px solid #E2E8F0",
              }}
            >
              <img
                src={formData.imageUrl}
                alt="Facility preview"
                style={{
                  width: "100%",
                  height: "180px",
                  objectFit: "cover",
                  display: "block",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: "12px",
                  background: "linear-gradient(transparent, rgba(0,0,0,0.6))",
                  display: "flex",
                  gap: "8px",
                  justifyContent: "flex-end",
                }}
              >
                <button
                  type="button"
                  onClick={() =>
                    document.getElementById("facilityImageInput").click()
                  }
                  style={{
                    padding: "6px 12px",
                    backgroundColor: "rgba(255,255,255,0.9)",
                    border: "none",
                    borderRadius: "6px",
                    fontSize: "12px",
                    fontWeight: "500",
                    color: "#0F172A",
                    cursor: "pointer",
                  }}
                >
                  Change
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleChange("imageUrl", "");
                    document.getElementById("facilityImageInput").value = "";
                  }}
                  style={{
                    padding: "6px 12px",
                    backgroundColor: "rgba(239,68,68,0.9)",
                    border: "none",
                    borderRadius: "6px",
                    fontSize: "12px",
                    fontWeight: "500",
                    color: "#FFFFFF",
                    cursor: "pointer",
                  }}
                >
                  Remove
                </button>
              </div>
            </div>
          )}
        </div>

        <div style={styles.buttonGroup}>
          <button
            type="button"
            style={styles.cancelBtn}
            onClick={onClose}
            disabled={loading}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = "#E2E8F0")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = "#F1F5F9")
            }
          >
            Cancel
          </button>
          <button
            type="submit"
            style={styles.submitBtn}
            disabled={loading}
            onMouseOver={(e) =>
              !loading && (e.currentTarget.style.backgroundColor = "#1D4ED8")
            }
            onMouseOut={(e) =>
              !loading && (e.currentTarget.style.backgroundColor = "#2563EB")
            }
          >
            {loading && <div style={styles.spinner}></div>}
            {initialData ? "Update Facility" : "Add Facility"}
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
