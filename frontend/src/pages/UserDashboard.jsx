import React, { useState, useEffect } from 'react';
import { useRole } from '../hooks/useRole';
import api from '../services/api';

const UserDashboard = () => {
  const { getUserInfo, roles } = useRole();
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userInfo = getUserInfo();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await api.get('/user/me');
        setUserDetails(response.data);
      } catch (err) {
        setError('Failed to fetch user details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  if (loading) return <div style={{ padding: '20px' }}>Loading...</div>;
  if (error) return <div style={{ padding: '20px', color: 'red' }}>{error}</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>User Dashboard</h1>
      
      <div style={{ 
        backgroundColor: '#f8f9fa', 
        padding: '20px', 
        borderRadius: '8px',
        marginTop: '20px'
      }}>
        <h2>My Profile</h2>
        
        {userDetails?.avatarUrl && (
          <img 
            src={userDetails.avatarUrl} 
            alt="Avatar" 
            style={{ 
              width: '80px', 
              height: '80px', 
              borderRadius: '50%',
              marginBottom: '15px'
            }}
          />
        )}
        
        <div style={{ marginBottom: '10px' }}>
          <strong>Name:</strong> {userDetails?.name || userInfo?.name}
        </div>
        
        <div style={{ marginBottom: '10px' }}>
          <strong>Email:</strong> {userDetails?.email || userInfo?.email}
        </div>
        
        <div style={{ marginBottom: '10px' }}>
          <strong>Provider:</strong> {userDetails?.provider}
        </div>
        
        <div style={{ marginBottom: '10px' }}>
          <strong>My Roles:</strong>
          <div style={{ marginTop: '5px' }}>
            {(userDetails?.roles || roles).map((role, index) => (
              <span 
                key={index}
                style={{
                  display: 'inline-block',
                  backgroundColor: role === 'ROLE_ADMIN' ? '#dc3545' : 
                                   role === 'ROLE_MODERATOR' ? '#ffc107' : '#28a745',
                  color: role === 'ROLE_MODERATOR' ? '#000' : '#fff',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  marginRight: '8px',
                  fontSize: '14px'
                }}
              >
                {role.replace('ROLE_', '')}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
