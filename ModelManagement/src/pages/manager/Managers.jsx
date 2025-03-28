// src/pages/manager/Managers.jsx
import { useState, useEffect } from 'react';
import { managerService } from '../../services/api';

const Managers = () => {
    const [managers, setManagers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: ''
    });

    // Load managers when component mounts
    useEffect(() => {
        const fetchManagers = async () => {
            try {
                // You would need to add this method to your managerService
                const response = await managerService.getManagers();
                setManagers(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to load managers: ' + (err.message || 'Unknown error'));
                setLoading(false);
            }
        };

        fetchManagers();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Call the API to create a new manager
            const response = await managerService.createManager(formData);

            // Add the new manager to the list
            setManagers([...managers, response.data]);

            // Reset the form
            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                password: ''
            });

        } catch (err) {
            setError('Failed to create manager: ' + (err.message || 'Unknown error'));
        }
    };

    return (
        <div className="managers-page">
            <h1>Managers</h1>

            {/* Create Manager Form */}
            <div className="create-manager-form">
                <h2>Create New Manager</h2>
                {error && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="firstName">First Name</label>
                        <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="lastName">Last Name</label>
                        <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button type="submit">Create Manager</button>
                </form>
            </div>

            {/* Managers List */}
            <div className="managers-list">
                <h2>Managers List</h2>
                {loading ? (
                    <p>Loading...</p>
                ) : error ? (
                    <p className="error">{error}</p>
                ) : (
                    <div className="managers-grid">
                        {managers.length === 0 ? (
                            <p>No managers available.</p>
                        ) : (
                            managers.map((manager) => (
                                <div key={manager.id} className="manager-card">
                                    <h3>{manager.firstName} {manager.lastName}</h3>
                                    <p>Email: {manager.email}</p>
                                    {/* Add more details or actions as needed */}
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Managers;