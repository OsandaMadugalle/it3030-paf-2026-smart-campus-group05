import React, { useEffect, useState } from 'react';

// Toast container singleton
let toastContainer = null;
let toastId = 0;

export const showToast = (message, type = 'success', duration = 3000) => {
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 10px;
    `;
    document.body.appendChild(toastContainer);
  }

  const id = ++toastId;
  const toast = document.createElement('div');
  toast.id = `toast-${id}`;
  
  const colors = {
    success: { bg: '#10B981', icon: '✓' },
    error: { bg: '#EF4444', icon: '✕' },
    warning: { bg: '#F59E0B', icon: '!' },
    info: { bg: '#2563EB', icon: 'i' },
  };

  const { bg, icon } = colors[type] || colors.info;

  toast.innerHTML = `
    <div style="
      display: flex;
      align-items: center;
      gap: 12px;
      background: #FFFFFF;
      padding: 14px 20px;
      border-radius: 12px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
      border-left: 4px solid ${bg};
      min-width: 280px;
      max-width: 400px;
      animation: toastSlideIn 0.3s ease;
      font-family: 'Inter', sans-serif;
    ">
      <div style="
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: ${bg};
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        font-weight: bold;
        flex-shrink: 0;
      ">${icon}</div>
      <span style="
        color: #0F172A;
        font-size: 14px;
        font-weight: 500;
        flex: 1;
      ">${message}</span>
      <button onclick="this.parentElement.parentElement.remove()" style="
        background: none;
        border: none;
        color: #94A3B8;
        cursor: pointer;
        padding: 4px;
        font-size: 16px;
        line-height: 1;
      ">×</button>
    </div>
  `;

  toastContainer.appendChild(toast);

  // Add animation styles if not present
  if (!document.getElementById('toast-styles')) {
    const style = document.createElement('style');
    style.id = 'toast-styles';
    style.textContent = `
      @keyframes toastSlideIn {
        from { opacity: 0; transform: translateX(100%); }
        to { opacity: 1; transform: translateX(0); }
      }
      @keyframes toastSlideOut {
        from { opacity: 1; transform: translateX(0); }
        to { opacity: 0; transform: translateX(100%); }
      }
    `;
    document.head.appendChild(style);
  }

  setTimeout(() => {
    if (toast.parentElement) {
      toast.style.animation = 'toastSlideOut 0.3s ease forwards';
      setTimeout(() => toast.remove(), 300);
    }
  }, duration);
};

// React component for declarative usage
const Toast = ({ message, type = 'success', duration = 3000, onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onClose?.(), 300);
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const colors = {
    success: { bg: '#10B981', icon: '✓' },
    error: { bg: '#EF4444', icon: '✕' },
    warning: { bg: '#F59E0B', icon: '!' },
    info: { bg: '#2563EB', icon: 'i' },
  };

  const { bg, icon } = colors[type] || colors.info;

  const styles = {
    container: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      background: '#FFFFFF',
      padding: '14px 20px',
      borderRadius: '12px',
      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
      borderLeft: `4px solid ${bg}`,
      minWidth: '280px',
      maxWidth: '400px',
      animation: visible ? 'toastSlideIn 0.3s ease' : 'toastSlideOut 0.3s ease',
      fontFamily: "'Inter', sans-serif",
    },
    icon: {
      width: '24px',
      height: '24px',
      borderRadius: '50%',
      background: bg,
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '12px',
      fontWeight: 'bold',
      flexShrink: 0,
    },
    message: {
      color: '#0F172A',
      fontSize: '14px',
      fontWeight: '500',
      flex: 1,
    },
    closeBtn: {
      background: 'none',
      border: 'none',
      color: '#94A3B8',
      cursor: 'pointer',
      padding: '4px',
      fontSize: '16px',
      lineHeight: 1,
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.icon}>{icon}</div>
      <span style={styles.message}>{message}</span>
      <button style={styles.closeBtn} onClick={() => { setVisible(false); onClose?.(); }}>×</button>
    </div>
  );
};

export default Toast;
