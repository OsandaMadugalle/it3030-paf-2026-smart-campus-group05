import React from 'react';
import { useNavigate } from 'react-router-dom';

const Unauthorized = () => {
  const navigate = useNavigate();

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#F8FAFC',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Inter', sans-serif",
      padding: '24px',
    },
    content: {
      textAlign: 'center',
      maxWidth: '400px',
    },
    iconContainer: {
      width: '120px',
      height: '120px',
      borderRadius: '50%',
      backgroundColor: '#FEE2E2',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 32px',
    },
    lockIcon: {
      width: '60px',
      height: '60px',
      position: 'relative',
    },
    title: {
      fontSize: '32px',
      fontWeight: '700',
      color: '#0F172A',
      marginBottom: '12px',
    },
    subtitle: {
      fontSize: '16px',
      color: '#64748B',
      marginBottom: '40px',
      lineHeight: '1.6',
    },
    buttonGroup: {
      display: 'flex',
      gap: '16px',
      justifyContent: 'center',
    },
    button: {
      padding: '14px 28px',
      borderRadius: '12px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      border: 'none',
    },
    primaryBtn: {
      backgroundColor: '#2563EB',
      color: '#FFFFFF',
    },
    secondaryBtn: {
      backgroundColor: '#FFFFFF',
      color: '#64748B',
      border: '1px solid #E2E8F0',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <div style={styles.iconContainer}>
          <svg 
            width="60" 
            height="60" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="#EF4444" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            <circle cx="12" cy="16" r="1"></circle>
          </svg>
        </div>
        
        <h1 style={styles.title}>Access Denied</h1>
        <p style={styles.subtitle}>
          You don't have permission to view this page. Please contact an administrator if you believe this is an error.
        </p>
        
        <div style={styles.buttonGroup}>
          <button
            onClick={() => navigate(-1)}
            style={{ ...styles.button, ...styles.secondaryBtn }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = '#2563EB';
              e.currentTarget.style.color = '#2563EB';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = '#E2E8F0';
              e.currentTarget.style.color = '#64748B';
            }}
          >
            Go Back
          </button>
          <button
            onClick={() => navigate('/')}
            style={{ ...styles.button, ...styles.primaryBtn }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#1D4ED8';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#2563EB';
            }}
          >
            Go Home
          </button>
        </div>
      </div>
      
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Inter', sans-serif;
        }
      `}</style>
    </div>
  );
};

export default Unauthorized;
