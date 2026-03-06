import React from 'react';

const ConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = 'Confirm Action', 
  message = 'Are you sure you want to proceed?', 
  confirmLabel = 'Confirm', 
  confirmColor = '#EF4444',
  cancelLabel = 'Cancel',
  loading = false
}) => {
  if (!isOpen) return null;

  const styles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.6)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px',
      animation: 'fadeIn 0.2s ease',
    },
    modal: {
      backgroundColor: '#FFFFFF',
      borderRadius: '16px',
      width: '100%',
      maxWidth: '400px',
      padding: '24px',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)',
      animation: 'slideIn 0.3s ease',
    },
    iconContainer: {
      width: '56px',
      height: '56px',
      borderRadius: '50%',
      backgroundColor: confirmColor === '#EF4444' ? '#FEF2F2' : '#FEF3C7',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 20px',
    },
    title: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#0F172A',
      textAlign: 'center',
      marginBottom: '8px',
    },
    message: {
      fontSize: '14px',
      color: '#64748B',
      textAlign: 'center',
      marginBottom: '24px',
      lineHeight: '1.5',
    },
    buttonGroup: {
      display: 'flex',
      gap: '12px',
    },
    cancelBtn: {
      flex: 1,
      padding: '12px 20px',
      backgroundColor: '#F1F5F9',
      border: 'none',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '600',
      color: '#64748B',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    },
    confirmBtn: {
      flex: 1,
      padding: '12px 20px',
      backgroundColor: confirmColor,
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
      justifyContent: 'center',
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
    <div style={styles.overlay} onClick={(e) => e.target === e.currentTarget && !loading && onClose()}>
      <div style={styles.modal}>
        <div style={styles.iconContainer}>
          {confirmColor === '#EF4444' ? (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
          ) : (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          )}
        </div>
        <h2 style={styles.title}>{title}</h2>
        <p style={styles.message}>{message}</p>
        <div style={styles.buttonGroup}>
          <button
            style={styles.cancelBtn}
            onClick={onClose}
            disabled={loading}
            onMouseOver={(e) => {
              if (!loading) e.currentTarget.style.backgroundColor = '#E2E8F0';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#F1F5F9';
            }}
          >
            {cancelLabel}
          </button>
          <button
            style={styles.confirmBtn}
            onClick={onConfirm}
            disabled={loading}
            onMouseOver={(e) => {
              if (!loading) e.currentTarget.style.opacity = '0.9';
            }}
            onMouseOut={(e) => {
              if (!loading) e.currentTarget.style.opacity = '1';
            }}
          >
            {loading && <div style={styles.spinner}></div>}
            {confirmLabel}
          </button>
        </div>
      </div>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default ConfirmModal;
