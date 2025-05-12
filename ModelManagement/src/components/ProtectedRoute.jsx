// src/components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

export const ProtectedRoute = ({ children, requiredRole }) => {
    const { currentUser, isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    if (requiredRole === 'Manager' && !currentUser.isManager) {
        console.log("Unauthorized access attempt by non-manager user.");
        return <Navigate to="/unauthorized" />;
    }

    if (requiredRole === 'Manager' && !currentUser.isManager) {
        console.log("Unauthorized access attempt by non-manager user.");
        return <Navigate to="/my-jobs" />;
    }


    return children;
};