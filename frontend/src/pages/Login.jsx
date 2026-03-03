import React from 'react';

const Login = () => {
    const googleLogin = () => {
        window.location.href = 'http://localhost:8081/oauth2/authorization/google';
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
            <h1>Login</h1>
            <button 
                onClick={googleLogin}
                style={{
                    padding: '10px 20px',
                    fontSize: '16px',
                    backgroundColor: '#4285F4',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer'
                }}
            >
                Login with Google
            </button>
        </div>
    );
};

export default Login;
