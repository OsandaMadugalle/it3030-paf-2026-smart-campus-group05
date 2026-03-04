import React, { useState, useEffect } from 'react';
import api from '../services/api';

const ModeratorDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/moderator/users');
        setUsers(response.data);
      } catch (err) {
        setError('Failed to fetch users');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <div style={{ padding: '20px' }}>Loading...</div>;
  if (error) return <div style={{ padding: '20px', color: 'red' }}>{error}</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <h1>Moderator Dashboard</h1>
      <p style={{ color: '#666' }}>View all registered users (read-only)</p>

      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr style={{ backgroundColor: '#f8f9fa' }}>
            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Avatar</th>
            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Name</th>
            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Email</th>
            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Roles</th>
            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Provider</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} style={{ borderBottom: '1px solid #dee2e6' }}>
              <td style={{ padding: '12px' }}>
                {user.avatarUrl && (
                  <img 
                    src={user.avatarUrl} 
                    alt={user.name} 
                    style={{ width: '40px', height: '40px', borderRadius: '50%' }}
                  />
                )}
              </td>
              <td style={{ padding: '12px' }}>{user.name}</td>
              <td style={{ padding: '12px' }}>{user.email}</td>
              <td style={{ padding: '12px' }}>
                {user.roles.map((role, index) => (
                  <span 
                    key={index}
                    style={{
                      display: 'inline-block',
                      backgroundColor: role === 'ROLE_ADMIN' ? '#dc3545' : 
                                       role === 'ROLE_MODERATOR' ? '#ffc107' : '#28a745',
                      color: role === 'ROLE_MODERATOR' ? '#000' : '#fff',
                      padding: '2px 8px',
                      borderRadius: '12px',
                      marginRight: '4px',
                      fontSize: '12px'
                    }}
                  >
                    {role.replace('ROLE_', '')}
                  </span>
                ))}
              </td>
              <td style={{ padding: '12px' }}>{user.provider}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {users.length === 0 && (
        <p style={{ textAlign: 'center', padding: '20px', color: '#666' }}>No users found</p>
      )}
    </div>
  );
};

export default ModeratorDashboard;
