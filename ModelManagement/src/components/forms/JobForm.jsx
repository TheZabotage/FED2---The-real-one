import { useState } from 'react';
import PropTypes from 'prop-types';

const JobForm = ({
    initialData = {
        customer: '',
        startDate: '',
        days: '',
        location: '',
        comments: ''
    },
    onSubmit,
    submitButtonText = 'Create Job',
    isLoading = false,
    onCancel = null
}) => {
    const [formData, setFormData] = useState({
        customer: initialData.customer || '',
        startDate: initialData.startDate || '',
        days: initialData.days || '',
        location: initialData.location || '',
        comments: initialData.comments || ''
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
            // Only reset form if there's no initialData (creating vs editing)
            if (!initialData.customer) {
                setFormData({
                    customer: '',
                    startDate: '',
                    days: '',
                    location: '',
                    comments: ''
                });
            }
            setError('');
        } catch (err) {
            setError('Error: ' + (err.message || err.toString() || 'Unknown error'));
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

                <div className="form-buttons">
                    <button type="submit" className="btn submit-button" disabled={isLoading}>
                        {isLoading ? 'Processing...' : submitButtonText}
                    </button>

                    {onCancel && (
                        <button
                            type="button"
                            className="btn cancel-button"
                            onClick={onCancel}
                            disabled={isLoading}
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </form>

            <p className="form-note">* Required fields</p>
        </div>
    );
};

JobForm.propTypes = {
    initialData: PropTypes.shape({
        customer: PropTypes.string,
        startDate: PropTypes.string,
        days: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        location: PropTypes.string,
        comments: PropTypes.string
    }),
    onSubmit: PropTypes.func.isRequired,
    submitButtonText: PropTypes.string,
    isLoading: PropTypes.bool,
    onCancel: PropTypes.func
};

export default JobForm;