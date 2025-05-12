import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const Navigation = () => {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Check if a path is active
    const isActive = (path) => {
        return location.pathname === path;
    };
    // Handle logo click based on user role
    const handleLogoClick = (e) => {
        if (!currentUser) return;

        if (currentUser.isManager) {
            // Manager goes to dashboard
            navigate('/dashboard');
        } else {
            // Model behavior - do nothing
            navigate('/my-jobs');

        }
    };


    return (
        <nav className="navbar">
            <div className="navbar-container">
                <div className="logo">
                    <Link to={currentUser?.isManager ? "/" : "#"} onClick={handleLogoClick}>
                        <span className="logo-icon"></span>
                        Model Management
                        
                    </Link>
                </div>

                {/* Navigation links - desktop */}
                <div className={`nav-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
                    {currentUser ? (
                        <>

                            {currentUser.isManager && (
                                <>

                                    <Link
                                        to="/dashboard"
                                        className={isActive('/dashboard') ? 'active' : ''}
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Dashboard
                                    </Link>
                                    <Link
                                        to="/models"
                                        className={isActive('/models') ? 'active' : ''}
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Models
                                    </Link>
                                    <Link
                                        to="/managers"
                                        className={isActive('/managers') ? 'active' : ''}
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Managers
                                    </Link>
                                    <Link
                                        to="/jobs"
                                        className={isActive('/jobs') ? 'active' : ''}
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Jobs
                                    </Link>
                                </>
                            )}

                            {!currentUser.isManager && (
                                <Link
                                    to="/my-jobs"
                                    className={isActive('/my-jobs') ? 'active' : ''}
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    My Jobs
                                </Link>
                            )}

                            <button
                                onClick={() => {
                                    handleLogout();
                                    setMobileMenuOpen(false);
                                }}
                                className="logout-button"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <Link
                            to="/login"
                            className={isActive('/login') ? 'active' : ''}
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Login
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navigation;