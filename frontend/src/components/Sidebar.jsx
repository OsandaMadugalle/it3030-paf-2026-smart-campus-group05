import React from 'react';

const Sidebar = ({ navItems, userInfo, onLogout, activeItem, onNavClick, isOpen, onToggle }) => {
  const styles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.5)',
      zIndex: 998,
      opacity: isOpen ? 1 : 0,
      visibility: isOpen ? 'visible' : 'hidden',
      transition: 'opacity 0.3s ease, visibility 0.3s ease',
    },
    hamburger: {
      position: 'fixed',
      top: '16px',
      left: '16px',
      zIndex: 1001,
      width: '44px',
      height: '44px',
      backgroundColor: '#0F172A',
      border: 'none',
      borderRadius: '10px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
    },
    sidebar: {
      width: '240px',
      height: '100vh',
      backgroundColor: '#0F172A',
      display: 'flex',
      flexDirection: 'column',
      position: 'fixed',
      left: 0,
      top: 0,
      zIndex: 999,
      transition: 'transform 0.3s ease',
    },
    logo: {
      padding: '24px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      borderBottom: '1px solid #1E293B',
    },
    logoIcon: {
      width: '40px',
      height: '40px',
      borderRadius: '10px',
      backgroundColor: '#2563EB',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    logoText: {
      color: '#FFFFFF',
      fontSize: '16px',
      fontWeight: '600',
    },
    closeBtn: {
      marginLeft: 'auto',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: '4px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    nav: {
      flex: 1,
      padding: '16px 12px',
      display: 'flex',
      flexDirection: 'column',
      gap: '4px',
      overflowY: 'auto',
    },
    navItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px 16px',
      borderRadius: '8px',
      color: '#94A3B8',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      border: 'none',
      backgroundColor: 'transparent',
      width: '100%',
      textAlign: 'left',
    },
    navItemActive: {
      backgroundColor: '#1E293B',
      color: '#FFFFFF',
    },
    footer: {
      padding: '16px',
      borderTop: '1px solid #1E293B',
    },
    userInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      paddingBottom: '16px',
    },
    avatar: {
      width: '36px',
      height: '36px',
      borderRadius: '50%',
      backgroundColor: '#2563EB',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#FFFFFF',
      fontSize: '14px',
      fontWeight: '600',
      overflow: 'hidden',
      flexShrink: 0,
    },
    avatarImg: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
    },
    userDetails: {
      overflow: 'hidden',
    },
    userName: {
      color: '#FFFFFF',
      fontSize: '14px',
      fontWeight: '500',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
    userRole: {
      color: '#64748B',
      fontSize: '12px',
    },
    logoutBtn: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px 16px',
      borderRadius: '8px',
      color: '#EF4444',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      border: 'none',
      backgroundColor: 'transparent',
      width: '100%',
      transition: 'all 0.2s ease',
    },
  };

  const renderIcon = (icon) => {
    switch (icon) {
      case 'home':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
        );
      case 'users':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
        );
      case 'shield':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
          </svg>
        );
      case 'bell':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
        );
      case 'settings':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
          </svg>
        );
      case 'building':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
            <path d="M9 22v-4h6v4"></path>
            <path d="M8 6h.01"></path>
            <path d="M16 6h.01"></path>
            <path d="M12 6h.01"></path>
            <path d="M12 10h.01"></path>
            <path d="M12 14h.01"></path>
            <path d="M16 10h.01"></path>
            <path d="M16 14h.01"></path>
            <path d="M8 10h.01"></path>
            <path d="M8 14h.01"></path>
          </svg>
        );
      case 'file':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
        );
      case 'chart':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="20" x2="18" y2="10"></line>
            <line x1="12" y1="20" x2="12" y2="4"></line>
            <line x1="6" y1="20" x2="6" y2="14"></line>
          </svg>
        );
      case 'monitor':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
            <line x1="8" y1="21" x2="16" y2="21"></line>
            <line x1="12" y1="17" x2="12" y2="21"></line>
          </svg>
        );
      case 'calendar':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
        );
      case 'hammer-wrench':
      case 'tool':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a2 2 0 0 1-2.14-.11 2 2 0 0 1-1.34-1.34 2 2 0 0 1-.11-2.14l-3.28 3.28ZM10.2 13.8a1 1 0 0 1 0-1.4l-1.6-1.6a1 1 0 0 1 0-1.4l3.77-3.77a2 2 0 0 1 2.14.11 2 2 0 0 1 1.34 1.34 2 2 0 0 1 .11 2.14l3.28-3.28a1 1 0 0 1 0 1.4l-3.77 3.77a1 1 0 0 1-1.4 0l-1.6-1.6a1 1 0 0 1-1.4 0l-3.77 3.77a2 2 0 0 1-2.14-.11 2 2 0 0 1-1.34-1.34 2 2 0 0 1-.11-2.14l-3.28 3.28a1 1 0 0 1 0-1.4l3.77-3.77Z"></path>
            <path d="m2 22 5-5"></path>
            <path d="M9.5 14.5 16 21"></path>
          </svg>
        );
      case 'qr':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7"></rect>
            <rect x="14" y="3" width="7" height="7"></rect>
            <rect x="14" y="14" width="7" height="7"></rect>
            <rect x="3" y="14" width="7" height="7"></rect>
            <path d="M7 7h.01"></path>
            <path d="M17 7h.01"></path>
            <path d="M17 17h.01"></path>
            <path d="M7 17h.01"></path>
          </svg>
        );
      case 'user':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        );
      case 'request':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path>
            <path d="M22 12A10 10 0 0 0 12 2v10z"></path>
          </svg>
        );
      case 'logout':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
        );
      default:
        return null;
    }
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

  const getPrimaryRole = (roles) => {
    if (roles?.includes('ROLE_ADMIN')) return 'Administrator';
    if (roles?.includes('ROLE_MODERATOR')) return 'Moderator';
    return 'User';
  };

  const handleNavClick = (itemId) => {
    onNavClick(itemId);
    if (onToggle) {
      onToggle(false);
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      <div 
        style={styles.overlay} 
        onClick={() => onToggle && onToggle(false)}
        className="mobile-only"
      />
      
      {/* Mobile hamburger button */}
      <button
        style={styles.hamburger}
        onClick={() => onToggle && onToggle(!isOpen)}
        className="mobile-only"
        aria-label="Toggle menu"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {isOpen ? (
            <>
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </>
          ) : (
            <>
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </>
          )}
        </svg>
      </button>

      {/* Sidebar */}
      <div 
        style={{
          ...styles.sidebar,
          transform: isOpen ? 'translateX(0)' : undefined,
        }}
        className={`sidebar-mobile ${isOpen ? 'open' : ''}`}
      >
        <div style={styles.logo}>
          <div style={styles.logoIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
          </div>
          <span style={styles.logoText}>Smart Campus</span>
          <button
            style={styles.closeBtn}
            onClick={() => onToggle && onToggle(false)}
            className="mobile-only"
            aria-label="Close menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <nav style={styles.nav}>
          {navItems.map((item) => (
            <button
              key={item.id}
              style={{
                ...styles.navItem,
                ...(activeItem === item.id ? styles.navItemActive : {}),
              }}
              onClick={() => handleNavClick(item.id)}
              onMouseOver={(e) => {
                if (activeItem !== item.id) {
                  e.currentTarget.style.backgroundColor = '#1E293B';
                  e.currentTarget.style.color = '#FFFFFF';
                }
              }}
              onMouseOut={(e) => {
                if (activeItem !== item.id) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#94A3B8';
                }
              }}
            >
              {renderIcon(item.icon)}
              {item.label}
            </button>
          ))}
        </nav>

        <div style={styles.footer}>
          {userInfo && (
            <div style={styles.userInfo}>
              <div style={styles.avatar}>
                {userInfo.picture ? (
                  <img src={userInfo.picture} alt={userInfo.name} style={styles.avatarImg} />
                ) : (
                  getInitials(userInfo.name)
                )}
              </div>
              <div style={styles.userDetails}>
                <div style={styles.userName}>{userInfo.name}</div>
                <div style={styles.userRole}>{getPrimaryRole(userInfo.roles)}</div>
              </div>
            </div>
          )}
          <button
            style={styles.logoutBtn}
            onClick={onLogout}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            {renderIcon('logout')}
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
