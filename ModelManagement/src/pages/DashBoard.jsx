import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { managerService, modelService } from '../services/api';

const Dashboard = () => {
    const { currentUser } = useAuth();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [stats, setStats] = useState({
        totalModels: 0,
        totalJobs: 0,
        activeJobs: 0,
        recentJobs: []
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                await fetchManagerData();
            } catch (err) {
                console.error("Dashboard error:", err);
                setError('Failed to load dashboard data: ' + (err.message || 'Unknown error'));
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const fetchManagerData = async () => {
        try {
            // Fetch models
            const modelsResponse = await managerService.getModels();

            // Fetch all jobs
            const jobsResponse = await managerService.getAllJobs();
            const jobs = jobsResponse.data;

            // Calculate active jobs (starting from today or in the future)
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const activeJobs = jobs.filter(job => {
                const startDate = new Date(job.startDate);
                startDate.setHours(0, 0, 0, 0);

                // End date is start date + days
                const endDate = new Date(startDate);
                endDate.setDate(endDate.getDate() + parseInt(job.days));

                return endDate >= today;
            });

            // Get most recent jobs
            const recentJobs = [...jobs]
                .sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
                .slice(0, 5);

            setStats({
                totalModels: modelsResponse.data.length,
                totalJobs: jobs.length,
                activeJobs: activeJobs.length,
                recentJobs
            });
        } catch (err) {
            console.error("Error fetching manager data:", err);
            throw err;
        }
    };

    // Format date for display
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString();
    };

    return (
        <div className="dashboard-page">
            <div className="page-header">
                <h1>Dashboard</h1>
            </div>

            {error && <div className="error-message">{error}</div>}

            {loading ? (
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                </div>
            ) : (
                <div className="dashboard-content">
                    <div className="welcome-section">
                        <h2>Welcome back, {currentUser.email}</h2>
                        <p className="page-description">
                            Here's an overview of your model management agency's current status.
                        </p>
                    </div>

                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-icon">👤</div>
                            <div className="stat-value">{stats.totalModels}</div>
                            <div className="stat-label">TOTAL MODELS</div>
                            <Link to="/models" className="btn btn-primary" style={{ marginTop: '15px' }}>
                                Manage Models
                            </Link>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon">💼</div>
                            <div className="stat-value">{stats.totalJobs}</div>
                            <div className="stat-label">TOTAL JOBS</div>
                            <Link to="/jobs" className="btn btn-primary" style={{ marginTop: '15px' }}>
                                Manage Jobs
                            </Link>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon">🗓️</div>
                            <div className="stat-value">{stats.activeJobs}</div>
                            <div className="stat-label">ACTIVE JOBS</div>
                            <Link to="/jobs" className="btn btn-primary" style={{ marginTop: '15px' }}>
                                View Active Jobs
                            </Link>
                        </div>
                    </div>

                    <div className="recent-jobs-section">
                        <h2>Recent Jobs</h2>

                        {stats.recentJobs.length === 0 ? (
                            <div className="empty-state">
                                <div className="empty-state-icon">📅</div>
                                <h3 className="empty-state-title">No jobs yet</h3>
                                <p className="empty-state-description">
                                    You haven't created any jobs yet. Create your first job to get started.
                                </p>
                                <Link to="/jobs" className="btn btn-primary">
                                    Create Job
                                </Link>
                            </div>
                        ) : (
                            <div className="recent-jobs-container">
                                <table className="recent-jobs-table">
                                    <thead>
                                        <tr>
                                            <th>Customer</th>
                                            <th>Location</th>
                                            <th>Start Date</th>
                                            <th>Duration</th>
                                            <th>Models</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {stats.recentJobs.map(job => (
                                            <tr key={job.jobId}>
                                                <td>{job.customer}</td>
                                                <td>{job.location}</td>
                                                <td>{formatDate(job.startDate)}</td>
                                                <td>{job.days} days</td>
                                                <td>{job.models?.length || 0}</td>
                                                <td>
                                                    <Link to={`/jobs?id=${job.jobId}`} className="view-button">
                                                        View
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        <div style={{ textAlign: 'center', marginTop: '20px' }}>
                            <Link to="/jobs" className="btn btn-primary">
                                View All Jobs
                            </Link>
                        </div>
                    </div>

                    <div className="quick-actions-section">
                        <h2>Quick Actions</h2>
                        <div className="actions-grid">
                            <Link to="/models" className="action-card">
                                <div className="action-icon">➕</div>
                                <div className="action-title">Add New Model</div>
                            </Link>

                            <Link to="/jobs" className="action-card">
                                <div className="action-icon">📝</div>
                                <div className="action-title">Create New Job</div>
                            </Link>

                            <Link to="/managers" className="action-card">
                                <div className="action-icon">👥</div>
                                <div className="action-title">Manage Team</div>
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;