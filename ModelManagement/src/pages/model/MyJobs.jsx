// src/pages/model/MyJobs.jsx
import { useState, useEffect, useCallback } from 'react';
import { modelService } from '../../services/api';
import useAuth from '../../hooks/useAuth';

const MyJobs = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedJobId, setSelectedJobId] = useState(null);
    const [expenseForm, setExpenseForm] = useState({
        amount: '',
        text: '', // Changed from 'description' to match backend schema
        date: new Date().toISOString().split('T')[0] // Adding date field required by API
    });
    const { currentUser } = useAuth();

    // Use useCallback to memoize the fetchMyJobs function
    const fetchMyJobs = useCallback(async () => {
        if (!currentUser || !currentUser.modelId) return;

        try {
            // Pass the model ID from the current user
            const response = await modelService.getMyJobs(currentUser.modelId);
            setJobs(response.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to load jobs: ' + (err.message || 'Unknown error'));
            setLoading(false);
        }
    }, [currentUser]);

    // Now include fetchMyJobs in the dependency array
    useEffect(() => {
        fetchMyJobs();
    }, [fetchMyJobs]);

    const handleExpenseChange = (e) => {
        const { name, value } = e.target;
        setExpenseForm({
            ...expenseForm,
            [name]: value
        });
    };

    const handleAddExpense = async (e) => {
        e.preventDefault();
        if (!selectedJobId) return;

        try {
            // Format expense data according to the API schema
            const expenseData = {
                modelId: currentUser.modelId,
                jobId: selectedJobId,
                date: expenseForm.date,
                text: expenseForm.text,
                amount: parseFloat(expenseForm.amount)
            };

            // Use the correct endpoint to add expense
            await modelService.addExpense(expenseData);

            // Reset form and refresh jobs to show new expense
            setExpenseForm({
                amount: '',
                text: '',
                date: new Date().toISOString().split('T')[0]
            });
            setSelectedJobId(null);

            // Refresh jobs to show updated expenses
            await fetchMyJobs();
        } catch (err) {
            setError('Failed to add expense: ' + (err.message || 'Unknown error'));
        }
    };

    return (
        <div className="my-jobs-page">
            <h1>My Jobs</h1>

            {error && <div className="error-message">{error}</div>}

            {loading ? (
                <p>Loading your jobs...</p>
            ) : jobs.length === 0 ? (
                <p>You don't have any assigned jobs yet.</p>
            ) : (
                <div className="jobs-container">
                    {jobs.map(job => (
                        <div key={job.jobId} className="job-card">
                            <h3>{job.customer}</h3>
                            <p><strong>Start Date:</strong> {new Date(job.startDate).toLocaleDateString()}</p>
                            <p><strong>Duration:</strong> {job.days} days</p>
                            <p><strong>Location:</strong> {job.location}</p>
                            {job.comments && <p><strong>Comments:</strong> {job.comments}</p>}

                            <div className="job-expenses">
                                <h4>Expenses</h4>
                                {job.expenses && job.expenses.length > 0 ? (
                                    <ul className="expenses-list">
                                        {job.expenses.map(expense => (
                                            <li key={expense.expenseId} className="expense-item">
                                                <span>${expense.amount.toFixed(2)}</span>
                                                <span>{expense.text}</span>
                                                <span>{new Date(expense.date).toLocaleDateString()}</span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>No expenses added yet.</p>
                                )}
                            </div>

                            <button
                                onClick={() => setSelectedJobId(job.jobId)}
                                className="add-expense-button"
                            >
                                Add Expense
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Add Expense Form */}
            {selectedJobId && (
                <div className="add-expense-form">
                    <h3>Add Expense</h3>
                    <form onSubmit={handleAddExpense}>
                        <div className="form-group">
                            <label htmlFor="amount">Amount ($)</label>
                            <input
                                type="number"
                                id="amount"
                                name="amount"
                                step="0.01"
                                min="0.01"
                                value={expenseForm.amount}
                                onChange={handleExpenseChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="text">Description</label>
                            <input
                                type="text"
                                id="text"
                                name="text"
                                value={expenseForm.text}
                                onChange={handleExpenseChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="date">Date</label>
                            <input
                                type="date"
                                id="date"
                                name="date"
                                value={expenseForm.date}
                                onChange={handleExpenseChange}
                                required
                            />
                        </div>

                        <div className="form-buttons">
                            <button type="submit" className="submit-button">Add Expense</button>
                            <button
                                type="button"
                                className="cancel-button"
                                onClick={() => setSelectedJobId(null)}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default MyJobs;