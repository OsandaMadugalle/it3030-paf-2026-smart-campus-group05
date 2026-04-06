import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useIsMobile } from '../hooks/useWindowSize';

const FAQ = () => {
  const isMobile = useIsMobile();
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      question: 'Do I need an account to browse facilities?',
      answer:
        'No. Anyone can browse the public facilities catalog. However, creating bookings and managing requests requires authentication.',
    },
    {
      question: 'How are booking conflicts prevented?',
      answer:
        'The system checks time overlaps, resource availability windows, and facility status before confirming a booking request.',
    },
    {
      question: 'Who can approve or reject bookings?',
      answer:
        'Moderators and administrators can review and act on booking requests based on configured access roles.',
    },
    {
      question: 'Can facilities be filtered by type or location?',
      answer:
        'Yes. The facilities catalog supports search by keyword and filtering by facility type, with location shown on each card.',
    },
    {
      question: 'How do I receive booking updates?',
      answer:
        'Once signed in, users receive updates through in-app notifications and booking status changes in their dashboard.',
    },
    {
      question: 'What if a facility becomes unavailable?',
      answer:
        'If a facility is marked out of service, it is excluded from normal public booking use until status is restored by staff.',
    },
  ];

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
      maxWidth: '950px',
      margin: '0 auto',
      padding: isMobile ? '36px 16px 18px' : '56px 24px 24px',
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
    listWrap: {
      maxWidth: '950px',
      margin: '0 auto',
      padding: isMobile ? '8px 16px 56px' : '14px 24px 80px',
      display: 'grid',
      gap: '12px',
    },
    item: {
      border: '1px solid #E2E8F0',
      borderRadius: '12px',
      backgroundColor: '#FFFFFF',
      overflow: 'hidden',
      boxShadow: '0 8px 20px rgba(15, 23, 42, 0.05)',
    },
    questionBtn: {
      width: '100%',
      textAlign: 'left',
      backgroundColor: '#FFFFFF',
      border: 'none',
      padding: isMobile ? '14px 14px' : '16px 18px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '12px',
      cursor: 'pointer',
    },
    questionText: {
      margin: 0,
      fontSize: isMobile ? '15px' : '16px',
      fontWeight: 700,
      color: '#0F172A',
      lineHeight: 1.4,
    },
    icon: {
      fontSize: '20px',
      fontWeight: 700,
      color: '#2563EB',
      minWidth: '18px',
    },
    answerWrap: {
      padding: isMobile ? '0 14px 14px' : '0 18px 16px',
      borderTop: '1px solid #F1F5F9',
      backgroundColor: '#FCFDFE',
    },
    answerText: {
      margin: '10px 0 0',
      color: '#475569',
      fontSize: '14px',
      lineHeight: 1.7,
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
          <Link to="/login" style={styles.primaryBtn}>Login</Link>
        </div>
      </nav>

      <section style={styles.hero}>
        <h1 style={styles.title}>Frequently Asked Questions</h1>
        <p style={styles.subtitle}>
          Quick answers to common questions about facilities, bookings, approvals, and access.
        </p>
      </section>

      <section style={styles.listWrap}>
        {faqs.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <article key={item.question} style={styles.item}>
              <button
                style={styles.questionBtn}
                onClick={() => setOpenIndex(isOpen ? -1 : index)}
                aria-expanded={isOpen}
              >
                <h2 style={styles.questionText}>{item.question}</h2>
                <span style={styles.icon}>{isOpen ? '-' : '+'}</span>
              </button>

              {isOpen && (
                <div style={styles.answerWrap}>
                  <p style={styles.answerText}>{item.answer}</p>
                </div>
              )}
            </article>
          );
        })}
      </section>

      <footer style={styles.footer}>
        Need more help? Contact campus operations support through your institution.
      </footer>
    </div>
  );
};

export default FAQ;
