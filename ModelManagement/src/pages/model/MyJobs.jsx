// src/pages/model/MyJobs.jsx
import { useState, useEffect, useCallback } from 'react';
import { modelService } from '../../services/api';
import useAuth from '../../hooks/useAuth';
import JobCard from '../../components/jobs/JobCard'; // We'll create this next
import ExpenseForm from '../../components/forms/ExpenseForm'; // We'll create this after

const MyJobs = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedJobId, setSelectedJobId] = useState(null);
    const [formLoading, setFormLoading] = useState(false);
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

    // Handle selecting a job for adding an expense
    const handleSelectJob = (jobId) => {
        setSelectedJobId(jobId);
    };

    // Handle canceling expense addition
    const handleCancelExpense = () => {
        setSelectedJobId(null);
    };

    // Handle adding an expense
    const handleAddExpense = async (expenseData) => {
        if (!selectedJobId || !currentUser?.modelId) return;

        setFormLoading(true);
        try {
            // Format expense data for API
            const submitData = {
                modelId: currentUser.modelId,
                jobId: selectedJobId,
                ...expenseData
            };

            // Add the expense
            await modelService.addExpense(submitData);

            // Reset state
            setSelectedJobId(null);

            // Refresh the data
            await fetchJobsAndExpenses();

            return true;
        } catch (err) {
            setError('Failed to add expense: ' + (err.response?.data || err.message || 'Unknown error'));
            throw err;
        } finally {
            setFormLoading(false);
        }
    };

    return (
        <div className="my-jobs-page">
            <h1>My Jobs</h1>

            {error && <div className="error-message">{error}</div>}

            {selectedJobId && (
                <div className="add-expense-form-container">
                    <h2>Add Expense</h2>
                    <ExpenseForm
                        onSubmit={handleAddExpense}
                        onCancel={handleCancelExpense}
                        isLoading={formLoading}
                        jobId={selectedJobId}
                        job={jobs.find(job => job.jobId === selectedJobId)}
                    />
                </div>
            )}

            {loading ? (
                <p>Loading your jobs...</p>
            ) : jobs.length === 0 ? (
                <p>You don't have any assigned jobs yet.</p>
            ) : (
                <div className="jobs-container">
                    {jobs.map(job => (
                        <JobCard
                            key={job.jobId}
                            job={job}
                            showExpenses={true}
                            onAddExpense={() => handleSelectJob(job.jobId)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyJobs;