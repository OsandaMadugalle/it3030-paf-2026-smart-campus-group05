import React from 'react';

const LoadingSpinner = ({ size = 'md', color = '#2563EB' }) => {
  const sizes = {
    sm: { width: '20px', height: '20px', border: '2px' },
    md: { width: '36px', height: '36px', border: '3px' },
    lg: { width: '48px', height: '48px', border: '4px' },
    xl: { width: '64px', height: '64px', border: '5px' },
  };

  const { width, height, border } = sizes[size] || sizes.md;

  const styles = {
    container: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
    },
    spinner: {
      width,
      height,
      border: `${border} solid #E2E8F0`,
      borderTop: `${border} solid ${color}`,
      borderRadius: '50%',
      animation: 'spin 0.8s linear infinite',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.spinner}></div>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

// Skeleton loading components
export const SkeletonCard = ({ height = '120px' }) => {
  const styles = {
    card: {
      backgroundColor: '#F1F5F9',
      borderRadius: '12px',
      height,
      animation: 'shimmer 1.5s infinite',
      background: 'linear-gradient(90deg, #F1F5F9 25%, #E2E8F0 50%, #F1F5F9 75%)',
      backgroundSize: '200% 100%',
    },
  };

  return (
    <>
      <div style={styles.card}></div>
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </>
  );
};

export const SkeletonRow = ({ width = '100%' }) => {
  const styles = {
    row: {
      height: '16px',
      borderRadius: '4px',
      width,
      animation: 'shimmer 1.5s infinite',
      background: 'linear-gradient(90deg, #F1F5F9 25%, #E2E8F0 50%, #F1F5F9 75%)',
      backgroundSize: '200% 100%',
      marginBottom: '8px',
    },
  };

  return <div style={styles.row}></div>;
};

export const SkeletonTable = ({ rows = 5 }) => {
  const styles = {
    container: {
      backgroundColor: '#FFFFFF',
      borderRadius: '12px',
      padding: '20px',
      border: '1px solid #E2E8F0',
    },
    row: {
      display: 'flex',
      gap: '16px',
      padding: '12px 0',
      borderBottom: '1px solid #F1F5F9',
    },
  };

  return (
    <div style={styles.container}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} style={styles.row}>
          <SkeletonRow width="40px" />
          <SkeletonRow width="25%" />
          <SkeletonRow width="20%" />
          <SkeletonRow width="15%" />
          <SkeletonRow width="15%" />
          <SkeletonRow width="10%" />
        </div>
      ))}
    </div>
  );
};

export default LoadingSpinner;
