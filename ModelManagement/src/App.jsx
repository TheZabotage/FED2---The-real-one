// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthProvider from './contexts/AuthProvider';  // Updated import
import { ProtectedRoute } from './components/ProtectedRoute';
import Navigation from './components/Navigation';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Models from './pages/manager/Models';
import Managers from './pages/manager/Managers';
import Jobs from './pages/manager/Jobs';
import MyJobs from './pages/model/MyJobs';
import Unauthorized from './pages/Unauthorized';

function App() {
    return (
        <Router>
            <AuthProvider>
                <div className="app-container">
                    <Navigation />
                    <main className="main-content">
                        <Routes>
                            <Route path="/login" element={<Login />} />
                            <Route path="/unauthorized" element={<Unauthorized />} />

                            {/* Protected routes for both roles */}
                            <Route
                                path="/dashboard"
                                element={
                                    <ProtectedRoute>
                                        <Dashboard />
                                    </ProtectedRoute>
                                }
                            />

                            {/* Manager-only routes */}
                            <Route
                                path="/models"
                                element={
                                    <ProtectedRoute requiredRole="manager">
                                        <Models />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/managers"
                                element={
                                    <ProtectedRoute requiredRole="manager">
                                        <Managers />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/jobs"
                                element={
                                    <ProtectedRoute requiredRole="manager">
                                        <Jobs />
                                    </ProtectedRoute>
                                }
                            />

                            {/* Model-only routes */}
                            <Route
                                path="/my-jobs"
                                element={
                                    <ProtectedRoute>
                                        <MyJobs />
                                    </ProtectedRoute>
                                }
                            />

                            {/* Redirect to dashboard if logged in, otherwise to login */}
                            <Route
                                path="/"
                                element={<Navigate to="/dashboard" />}
                            />
                        </Routes>
                    </main>
                </div>
            </AuthProvider>
        </Router>
    );
}

export default App;