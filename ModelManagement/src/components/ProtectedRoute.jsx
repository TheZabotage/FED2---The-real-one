import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/AuthContext';

export const ProtectedRoute = ({ children, requiredRole }) => {
    const { currentUser, isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    if (requiredRole === 'manager' && !currentUser.isManager) {
        return <Navigate to="/unauthorized" />;
    }

    return children;
};