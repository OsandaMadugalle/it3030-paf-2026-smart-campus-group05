import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const PublicNavbar = ({ isMobile, onLoginClick, fixed = false }) => {
  const location = useLocation();

  const isActiveRoute = (to) => {
    if (to === '/') {
      return location.pathname === '/';
    }
    return location.pathname === to || location.pathname.startsWith(`${to}/`);
  };

  const navBtnStyle = (isActive) => ({
    backgroundColor: isActive ? '#E8F0FF' : '#FFFFFF',
    color: isActive ? '#1D4ED8' : '#1E293B',
    border: `1px solid ${isActive ? '#93C5FD' : '#CBD5E1'}`,
    padding: isMobile ? '8px 12px' : '12px 18px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: isActive ? '700' : '600',
    textDecoration: 'none',
    transition: 'all 0.2s ease',
    whiteSpace: 'nowrap',
  });

  const styles = {
    nav: {
      backgroundColor: '#FFFFFF',
      borderBottom: '1px solid #E2E8F0',
      padding: isMobile ? '12px 16px' : '16px 48px',
      display: 'flex',
      justifyContent: isMobile ? 'center' : 'space-between',
      alignItems: isMobile ? 'stretch' : 'center',
      flexDirection: isMobile ? 'column' : 'row',
      gap: isMobile ? '10px' : '0',
      position: fixed ? 'fixed' : 'sticky',
      top: 0,
      left: fixed ? 0 : 'auto',
      right: fixed ? 0 : 'auto',
      zIndex: 100,
      animation: 'fadeDown 0.45s ease both',
    },
    logo: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      textDecoration: 'none',
    },
    logoIcon: {
      width: isMobile ? '36px' : '40px',
      height: isMobile ? '36px' : '40px',
      borderRadius: '10px',
      backgroundColor: '#2563EB',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    logoText: {
      color: '#0F172A',
      fontSize: isMobile ? '16px' : '20px',
      fontWeight: '700',
    },
    navActions: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: isMobile ? 'center' : 'flex-end',
      flexWrap: 'wrap',
      width: isMobile ? '100%' : 'auto',
      columnGap: isMobile ? '8px' : '10px',
      rowGap: isMobile ? '8px' : '0',
    },
    loginBtn: {
      backgroundColor: '#2563EB',
      color: '#FFFFFF',
      border: 'none',
      padding: isMobile ? '8px 14px' : '12px 24px',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '600',
      textDecoration: 'none',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      whiteSpace: 'nowrap',
    },
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/facilities', label: 'Facilities' },
    { to: '/faq', label: 'FAQ' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.logo}>
        <div style={styles.logoIcon}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
        </div>
        <span style={styles.logoText}>Smart Campus</span>
      </Link>

      <div style={styles.navActions}>
        {navLinks.map((link) => {
          const isActive = isActiveRoute(link.to);

          return (
            <Link
              key={link.to}
              to={link.to}
              style={navBtnStyle(isActive)}
              onMouseOver={(e) => {
                if (!isActive) {
                  e.currentTarget.style.borderColor = '#94A3B8';
                  e.currentTarget.style.backgroundColor = '#F8FAFC';
                }
              }}
              onMouseOut={(e) => {
                if (!isActive) {
                  e.currentTarget.style.borderColor = '#CBD5E1';
                  e.currentTarget.style.backgroundColor = '#FFFFFF';
                }
              }}
            >
              {link.label}
            </Link>
          );
        })}

        {onLoginClick ? (
          <button
            style={styles.loginBtn}
            onClick={onLoginClick}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#1D4ED8';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#2563EB';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Login
          </button>
        ) : (
          <Link
            to="/login"
            style={styles.loginBtn}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#1D4ED8';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#2563EB';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default PublicNavbar;
