import React from 'react';

const StepIndicator = ({ steps, currentStep }) => {
  const styles = {
    container: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px 0',
      marginBottom: '24px',
    },
    step: {
      display: 'flex',
      alignItems: 'center',
    },
    stepCircle: (isActive, isCompleted) => ({
      width: '36px',
      height: '36px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '14px',
      fontWeight: '600',
      transition: 'all 0.3s ease',
      backgroundColor: isCompleted ? '#2563EB' : isActive ? '#2563EB' : '#F1F5F9',
      color: isCompleted || isActive ? '#FFFFFF' : '#94A3B8',
      border: isActive && !isCompleted ? '2px solid #2563EB' : 'none',
    }),
    stepLabel: (isActive, isCompleted) => ({
      marginLeft: '10px',
      fontSize: '14px',
      fontWeight: isActive ? '600' : '500',
      color: isCompleted || isActive ? '#0F172A' : '#94A3B8',
      display: 'none',
      '@media (minWidth: 640px)': {
        display: 'block',
      },
    }),
    connector: (isCompleted) => ({
      width: '60px',
      height: '2px',
      backgroundColor: isCompleted ? '#2563EB' : '#E2E8F0',
      margin: '0 8px',
      transition: 'all 0.3s ease',
    }),
  };

  return (
    <div style={styles.container}>
      {steps.map((step, index) => {
        const isActive = index + 1 === currentStep;
        const isCompleted = index + 1 < currentStep;

        return (
          <div key={index} style={styles.step}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={styles.stepCircle(isActive, isCompleted)}>
                {isCompleted ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                ) : (
                  index + 1
                )}
              </div>
              <span style={{
                marginLeft: '10px',
                fontSize: '14px',
                fontWeight: isActive ? '600' : '500',
                color: isCompleted || isActive ? '#0F172A' : '#94A3B8',
              }}>
                {step}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div style={styles.connector(isCompleted)}></div>
            )}
          </div>
        );
      })}
      <style>{`
        @media (max-width: 640px) {
          .step-label { display: none !important; }
        }
      `}</style>
    </div>
  );
};

export default StepIndicator;
