import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const OAuth2RedirectHandler = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { login } = useAuth();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');

        if (token) {
            // Save token and fetch user info
            localStorage.setItem('token', token);
            
            api.get('/user/me')
                .then(response => {
                    login(response.data, token);
                    navigate('/dashboard');
                })
                .catch(error => {
                    console.error("Authentication failed", error);
                    navigate('/login?error=true');
                });
        } else {
            navigate('/login?error=true');
        }
    }, [location, navigate, login]);

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <h2>Authenticating...</h2>
        </div>
    );
};

export default OAuth2RedirectHandler;
