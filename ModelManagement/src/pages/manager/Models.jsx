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

    // Load models when component mounts
    useEffect(() => {
        const fetchModels = async () => {
            try {
                // You would need to add this method to your managerService
                const response = await managerService.getModels();
                setModels(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to load models: ' + (err.message || 'Unknown error'));
                setLoading(false);
            }
        };

        fetchModels();
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
            // Call the API to create a new model
            const response = await managerService.createModel(formData);

            // Add the new model to the list
            setModels([...models, response.data]);

            // Reset the form
            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                password: '',
                phoneNo: ''
            });

        } catch (err) {
            setError('Failed to create model: ' + (err.message || 'Unknown error'));
        }
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

            {/* Models List */}
            <div className="models-list">
                <h2>Models List</h2>
                {loading ? (
                    <p>Loading...</p>
                ) : error ? (
                    <p className="error">{error}</p>
                ) : (
                    <div className="models-grid">
                        {models.length === 0 ? (
                            <p>No models available.</p>
                        ) : (
                            models.map((model) => (
                                <div key={model.id} className="model-card">
                                    <h3>{model.firstName} {model.lastName}</h3>
                                    <p>Email: {model.email}</p>
                                    <p>Phone: {model.phoneNo}</p>
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

export default Models;