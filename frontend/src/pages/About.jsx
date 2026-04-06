import React from 'react';
import { Link } from 'react-router-dom';
import { useIsMobile } from '../hooks/useWindowSize';

const About = () => {
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
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      fontWeight: 800,
      fontSize: isMobile ? '16px' : '20px',
      color: '#0F172A',
      textDecoration: 'none',
    },
    navActions: {
      display: 'flex',
      gap: '10px',
      alignItems: 'center',
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
      maxWidth: '1000px',
      margin: '0 auto',
      padding: isMobile ? '40px 16px 20px' : '70px 24px 30px',
    },
    title: {
      fontSize: isMobile ? '32px' : '48px',
      lineHeight: 1.1,
      fontWeight: 800,
      marginBottom: '14px',
    },
    subtitle: {
      fontSize: isMobile ? '16px' : '19px',
      color: '#475569',
      lineHeight: 1.7,
      maxWidth: '760px',
    },
    grid: {
      maxWidth: '1000px',
      margin: '0 auto',
      padding: isMobile ? '20px 16px 60px' : '24px 24px 90px',
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, minmax(0, 1fr))',
      gap: isMobile ? '16px' : '20px',
    },
    card: {
      backgroundColor: '#FFFFFF',
      border: '1px solid #E2E8F0',
      borderRadius: '14px',
      padding: isMobile ? '22px' : '26px',
      boxShadow: '0 10px 24px rgba(15, 23, 42, 0.06)',
    },
    cardTitle: {
      fontSize: '20px',
      fontWeight: 700,
      marginBottom: '10px',
      color: '#0F172A',
    },
    cardText: {
      fontSize: '14px',
      lineHeight: 1.7,
      color: '#475569',
    },
    valuesList: {
      marginTop: '12px',
      paddingLeft: '18px',
      color: '#475569',
      lineHeight: 1.8,
      fontSize: '14px',
    },
    footer: {
      borderTop: '1px solid #E2E8F0',
      padding: isMobile ? '18px 16px' : '20px 48px',
      textAlign: 'center',
      color: '#64748B',
      fontSize: '13px',
      backgroundColor: '#FFFFFF',
    },
  };

  return (
    <div style={styles.page}>
      <nav style={styles.nav}>
        <Link to="/" style={styles.brand}>
          Smart Campus
        </Link>
        <div style={styles.navActions}>
          <Link to="/" style={styles.ghostBtn}>Home</Link>
          <Link to="/login" style={styles.primaryBtn}>Login</Link>
        </div>
      </nav>

      <section style={styles.hero}>
        <h1 style={styles.title}>About Smart Campus</h1>
        <p style={styles.subtitle}>
          Smart Campus Operations Hub is a unified platform for managing campus facilities, bookings,
          real-time monitoring, and communication workflows. It helps institutions improve resource
          utilization, reduce scheduling conflicts, and deliver a consistent experience for students and staff.
        </p>
      </section>

      <section style={styles.grid}>
        <article style={styles.card}>
          <h2 style={styles.cardTitle}>Our Mission</h2>
          <p style={styles.cardText}>
            To make campus operations predictable, transparent, and efficient by bringing booking,
            moderation, and notifications into one secure, role-based system.
          </p>
        </article>

        <article style={styles.card}>
          <h2 style={styles.cardTitle}>Who We Serve</h2>
          <p style={styles.cardText}>
            Smart Campus is designed for administrators, moderators, students, lecturers, and campus
            operations teams that require reliable coordination across facilities and events.
          </p>
        </article>

        <article style={styles.card}>
          <h2 style={styles.cardTitle}>What Makes It Professional</h2>
          <p style={styles.cardText}>
            The platform combines structured approval workflows, secure access controls, and real-time
            visibility to support institutional governance and day-to-day execution.
          </p>
        </article>

        <article style={styles.card}>
          <h2 style={styles.cardTitle}>Core Values</h2>
          <ul style={styles.valuesList}>
            <li>Operational reliability with role-based accountability</li>
            <li>Data-driven decision making through live status visibility</li>
            <li>User-first workflows for booking and communication</li>
            <li>Scalable architecture for growing campus ecosystems</li>
          </ul>
        </article>
      </section>

      <footer style={styles.footer}>
        Smart Campus Operations Hub - Built for modern campus management
      </footer>
    </div>
  );
};

export default About;
