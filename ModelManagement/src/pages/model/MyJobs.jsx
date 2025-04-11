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
        text: '',
        date: new Date().toISOString().split('T')[0]
    });
    const { currentUser } = useAuth();

    // Function to fetch jobs and expenses
    const fetchJobsAndExpenses = useCallback(async () => {
        if (!currentUser || !currentUser.modelId) {
            setLoading(false);
            return;
        }

        try {
            // 1. First fetch all jobs for the model
            const jobsResponse = await modelService.getMyJobs();
            const jobsData = jobsResponse.data;

            // 2. Then fetch all expenses for the model
            const expensesResponse = await modelService.getMyExpenses(currentUser.modelId);
            const allExpenses = expensesResponse.data;

            // 3. Organize expenses by job ID
            const expensesByJobId = {};
            allExpenses.forEach(expense => {
                if (!expensesByJobId[expense.jobId]) {
                    expensesByJobId[expense.jobId] = [];
                }
                expensesByJobId[expense.jobId].push(expense);
            });

            // 4. Merge the expenses into the jobs data
            const jobsWithExpenses = jobsData.map(job => ({
                ...job,
                expenses: expensesByJobId[job.jobId] || []
            }));

            setJobs(jobsWithExpenses);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching data:", err);
            setError('Failed to load data: ' + (err.response?.data || err.message || 'Unknown error'));
            setLoading(false);
        }
    }, [currentUser]);

    // Load jobs and expenses when component mounts
    useEffect(() => {
        fetchJobsAndExpenses();
    }, [fetchJobsAndExpenses]);

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
            // Format expense data for API
            const expenseData = {
                modelId: currentUser.modelId,
                jobId: selectedJobId,
                date: expenseForm.date,
                text: expenseForm.text,
                amount: parseFloat(expenseForm.amount)
            };

            // Add the expense
            await modelService.addExpense(expenseData);

            // Reset form
            setExpenseForm({
                amount: '',
                text: '',
                date: new Date().toISOString().split('T')[0]
            });
            setSelectedJobId(null);

            // Important: Refresh the data after adding an expense
            await fetchJobsAndExpenses();
        } catch (err) {
            setError('Failed to add expense: ' + (err.response?.data || err.message || 'Unknown error'));
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