// src/pages/model/MyJobs.jsx
import { useState, useEffect } from 'react';
import { modelService } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';

const MyJobs = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedJobId, setSelectedJobId] = useState(null);
    const [expenseForm, setExpenseForm] = useState({
        amount: '',
        description: ''
    });
    const { currentUser } = useAuth();

    useEffect(() => {
        fetchMyJobs();
    }, []);

    const fetchMyJobs = async () => {
        try {
            const response = await modelService.getMyJobs();
            setJobs(response.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to load jobs: ' + (err.message || 'Unknown error'));
            setLoading(false);
        }
    };

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
            // Format expense data
            const expenseData = {
                ...expenseForm,
                amount: parseFloat(expenseForm.amount),
                modelId: currentUser.modelId,
                jobId: selectedJobId
            };

            await modelService.addExpense(selectedJobId, expenseData);

            // Reset form and refresh jobs to show new expense
            setExpenseForm({
                amount: '',
                description: ''
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
                        <div key={job.id} className="job-card">
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
                                            <li key={expense.id} className="expense-item">
                                                <span>${expense.amount.toFixed(2)}</span>
                                                <span>{expense.description}</span>
                                                <span>{new Date(expense.dateCreated).toLocaleDateString()}</span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>No expenses added yet.</p>
                                )}
                            </div>

                            <button
                                onClick={() => setSelectedJobId(job.id)}
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
                            <label htmlFor="description">Description</label>
                            <input
                                type="text"
                                id="description"
                                name="description"
                                value={expenseForm.description}
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