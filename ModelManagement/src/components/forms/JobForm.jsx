// src/components/forms/JobForm.jsx
import { useState } from 'react';

const JobForm = ({ onSubmit }) => {
    const [formData, setFormData] = useState({
        customer: '',
        startDate: '',
        days: '',
        location: '',
        comments: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation
        if (!formData.customer || !formData.startDate || !formData.days || !formData.location) {
            setError('Please fill in all required fields');
            return;
        }

        try {
            await onSubmit(formData);
            // Reset form after successful submission
            setFormData({
                customer: '',
                startDate: '',
                days: '',
                location: '',
                comments: ''
            });
            setError('');
        } catch (err) {
            setError('Error creating job: ' + (err.message || 'Unknown error'));
        }
    };

    return (
        <div className="job-form">
            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="customer">Customer*</label>
                    <input
                        type="text"
                        id="customer"
                        name="customer"
                        value={formData.customer}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="startDate">Start Date*</label>
                    <input
                        type="date"
                        id="startDate"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="days">Number of Days*</label>
                    <input
                        type="number"
                        id="days"
                        name="days"
                        min="1"
                        value={formData.days}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="location">Location*</label>
                    <input
                        type="text"
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="comments">Comments</label>
                    <textarea
                        id="comments"
                        name="comments"
                        value={formData.comments}
                        onChange={handleChange}
                        rows="3"
                    />
                </div>

                <button type="submit" className="submit-button">Create Job</button>
            </form>

            <p className="form-note">* Required fields</p>
        </div>
    );
};

export default JobForm;