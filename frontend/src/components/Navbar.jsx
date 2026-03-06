import React from 'react';

const Navbar = ({ title, userInfo, onLogout, showLogo = false }) => {
  const styles = {
    navbar: {
      backgroundColor: '#FFFFFF',
      borderBottom: '1px solid #E2E8F0',
      padding: '16px 24px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    },
    left: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
    },
    logo: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    logoIcon: {
      width: '36px',
      height: '36px',
      borderRadius: '8px',
      backgroundColor: '#2563EB',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    logoText: {
      color: '#0F172A',
      fontSize: '16px',
      fontWeight: '600',
    },
    title: {
      color: '#0F172A',
      fontSize: '20px',
      fontWeight: '600',
    },
    right: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
    },
    userInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    avatar: {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      backgroundColor: '#E2E8F0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '14px',
      fontWeight: '600',
      color: '#64748B',
      overflow: 'hidden',
    },
    avatarImg: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
    },
    userName: {
      color: '#0F172A',
      fontSize: '14px',
      fontWeight: '500',
    },
    logoutBtn: {
      backgroundColor: 'transparent',
      border: '1px solid #E2E8F0',
      borderRadius: '8px',
      padding: '8px 16px',
      fontSize: '14px',
      color: '#64748B',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.left}>
        {showLogo && (
          <div style={styles.logo}>
            <div style={styles.logoIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
            </div>
            <span style={styles.logoText}>Smart Campus</span>
          </div>
        )}
        {title && <h1 style={styles.title}>{title}</h1>}
      </div>
      <div style={styles.right}>
        {userInfo && (
          <div style={styles.userInfo}>
            <div style={styles.avatar}>
              {userInfo.picture ? (
                <img src={userInfo.picture} alt={userInfo.name} style={styles.avatarImg} />
              ) : (
                getInitials(userInfo.name)
              )}
            </div>
            <span style={styles.userName}>{userInfo.name}</span>
          </div>
        )}
        {onLogout && (
          <button
            style={styles.logoutBtn}
            onClick={onLogout}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = '#2563EB';
              e.currentTarget.style.color = '#2563EB';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = '#E2E8F0';
              e.currentTarget.style.color = '#64748B';
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
