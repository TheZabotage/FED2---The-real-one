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

                // Extract the values based on the actual token structure
                const email = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"];
                const role = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
                const modelId = decoded["ModelId"];

                console.log("Decoded token:", decoded);
                console.log("Role from token:", role);
                console.log("isManager check:", role === "Manager");

                // Check if token is expired
                if (decoded.exp * 1000 < Date.now()) {
                    localStorage.removeItem('token');
                    setCurrentUser(null);
                } else {
                    setCurrentUser({
                        email: email,
                        // Compare the exact string value to determine if user is a manager
                        isManager: role === "Manager",
                        modelId: modelId !== "-1" ? modelId : null
                    });
                }
            } catch (error) {
                console.error("Token decode error:", error);
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

            console.log("Decoded token:", decoded);

            // Extract the values based on the actual token structure, used because when loggin in as manager, you would appear as model
            const userEmail = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"];
            const role = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
            const modelId = decoded["ModelId"];
            const loginname = decoded["firstName"];

            console.log("Name: ,", loginname);
            console.log("Email from token:", userEmail);
            console.log("Role from token:", role);
            console.log("isManager check:", role === "Manager");

            setCurrentUser({
                email: userEmail,
                isManager: role === "Manager", // Using the same check as in useEffect
                modelId: modelId !== "-1" ? modelId : null,
                firstName: loginname
            });

            return true;
        } catch (err) {
            console.error("Login error:", err);
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