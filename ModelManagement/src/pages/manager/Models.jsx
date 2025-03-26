// src/pages/manager/Models.jsx
import { useState, useEffect } from 'react';
import { managerService } from '../../services/api';

const Models = () => {
    const [models, setModels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        phoneNo: ''
    });

    // Placeholder for now - we'll implement the actual API call
    useEffect(() => {
        // Load models
        setLoading(false);
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
        // Add model creation logic
    };

    return (
        <div className="models-page">
            <h1>Models</h1>

            {/* Create Model Form */}
            <div className="create-model-form">
                <h2>Create New Model</h2>
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

                    <div className="form-group">
                        <label htmlFor="phoneNo">Phone Number</label>
                        <input
                            type="text"
                            id="phoneNo"
                            name="phoneNo"
                            value={formData.phoneNo}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button type="submit">Create Model</button>
                </form>
            </div>

            {/* Models List - We'll implement this later */}
            <div className="models-list">
                <h2>Models List</h2>
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <div className="models-grid">
                        {/* List models here */}
                        <p>Model list will be displayed here.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Models;