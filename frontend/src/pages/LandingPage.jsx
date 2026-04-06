import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useIsMobile } from '../hooks/useWindowSize';
import heroImage from '../assets/hero.jpg';

const LandingPage = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [searchParams] = useSearchParams();
  const error = searchParams.get('error');
  const isMobile = useIsMobile();

  const googleLogin = () => {
    window.location.href = 'http://localhost:8081/oauth2/authorization/google';
  };

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#F8FAFC',
      fontFamily: "'Inter', sans-serif",
    },
    navbar: {
      backgroundColor: '#FFFFFF',
      borderBottom: '1px solid #E2E8F0',
      padding: isMobile ? '12px 16px' : '16px 48px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 100,
    },
    logo: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
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
    loginBtn: {
      backgroundColor: '#2563EB',
      color: '#FFFFFF',
      border: 'none',
      padding: isMobile ? '10px 16px' : '12px 24px',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    },
    hero: {
      paddingTop: isMobile ? '100px' : '160px',
      paddingBottom: isMobile ? '60px' : '100px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden',
    },
    heroBackground: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundImage: `linear-gradient(rgba(15, 23, 42, ${isMobile ? 0.64 : 0.52}), rgba(15, 23, 42, ${isMobile ? 0.64 : 0.52})), url(${heroImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      zIndex: 0,
    },
    heroContent: {
      position: 'relative',
      zIndex: 1,
      maxWidth: '700px',
      padding: isMobile ? '0 16px' : '0 24px',
      animation: 'fadeUp 0.7s ease forwards',
    },
    heroTitle: {
      fontSize: isMobile ? '36px' : '56px',
      fontWeight: '800',
      color: '#FFFFFF',
      marginBottom: isMobile ? '16px' : '24px',
      lineHeight: '1.1',
    },
    heroTitleGradient: {
      color: '#FFFFFF',
      WebkitTextFillColor: '#FFFFFF',
      textShadow: '0 2px 14px rgba(0, 0, 0, 0.45)',
    },
    heroSubtitle: {
      fontSize: isMobile ? '16px' : '20px',
      color: '#E2E8F0',
      marginBottom: isMobile ? '32px' : '40px',
      lineHeight: '1.6',
    },
    heroCta: {
      backgroundColor: '#2563EB',
      color: '#FFFFFF',
      border: 'none',
      padding: isMobile ? '14px 32px' : '16px 40px',
      borderRadius: '12px',
      fontSize: isMobile ? '15px' : '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)',
    },
    heroIllustration: {
      position: 'relative',
      marginTop: isMobile ? '40px' : '60px',
      display: 'flex',
      justifyContent: 'center',
      gap: isMobile ? '12px' : '24px',
      flexWrap: 'wrap',
      animation: 'fadeUp 0.8s ease forwards',
    },
    illustrationShape: {
      width: isMobile ? '80px' : '120px',
      height: isMobile ? '80px' : '120px',
      borderRadius: isMobile ? '16px' : '24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    features: {
      backgroundColor: '#FFFFFF',
      padding: isMobile ? '60px 16px' : '100px 48px',
    },
    featuresContainer: {
      maxWidth: '1200px',
      margin: '0 auto',
    },
    featuresTitle: {
      fontSize: isMobile ? '28px' : '36px',
      fontWeight: '700',
      color: '#0F172A',
      textAlign: 'center',
      marginBottom: '16px',
    },
    featuresSubtitle: {
      fontSize: isMobile ? '15px' : '18px',
      color: '#64748B',
      textAlign: 'center',
      marginBottom: isMobile ? '40px' : '60px',
    },
    featuresGrid: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: isMobile ? '20px' : '32px',
    },
    featureCard: {
      backgroundColor: '#F8FAFC',
      borderRadius: '16px',
      padding: isMobile ? '24px' : '32px',
      border: '1px solid #E2E8F0',
      transition: 'all 0.3s ease',
      animation: 'fadeUp 0.7s ease forwards',
    },
    featureIcon: {
      width: '56px',
      height: '56px',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '20px',
    },
    featureTitle: {
      fontSize: '20px',
      fontWeight: '600',
      color: '#0F172A',
      marginBottom: '12px',
    },
    featureDescription: {
      fontSize: '14px',
      color: '#64748B',
      lineHeight: '1.6',
    },
    ctaSection: {
      background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
      padding: isMobile ? '56px 16px' : '80px 48px',
    },
    ctaContainer: {
      maxWidth: '900px',
      margin: '0 auto',
      textAlign: 'center',
      animation: 'fadeUp 0.8s ease forwards',
    },
    ctaTitle: {
      color: '#FFFFFF',
      fontSize: isMobile ? '28px' : '40px',
      lineHeight: 1.2,
      fontWeight: '800',
      marginBottom: '14px',
    },
    ctaSubtitle: {
      color: '#CBD5E1',
      fontSize: isMobile ? '15px' : '18px',
      lineHeight: 1.6,
      marginBottom: isMobile ? '28px' : '34px',
    },
    ctaActions: {
      display: 'flex',
      gap: '12px',
      justifyContent: 'center',
      flexDirection: isMobile ? 'column' : 'row',
      alignItems: 'center',
    },
    ctaPrimaryBtn: {
      backgroundColor: '#2563EB',
      color: '#FFFFFF',
      border: 'none',
      borderRadius: '10px',
      padding: isMobile ? '14px 26px' : '14px 30px',
      fontSize: '15px',
      fontWeight: '700',
      cursor: 'pointer',
      boxShadow: '0 8px 24px rgba(37, 99, 235, 0.28)',
      transition: 'all 0.2s ease',
      width: isMobile ? '100%' : 'auto',
      maxWidth: isMobile ? '320px' : 'none',
    },
    ctaSecondaryBtn: {
      backgroundColor: 'transparent',
      color: '#E2E8F0',
      border: '1px solid #64748B',
      borderRadius: '10px',
      padding: isMobile ? '14px 26px' : '14px 30px',
      fontSize: '15px',
      fontWeight: '700',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      width: isMobile ? '100%' : 'auto',
      maxWidth: isMobile ? '320px' : 'none',
    },
    footer: {
      backgroundColor: '#0F172A',
      padding: isMobile ? '24px 16px' : '32px 48px',
      textAlign: 'center',
    },
    footerText: {
      color: '#64748B',
      fontSize: '14px',
    },
    // Modal Styles
    modalOverlay: {
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
    },
    modal: {
      backgroundColor: '#FFFFFF',
      borderRadius: '16px',
      padding: isMobile ? '32px 24px' : '40px',
      width: '100%',
      maxWidth: '420px',
      margin: isMobile ? '0 16px' : '0',
      position: 'relative',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)',
      animation: 'modalSlideIn 0.3s ease',
    },
    modalClose: {
      position: 'absolute',
      top: '16px',
      right: '16px',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: '8px',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'background-color 0.2s ease',
    },
    modalTitle: {
      fontSize: '24px',
      fontWeight: '700',
      color: '#0F172A',
      marginBottom: '8px',
      textAlign: 'center',
    },
    modalSubtitle: {
      fontSize: '14px',
      color: '#64748B',
      marginBottom: '32px',
      textAlign: 'center',
    },
    googleBtn: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '12px',
      width: '100%',
      padding: '14px 24px',
      backgroundColor: '#FFFFFF',
      border: '2px solid #E2E8F0',
      borderRadius: '12px',
      fontSize: '15px',
      fontWeight: '600',
      color: '#0F172A',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    },
    errorMessage: {
      backgroundColor: '#FEF2F2',
      border: '1px solid #FECACA',
      borderRadius: '8px',
      padding: '12px 16px',
      marginBottom: '20px',
      color: '#DC2626',
      fontSize: '14px',
      textAlign: 'center',
    },
  };

  const features = [
    {
      icon: 'monitor',
      title: 'Real-time Campus Monitoring',
      description: 'Live dashboard with facility status, occupancy tracking, and operational insights. Immediate alerts for conflicts or booking changes.',
      color: '#2563EB',
    },
    {
      icon: 'shield',
      title: 'Secure Role-based Access',
      description: 'Enterprise-grade permission system. Admins control the platform, moderators manage approvals, users book independently with full audit trails.',
      color: '#10B981',
    },
    {
      icon: 'bell',
      title: 'Smart Notifications',
      description: 'Intelligent alerts for bookings, approvals, conflicts, and announcements. Customizable by user role and notification preference.',
      color: '#F59E0B',
    },
  ];

  const quickStats = [];

  const renderFeatureIcon = (icon, color) => {
    switch (icon) {
      case 'monitor':
        return (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
            <line x1="8" y1="21" x2="16" y2="21"></line>
            <line x1="12" y1="17" x2="12" y2="21"></line>
          </svg>
        );
      case 'shield':
        return (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            <polyline points="9 12 11 14 15 10"></polyline>
          </svg>
        );
      case 'bell':
        return (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div style={styles.container}>
      {/* Navbar */}
      <nav style={styles.navbar}>
        <div style={styles.logo}>
          <div style={styles.logoIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
          </div>
          <span style={styles.logoText}>Smart Campus</span>
        </div>
        <button
          style={styles.loginBtn}
          onClick={() => setShowLoginModal(true)}
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
      </nav>

      {/* Hero Section */}
      <section style={styles.hero}>
        <div style={styles.heroBackground}></div>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>
            <span style={styles.heroTitleGradient}>Smart Campus</span>
            <br />
            Operations Hub
          </h1>
          <p style={styles.heroSubtitle}>
            Centralized platform for facility bookings, real-time monitoring, and campus communication.
            Trusted by admins, moderators, and users for streamlined operations and compliance.
          </p>
          <button
            style={styles.heroCta}
            onClick={() => setShowLoginModal(true)}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#1D4ED8';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(37, 99, 235, 0.5)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#2563EB';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 14px rgba(37, 99, 235, 0.4)';
            }}
          >
            Get Started
          </button>
        </div>
        <div style={styles.heroIllustration}>
          <div style={{ ...styles.illustrationShape, backgroundColor: '#DBEAFE' }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </div>
          <div style={{ ...styles.illustrationShape, backgroundColor: '#D1FAE5', transform: 'translateY(-20px)' }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
            </svg>
          </div>
          <div style={{ ...styles.illustrationShape, backgroundColor: '#FEF3C7' }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={styles.features}>
        <div style={styles.featuresContainer}>
          <h2 style={styles.featuresTitle}>Why Choose Smart Campus?</h2>
          <p style={styles.featuresSubtitle}>
            Everything you need to manage campus operations effectively
          </p>
          <div style={styles.featuresGrid}>
            {features.map((feature, index) => (
              <div
                key={index}
                style={{ ...styles.featureCard, animationDelay: `${index * 0.1}s` }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.1)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{ ...styles.featureIcon, backgroundColor: `${feature.color}15` }}>
                  {renderFeatureIcon(feature.icon, feature.color)}
                </div>
                <h3 style={styles.featureTitle}>{feature.title}</h3>
                <p style={styles.featureDescription}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={styles.ctaSection}>
        <div style={styles.ctaContainer}>
          <h2 style={styles.ctaTitle}>Transform Your Campus Operations Now</h2>
          <p style={styles.ctaSubtitle}>
            Join institutions using Smart Campus for secure facility management, real-time monitoring, and effortless communication. Built for administrators, moderators, and users.
          </p>
          <div style={styles.ctaActions}>
            <button
              style={styles.ctaPrimaryBtn}
              onClick={() => setShowLoginModal(true)}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#1D4ED8';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#2563EB';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Login Now
            </button>
            <button
              style={styles.ctaSecondaryBtn}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(148, 163, 184, 0.16)';
                e.currentTarget.style.borderColor = '#94A3B8';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.borderColor = '#64748B';
              }}
            >
              Back to Top
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <p style={styles.footerText}>
          © {new Date().getFullYear()} Smart Campus Operations Hub. All rights reserved.
        </p>
      </footer>

      {/* Login Modal */}
      {showLoginModal && (
        <div 
          style={styles.modalOverlay}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowLoginModal(false);
          }}
        >
          <div style={styles.modal}>
            <button
              style={styles.modalClose}
              onClick={() => setShowLoginModal(false)}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#F1F5F9';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '14px',
                backgroundColor: '#2563EB',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px'
              }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
              </div>
            </div>
            
            <h2 style={styles.modalTitle}>Welcome Back</h2>
            <p style={styles.modalSubtitle}>Sign in to access Smart Campus Operations Hub</p>
            
            {error && (
              <div style={styles.errorMessage}>
                Authentication failed. Please try again.
              </div>
            )}
            
            <button
              style={styles.googleBtn}
              onClick={googleLogin}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = '#2563EB';
                e.currentTarget.style.backgroundColor = '#F8FAFC';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = '#E2E8F0';
                e.currentTarget.style.backgroundColor = '#FFFFFF';
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>
          </div>
        </div>
      )}

      {/* Global Styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Inter', sans-serif;
        }
        
        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(14px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          * {
            animation: none !important;
            transition: none !important;
          }
        }
        
        @media (max-width: 768px) {
          .hero-title {
            font-size: 36px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
