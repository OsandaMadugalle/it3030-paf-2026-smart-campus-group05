import React from 'react';
import { Link } from 'react-router-dom';
import { useIsMobile } from '../hooks/useWindowSize';

const Contact = () => {
  const isMobile = useIsMobile();

  const styles = {
    page: {
      minHeight: '100vh',
      backgroundColor: '#F8FAFC',
      fontFamily: "'Inter', sans-serif",
      color: '#0F172A',
    },
    nav: {
      position: 'sticky',
      top: 0,
      zIndex: 50,
      backgroundColor: '#FFFFFF',
      borderBottom: '1px solid #E2E8F0',
      padding: isMobile ? '12px 16px' : '14px 48px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    brand: {
      fontWeight: 800,
      fontSize: isMobile ? '16px' : '20px',
      color: '#0F172A',
      textDecoration: 'none',
    },
    navActions: {
      display: 'flex',
      gap: '10px',
      alignItems: 'center',
      flexWrap: 'wrap',
      justifyContent: 'flex-end',
    },
    ghostBtn: {
      border: '1px solid #CBD5E1',
      color: '#334155',
      backgroundColor: '#FFFFFF',
      borderRadius: '8px',
      padding: isMobile ? '8px 12px' : '9px 14px',
      fontSize: '14px',
      fontWeight: 600,
      textDecoration: 'none',
    },
    primaryBtn: {
      border: 'none',
      color: '#FFFFFF',
      backgroundColor: '#2563EB',
      borderRadius: '8px',
      padding: isMobile ? '9px 13px' : '10px 16px',
      fontSize: '14px',
      fontWeight: 700,
      textDecoration: 'none',
    },
    hero: {
      maxWidth: '1100px',
      margin: '0 auto',
      padding: isMobile ? '34px 16px 18px' : '54px 24px 24px',
    },
    title: {
      fontSize: isMobile ? '30px' : '44px',
      lineHeight: 1.1,
      fontWeight: 800,
      marginBottom: '12px',
    },
    subtitle: {
      fontSize: isMobile ? '15px' : '18px',
      color: '#475569',
      lineHeight: 1.7,
      maxWidth: '760px',
    },
    content: {
      maxWidth: '1100px',
      margin: '0 auto',
      padding: isMobile ? '6px 16px 56px' : '12px 24px 80px',
      display: 'grid',
      gridTemplateColumns: '1fr',
      gap: isMobile ? '14px' : '18px',
    },
    infoCard: {
      border: '1px solid #E2E8F0',
      borderRadius: '14px',
      backgroundColor: '#FFFFFF',
      boxShadow: '0 8px 22px rgba(15, 23, 42, 0.06)',
      padding: isMobile ? '18px' : '22px',
    },
    cardTitle: {
      marginTop: 0,
      marginBottom: '12px',
      fontSize: '21px',
      fontWeight: 700,
      color: '#0F172A',
    },
    infoItem: {
      marginBottom: '12px',
      fontSize: '14px',
      color: '#475569',
      lineHeight: 1.6,
    },
    infoLabel: {
      display: 'block',
      fontSize: '13px',
      color: '#64748B',
      marginBottom: '3px',
      fontWeight: 600,
      letterSpacing: '0.2px',
      textTransform: 'uppercase',
    },
    mapCard: {
      border: '1px solid #E2E8F0',
      borderRadius: '14px',
      backgroundColor: '#FFFFFF',
      boxShadow: '0 8px 22px rgba(15, 23, 42, 0.06)',
      padding: isMobile ? '18px' : '22px',
    },
    mapFrame: {
      width: '100%',
      height: isMobile ? '320px' : '420px',
      border: '1px solid #E2E8F0',
      borderRadius: '12px',
    },
    footer: {
      borderTop: '1px solid #E2E8F0',
      padding: isMobile ? '16px' : '18px 48px',
      textAlign: 'center',
      color: '#64748B',
      fontSize: '13px',
      backgroundColor: '#FFFFFF',
    },
  };

  return (
    <div style={styles.page}>
      <nav style={styles.nav}>
        <Link to="/" style={styles.brand}>Smart Campus</Link>
        <div style={styles.navActions}>
          <Link to="/" style={styles.ghostBtn}>Home</Link>
          <Link to="/about" style={styles.ghostBtn}>About</Link>
          <Link to="/facilities" style={styles.ghostBtn}>Facilities</Link>
          <Link to="/faq" style={styles.ghostBtn}>FAQ</Link>
          <Link to="/login" style={styles.primaryBtn}>Login</Link>
        </div>
      </nav>

      <section style={styles.hero}>
        <h1 style={styles.title}>Contact and Support</h1>
        <p style={styles.subtitle}>
          Reach the Smart Campus operations team for technical support, booking guidance,
          or platform inquiries.
        </p>
      </section>

      <section style={styles.content}>
        <article style={styles.infoCard}>
          <h2 style={styles.cardTitle}>Support Details</h2>

          <div style={styles.infoItem}>
            <span style={styles.infoLabel}>Support Email</span>
            campus.support@smartcampus.edu
          </div>

          <div style={styles.infoItem}>
            <span style={styles.infoLabel}>Operations Desk</span>
            +94 11 234 5678
          </div>

          <div style={styles.infoItem}>
            <span style={styles.infoLabel}>Office Hours</span>
            Monday to Friday, 8:30 AM to 5:30 PM
          </div>

          <div style={styles.infoItem}>
            <span style={styles.infoLabel}>Response SLA</span>
            Critical issues: within 4 hours
            <br />
            General inquiries: within 1 business day
          </div>

          <div style={styles.infoItem}>
            <span style={styles.infoLabel}>Campus Address</span>
            Smart Campus Operations Center, University Road, Colombo
          </div>
        </article>

        <article style={styles.mapCard}>
          <h2 style={styles.cardTitle}>Campus Location Map</h2>
          <iframe
            title="Smart Campus Location"
            style={styles.mapFrame}
            loading="lazy"
            src="https://www.openstreetmap.org/export/embed.html?bbox=79.8480%2C6.8880%2C79.8780%2C6.9180&layer=mapnik&marker=6.9030%2C79.8630"
          />
        </article>
      </section>

      <footer style={styles.footer}>
        Smart Campus Operations Hub - Public Support Channel
      </footer>
    </div>
  );
};

export default Contact;
