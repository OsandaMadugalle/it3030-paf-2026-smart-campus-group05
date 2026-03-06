import React from 'react';

const RoleBadge = ({ role }) => {
  const getBadgeStyle = () => {
    const baseStyle = {
      padding: '4px 12px',
      borderRadius: '16px',
      fontSize: '12px',
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    };

    switch (role) {
      case 'ROLE_ADMIN':
        return { ...baseStyle, backgroundColor: '#FEE2E2', color: '#DC2626' };
      case 'ROLE_MODERATOR':
        return { ...baseStyle, backgroundColor: '#FEF3C7', color: '#D97706' };
      case 'ROLE_USER':
      default:
        return { ...baseStyle, backgroundColor: '#DBEAFE', color: '#2563EB' };
    }
  };

  const formatRole = (role) => {
    return role.replace('ROLE_', '');
  };

  return (
    <span style={getBadgeStyle()}>
      {formatRole(role)}
    </span>
  );
};

export default RoleBadge;
