// src/components/forms/ExpenseForm.jsx
import { useState } from 'react';
import PropTypes from 'prop-types';
import FormField from './FormField';

const ExpenseForm = ({
    onSubmit,
    onCancel,
    isLoading = false,
    jobId,
    job = null,
    initialData = null
}) => {
    const today = new Date().toISOString().split('T')[0];

    const [formData, setFormData] = useState({
        amount: initialData?.amount || '',
        text: initialData?.text || '',
        date: initialData?.date ? new Date(initialData.date).toISOString().split('T')[0] : today
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
        if (!formData.amount || !formData.text || !formData.date) {
            setError('Please fill in all required fields');
            return;
        }

        // Validate amount is a positive number
        const amount = parseFloat(formData.amount);
        if (isNaN(amount) || amount <= 0) {
            setError('Amount must be a positive number');
            return;
        }

        try {
            // Format expense data for API
            const expenseData = {
                amount: amount,
                text: formData.text,
                date: new Date(formData.date).toISOString()
            };

            await onSubmit(expenseData);

            // Reset form on success
            setFormData({
                amount: '',
                text: '',
                date: today
            });
            setError('');
        } catch (err) {
            setError('Error: ' + (err.message || err.toString() || 'Unknown error'));
        }
    };

    return (
        <div className="expense-form">
            {error && <div className="error-message">{error}</div>}

            {job && (
                <div className="expense-form-job-info">
                    <p>Adding expense for job: <strong>{job.customer}</strong></p>
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="form-row">
                    <FormField
                        type="number"
                        id="amount"
                        name="amount"
                        label="Amount ($)*"
                        value={formData.amount}
                        onChange={handleChange}
                        min="0.01"
                        step="0.01"
                        placeholder="0.00"
                        required
                    />

                    <FormField
                        type="date"
                        id="date"
                        name="date"
                        label="Date*"
                        value={formData.date}
                        onChange={handleChange}
                        required
                    />
                </div>

                <FormField
                    type="text"
                    id="text"
                    name="text"
                    label="Description*"
                    value={formData.text}
                    onChange={handleChange}
                    placeholder="What is this expense for?"
                    required
                />

                <div className="form-buttons">
                    <button type="submit" className="btn btn-primary" disabled={isLoading}>
                        {isLoading ? 'Saving...' : 'Add Expense'}
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

ExpenseForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func,
    isLoading: PropTypes.bool,
    jobId: PropTypes.string.isRequired,
    job: PropTypes.shape({
        jobId: PropTypes.string.isRequired,
        customer: PropTypes.string.isRequired
    }),
    initialData: PropTypes.shape({
        amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        text: PropTypes.string,
        date: PropTypes.string
    })
};

export default ExpenseForm;