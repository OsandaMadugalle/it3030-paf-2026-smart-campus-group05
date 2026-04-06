import React from 'react';
import { useIsMobile } from '../hooks/useWindowSize';
import PublicNavbar from '../components/PublicNavbar';
import PublicFooter from '../components/PublicFooter';

const Contact = () => {
  const isMobile = useIsMobile();

  const styles = {
    page: {
      minHeight: '100vh',
      backgroundColor: '#F8FAFC',
      fontFamily: "'Inter', sans-serif",
      color: '#0F172A',
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
      backgroundColor: '#0F172A',
      padding: isMobile ? '24px 16px' : '32px 48px',
      textAlign: 'center',
      color: '#64748B',
      fontSize: '14px',
    },
  };

  return (
    <div style={styles.page}>
      <PublicNavbar isMobile={isMobile} />

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

      <PublicFooter isMobile={isMobile} />
    </div>
  );
};

export default Contact;
