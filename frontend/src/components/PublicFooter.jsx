import React from 'react';

const PublicFooter = ({ isMobile }) => {
  const styles = {
    footer: {
      backgroundColor: '#0F172A',
      padding: isMobile ? '24px 16px' : '32px 48px',
      textAlign: 'center',
      color: '#64748B',
      fontSize: '14px',
      animation: 'fadeUp 0.45s ease both',
    },
  };

  return (
    <footer style={styles.footer}>
      © {new Date().getFullYear()} Smart Campus Operations Hub. All rights reserved.
    </footer>
  );
};

export default PublicFooter;
