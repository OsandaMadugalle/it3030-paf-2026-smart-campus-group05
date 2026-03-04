import React from 'react';
import { Link } from 'react-router-dom';

const Unauthorized = () => {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '100vh',
      textAlign: 'center',
      padding: '20px'
    }}>
      <h1 style={{ fontSize: '4rem', color: '#dc3545', marginBottom: '10px' }}>403</h1>
      <h2 style={{ marginBottom: '20px' }}>Access Denied</h2>
      <p style={{ color: '#666', marginBottom: '30px' }}>
        You don't have permission to access this page.
      </p>
      <Link 
        to="/dashboard/user" 
        style={{
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '5px'
        }}
      >
        Go to Dashboard
      </Link>
    </div>
  );
};

export default Unauthorized;
