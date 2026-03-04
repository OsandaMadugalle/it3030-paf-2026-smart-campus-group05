import React, { useState, useEffect } from 'react';
import api from '../services/api';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  const ROLES = ['ROLE_USER', 'ROLE_MODERATOR', 'ROLE_ADMIN'];

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/admin/users');
      setUsers(response.data);
    } catch (err) {
      setError('Failed to fetch users');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignRole = async (userId, role) => {
    setActionLoading(`assign-${userId}-${role}`);
    try {
      await api.post('/admin/roles/assign', { userId, role });
      await fetchUsers();
    } catch (err) {
      alert('Failed to assign role: ' + (err.response?.data?.message || err.message));
    } finally {
      setActionLoading(null);
    }
  };

  const handleRemoveRole = async (userId, role) => {
    setActionLoading(`remove-${userId}-${role}`);
    try {
      await api.post('/admin/roles/remove', { userId, role });
      await fetchUsers();
    } catch (err) {
      alert('Failed to remove role: ' + (err.response?.data?.message || err.message));
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to delete user "${userName}"?`)) {
      return;
    }
    setActionLoading(`delete-${userId}`);
    try {
      await api.delete(`/admin/users/${userId}`);
      await fetchUsers();
    } catch (err) {
      alert('Failed to delete user: ' + (err.response?.data?.message || err.message));
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) return <div style={{ padding: '20px' }}>Loading...</div>;
  if (error) return <div style={{ padding: '20px', color: 'red' }}>{error}</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Admin Dashboard</h1>
      <p style={{ color: '#666' }}>Manage users and their roles</p>

      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr style={{ backgroundColor: '#f8f9fa' }}>
            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>User</th>
            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Email</th>
            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Current Roles</th>
            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Manage Roles</th>
            <th style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid #dee2e6' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} style={{ borderBottom: '1px solid #dee2e6' }}>
              <td style={{ padding: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {user.avatarUrl && (
                    <img 
                      src={user.avatarUrl} 
                      alt={user.name} 
                      style={{ width: '40px', height: '40px', borderRadius: '50%' }}
                    />
                  )}
                  <span>{user.name}</span>
                </div>
              </td>
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
              <td style={{ padding: '12px' }}>
                <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                  {ROLES.map((role) => {
                    const hasRole = user.roles.includes(role);
                    const isLoading = actionLoading === `${hasRole ? 'remove' : 'assign'}-${user.id}-${role}`;
                    return (
                      <button
                        key={role}
                        onClick={() => hasRole 
                          ? handleRemoveRole(user.id, role) 
                          : handleAssignRole(user.id, role)
                        }
                        disabled={isLoading}
                        style={{
                          padding: '4px 8px',
                          fontSize: '11px',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: isLoading ? 'not-allowed' : 'pointer',
                          backgroundColor: hasRole ? '#dc3545' : '#28a745',
                          color: '#fff',
                          opacity: isLoading ? 0.7 : 1
                        }}
                      >
                        {isLoading ? '...' : (hasRole ? `- ${role.replace('ROLE_', '')}` : `+ ${role.replace('ROLE_', '')}`)}
                      </button>
                    );
                  })}
                </div>
              </td>
              <td style={{ padding: '12px', textAlign: 'center' }}>
                <button
                  onClick={() => handleDeleteUser(user.id, user.name)}
                  disabled={actionLoading === `delete-${user.id}`}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: '#dc3545',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: actionLoading === `delete-${user.id}` ? 'not-allowed' : 'pointer',
                    opacity: actionLoading === `delete-${user.id}` ? 0.7 : 1
                  }}
                >
                  {actionLoading === `delete-${user.id}` ? 'Deleting...' : 'Delete'}
                </button>
              </td>
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

export default AdminDashboard;
