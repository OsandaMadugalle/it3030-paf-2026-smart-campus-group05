import React, { useState, useEffect } from 'react';

const CSSPieChart = ({ data = [], title, size = 200 }) => {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const total = data.reduce((sum, item) => sum + item.value, 0);

  // Generate conic gradient
  let currentDeg = 0;
  const gradientParts = data.map((item) => {
    const percentage = total > 0 ? (item.value / total) * 100 : 0;
    const degrees = (percentage / 100) * 360;
    const start = currentDeg;
    const end = currentDeg + degrees;
    currentDeg = end;
    return `${item.color} ${start}deg ${end}deg`;
  });

  const conicGradient = gradientParts.length > 0 
    ? `conic-gradient(${gradientParts.join(', ')})`
    : 'conic-gradient(#E2E8F0 0deg 360deg)';

  const styles = {
    container: {
      backgroundColor: '#FFFFFF',
      borderRadius: '12px',
      padding: '24px',
      border: '1px solid #E2E8F0',
    },
    title: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#0F172A',
      marginBottom: '20px',
    },
    chartWrapper: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '24px',
    },
    chartContainer: {
      position: 'relative',
      width: `${size}px`,
      height: `${size}px`,
    },
    pie: {
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      background: animated ? conicGradient : '#E2E8F0',
      transition: 'background 0.8s ease-out',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
    },
    innerCircle: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: `${size * 0.55}px`,
      height: `${size * 0.55}px`,
      borderRadius: '50%',
      backgroundColor: '#FFFFFF',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    },
    totalLabel: {
      fontSize: '12px',
      color: '#94A3B8',
    },
    totalValue: {
      fontSize: '24px',
      fontWeight: '700',
      color: '#0F172A',
    },
    legend: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: '12px',
      maxWidth: '300px',
    },
    legendItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '13px',
      color: '#64748B',
    },
    legendDot: (color) => ({
      width: '10px',
      height: '10px',
      borderRadius: '50%',
      backgroundColor: color,
      flexShrink: 0,
    }),
    legendLabel: {
      whiteSpace: 'nowrap',
    },
    legendValue: {
      fontWeight: '600',
      color: '#0F172A',
    },
    emptyState: {
      textAlign: 'center',
      padding: '40px 20px',
      color: '#94A3B8',
      fontSize: '14px',
    },
  };

  if (!data || data.length === 0) {
    return (
      <div style={styles.container}>
        {title && <h3 style={styles.title}>{title}</h3>}
        <div style={styles.emptyState}>No data available</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {title && <h3 style={styles.title}>{title}</h3>}
      <div style={styles.chartWrapper}>
        <div style={styles.chartContainer}>
          <div style={styles.pie}></div>
          <div style={styles.innerCircle}>
            <span style={styles.totalLabel}>Total</span>
            <span style={styles.totalValue}>{total}</span>
          </div>
        </div>
        <div style={styles.legend}>
          {data.map((item, index) => {
            const percentage = total > 0 ? ((item.value / total) * 100).toFixed(1) : 0;
            return (
              <div key={index} style={styles.legendItem}>
                <div style={styles.legendDot(item.color)}></div>
                <span style={styles.legendLabel}>{item.label}</span>
                <span style={styles.legendValue}>{item.value} ({percentage}%)</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CSSPieChart;
