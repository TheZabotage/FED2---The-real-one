// src/contexts/AuthProvider.jsx
import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { authService } from '../services/api';
import AuthContext from './AuthContext';

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                // Check if token is expired
                if (decoded.exp * 1000 < Date.now()) {
                    localStorage.removeItem('token');
                    setCurrentUser(null);
                } else {
                    setCurrentUser({
                        email: decoded.email,
                        isManager: decoded.role === 'manager',
                        modelId: decoded.modelId // Only for models
                    });
                }
            } catch {
                localStorage.removeItem('token');
                setCurrentUser(null);
            }
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const data = await authService.login(email, password);
            const decoded = jwtDecode(data.jwt);
            setCurrentUser({
                email: decoded.email,
                isManager: decoded.role === 'manager',
                modelId: decoded.modelId // Only for models
            });
            return true;
        } catch {
            return false;
        }
    };

    const logout = () => {
        authService.logout();
        setCurrentUser(null);
    };

    const value = {
        currentUser,
        login,
        logout,
        isAuthenticated: !!currentUser
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;