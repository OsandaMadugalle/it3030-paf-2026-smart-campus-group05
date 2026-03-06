import React, { useState, useEffect } from 'react';

const CSSBarChart = ({ data = [], title, horizontal = true, maxHeight = 300 }) => {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const maxValue = Math.max(...data.map(d => d.value), 1);

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
    chartContainer: {
      display: 'flex',
      flexDirection: horizontal ? 'column' : 'row',
      alignItems: horizontal ? 'stretch' : 'flex-end',
      gap: horizontal ? '12px' : '16px',
      maxHeight: horizontal ? 'none' : maxHeight,
    },
    barRow: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    label: {
      width: '120px',
      flexShrink: 0,
      fontSize: '13px',
      color: '#64748B',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
    barContainer: {
      flex: 1,
      height: '28px',
      backgroundColor: '#F1F5F9',
      borderRadius: '6px',
      overflow: 'hidden',
      position: 'relative',
    },
    bar: (width, color) => ({
      height: '100%',
      width: animated ? width : '0%',
      backgroundColor: color || '#2563EB',
      borderRadius: '6px',
      transition: 'width 0.8s ease-out',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      paddingRight: '8px',
    }),
    value: {
      fontSize: '12px',
      fontWeight: '600',
      color: '#FFFFFF',
      minWidth: '30px',
    },
    valueOutside: {
      fontSize: '12px',
      fontWeight: '600',
      color: '#64748B',
      marginLeft: '8px',
      minWidth: '40px',
    },
    // Vertical bar styles
    verticalBarContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      flex: 1,
    },
    verticalBar: (height, color) => ({
      width: '40px',
      height: animated ? height : '0px',
      backgroundColor: color || '#2563EB',
      borderRadius: '6px 6px 0 0',
      transition: 'height 0.8s ease-out',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center',
      paddingTop: '8px',
    }),
    verticalLabel: {
      marginTop: '8px',
      fontSize: '12px',
      color: '#64748B',
      textAlign: 'center',
      maxWidth: '60px',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
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

  if (horizontal) {
    return (
      <div style={styles.container}>
        {title && <h3 style={styles.title}>{title}</h3>}
        <div style={styles.chartContainer}>
          {data.map((item, index) => {
            const percentage = (item.value / maxValue) * 100;
            const showValueInside = percentage > 15;
            return (
              <div key={index} style={styles.barRow}>
                <span style={styles.label} title={item.label}>{item.label}</span>
                <div style={styles.barContainer}>
                  <div style={styles.bar(`${percentage}%`, item.color)}>
                    {showValueInside && <span style={styles.value}>{item.value}</span>}
                  </div>
                </div>
                {!showValueInside && <span style={styles.valueOutside}>{item.value}</span>}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Vertical bars
  return (
    <div style={styles.container}>
      {title && <h3 style={styles.title}>{title}</h3>}
      <div style={{ ...styles.chartContainer, height: maxHeight, paddingTop: '20px' }}>
        {data.map((item, index) => {
          const height = (item.value / maxValue) * (maxHeight - 60);
          return (
            <div key={index} style={styles.verticalBarContainer}>
              <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end' }}>
                <div style={styles.verticalBar(`${height}px`, item.color)}>
                  <span style={{ ...styles.value, paddingTop: '4px' }}>{item.value}</span>
                </div>
              </div>
              <span style={styles.verticalLabel}>{item.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CSSBarChart;
