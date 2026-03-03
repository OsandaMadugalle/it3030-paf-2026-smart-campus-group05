import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!user) return null;

    return (
        <div style={{ padding: '20px' }}>
            <h1>Dashboard</h1>
            <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '10px', maxWidth: '400px' }}>
                <img 
                    src={user.avatarUrl || 'https://via.placeholder.com/150'} 
                    alt="Avatar" 
                    style={{ borderRadius: '50%', width: '100px', height: '100px' }} 
                />
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Roles:</strong> {user.roles?.join(', ')}</p>
                <p><strong>Provider:</strong> {user.provider}</p>
                <button 
                    onClick={handleLogout}
                    style={{
                        padding: '10px 20px',
                        marginTop: '10px',
                        backgroundColor: '#f44336',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer'
                    }}
                >
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Dashboard;
