import React from 'react';
import RoleBadge from './RoleBadge';

const UserTable = ({ users, showActions, onAssignRole, onRemoveRole, onDelete }) => {
  const styles = {
    container: {
      backgroundColor: '#FFFFFF',
      borderRadius: '12px',
      border: '1px solid #E2E8F0',
      overflow: 'hidden',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
    },
    th: {
      backgroundColor: '#F8FAFC',
      padding: '12px 16px',
      textAlign: 'left',
      fontSize: '12px',
      fontWeight: '600',
      color: '#64748B',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      borderBottom: '1px solid #E2E8F0',
    },
    td: {
      padding: '16px',
      borderBottom: '1px solid #E2E8F0',
      fontSize: '14px',
      color: '#0F172A',
    },
    userCell: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    avatar: {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      backgroundColor: '#E2E8F0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '14px',
      fontWeight: '600',
      color: '#64748B',
      overflow: 'hidden',
    },
    avatarImg: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
    },
    userName: {
      fontWeight: '500',
      color: '#0F172A',
    },
    userEmail: {
      fontSize: '12px',
      color: '#64748B',
    },
    actions: {
      display: 'flex',
      gap: '8px',
    },
    button: {
      padding: '6px 12px',
      borderRadius: '6px',
      fontSize: '12px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      border: 'none',
    },
    assignBtn: {
      backgroundColor: '#DBEAFE',
      color: '#2563EB',
    },
    removeBtn: {
      backgroundColor: '#FEF3C7',
      color: '#D97706',
    },
    deleteBtn: {
      backgroundColor: '#FEE2E2',
      color: '#DC2626',
    },
    emptyState: {
      padding: '48px',
      textAlign: 'center',
      color: '#64748B',
    },
    statusOnline: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      fontSize: '12px',
      color: '#10B981',
    },
    statusOffline: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      fontSize: '12px',
      color: '#64748B',
    },
    dot: {
      width: '8px',
      height: '8px',
      borderRadius: '50%',
    },
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (!users || users.length === 0) {
    return (
      <div style={styles.container}>
        <div style={styles.emptyState}>
          <p>No users found</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>User</th>
            <th style={styles.th}>Email</th>
            <th style={styles.th}>Role</th>
            <th style={styles.th}>Status</th>
            <th style={styles.th}>Joined</th>
            {showActions && <th style={styles.th}>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td style={styles.td}>
                <div style={styles.userCell}>
                  <div style={styles.avatar}>
                    {user.picture ? (
                      <img src={user.picture} alt={user.name} style={styles.avatarImg} />
                    ) : (
                      getInitials(user.name)
                    )}
                  </div>
                  <span style={styles.userName}>{user.name}</span>
                </div>
              </td>
              <td style={styles.td}>{user.email}</td>
              <td style={styles.td}>
                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                  {user.roles?.map((role) => (
                    <RoleBadge key={role} role={role} />
                  ))}
                </div>
              </td>
              <td style={styles.td}>
                {user.enabled ? (
                  <span style={styles.statusOnline}>
                    <span style={{ ...styles.dot, backgroundColor: '#10B981' }}></span>
                    Active
                  </span>
                ) : (
                  <span style={styles.statusOffline}>
                    <span style={{ ...styles.dot, backgroundColor: '#94A3B8' }}></span>
                    Inactive
                  </span>
                )}
              </td>
              <td style={styles.td}>{formatDate(user.createdAt)}</td>
              {showActions && (
                <td style={styles.td}>
                  <div style={styles.actions}>
                    <button
                      style={{ ...styles.button, ...styles.assignBtn }}
                      onClick={() => onAssignRole && onAssignRole(user)}
                    >
                      Assign Role
                    </button>
                    <button
                      style={{ ...styles.button, ...styles.removeBtn }}
                      onClick={() => onRemoveRole && onRemoveRole(user)}
                    >
                      Remove Role
                    </button>
                    <button
                      style={{ ...styles.button, ...styles.deleteBtn }}
                      onClick={() => onDelete && onDelete(user)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
