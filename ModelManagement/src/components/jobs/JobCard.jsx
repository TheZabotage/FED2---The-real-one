// src/components/jobs/JobCard.jsx
import PropTypes from 'prop-types';
import ExpenseList from './ExpenseList'; // We'll create this next

const JobCard = ({
    job,
    showExpenses = false,
    onAddExpense = null,
    onEditJob = null,
    onDeleteJob = null
}) => {
    // Format date for display
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString();
    };

    return (
        <div className="job-card">
            <div className="job-card-header">
                <h3>{job.customer}</h3>

                {/* Show edit/delete buttons if handlers are provided (manager view) */}
                {(onEditJob || onDeleteJob) && (
                    <div className="job-actions">
                        {onEditJob && (
                            <button
                                onClick={() => onEditJob(job)}
                                className="btn btn-outline  edit-btn"
                                title="Edit this job"
                            >
                                Edit
                            </button>
                        )}

                        {onDeleteJob && (
                            <button
                                onClick={() => onDeleteJob(job.jobId)}
                                className="btn btn-outline -btn"
                                title="Delete this job"
                            >
                                Delete
                            </button>
                        )}
                    </div>
                )}
            </div>

            <div className="job-details">
                <p><strong>Start Date:</strong> {formatDate(job.startDate)}</p>
                <p><strong>Days:</strong> {job.days}</p>
                <p><strong>Location:</strong> {job.location}</p>
                {job.comments && <p><strong>Comments:</strong> {job.comments}</p>}
            </div>

            {/* Show expenses if needed (model view) */}
            {showExpenses && (
                <div className="job-expenses">
                    <h4>Expenses</h4>
                    {job.expenses && job.expenses.length > 0 ? (
                        <ExpenseList expenses={job.expenses} />
                    ) : (
                        <p>No expenses added yet.</p>
                    )}

                    {onAddExpense && (
                        <button
                            onClick={() => onAddExpense(job.jobId)}
                            className="btn add-model-btn"
                        >
                            Add Expense
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

JobCard.propTypes = {
    job: PropTypes.shape({
        jobId: PropTypes.string.isRequired,
        customer: PropTypes.string.isRequired,
        startDate: PropTypes.string.isRequired,
        days: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        location: PropTypes.string.isRequired,
        comments: PropTypes.string,
        expenses: PropTypes.arrayOf(
            PropTypes.shape({
                expenseId: PropTypes.string.isRequired,
                amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
                text: PropTypes.string.isRequired,
                date: PropTypes.string.isRequired
            })
        ),
        models: PropTypes.arrayOf(
            PropTypes.shape({
                modelId: PropTypes.string.isRequired,
                firstName: PropTypes.string.isRequired,
                lastName: PropTypes.string.isRequired
            })
        )
    }).isRequired,
    showExpenses: PropTypes.bool,
    onAddExpense: PropTypes.func,
    onEditJob: PropTypes.func,
    onDeleteJob: PropTypes.func
};

export default JobCard;