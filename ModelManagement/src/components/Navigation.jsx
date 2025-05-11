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

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <div className="logo">
                    <Link to="/">
                        <span className="logo-icon">💼</span>
                        Model Management
                    </Link>
                </div>

                {/* Mobile menu toggle */}
                <button
                    className="mobile-menu-toggle"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    aria-label="Toggle menu"
                >
                    <span className="hamburger-icon"></span>
                </button>

                {/* Navigation links - desktop and mobile */}
                <div className={`nav-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
                    {currentUser ? (
                        <>
                            <Link
                                to="/dashboard"
                                className={isActive('/dashboard') ? 'active' : ''}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Dashboard
                            </Link>

                            {currentUser.isManager && (
                                <>
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