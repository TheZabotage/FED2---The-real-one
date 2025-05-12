// src/components/jobs/JobItem.jsx
import PropTypes from 'prop-types';

const JobItem = ({
    job,
    onRemoveModel,
    onEditJob,
    onDeleteJob,
    onSelectForAddModel
}) => {
    // Format date for display
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString();
    };

    return (
        <div className="job-card">
            <div className="job-card-header">
                <h3>{job.customer}</h3>
                <div className="job-actions">
                    <button
                        onClick={() => onEditJob(job)}
                        className="btn edit-btn"
                        title="Edit this job"
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => onDeleteJob(job.jobId)}
                        className="btn delete-btn"
                        title="Delete this job"
                    >
                        Delete
                    </button>
                </div>
            </div>

            <div className="job-details">
                <p><strong>Start Date:</strong> {formatDate(job.startDate)}</p>
                <p><strong>Days:</strong> {job.days}</p>
                <p><strong>Location:</strong> {job.location}</p>
                {job.comments && <p><strong>Comments:</strong> {job.comments}</p>}
            </div>

            <div className="job-models">
                <h4>Models Assigned</h4>
                {job.models && job.models.length > 0 ? (
                    <ul>
                        {job.models.map((model) => (
                            <li key={model.modelId}>
                                {model.firstName} {model.lastName}
                                <button
                                    onClick={() => onRemoveModel(job.jobId, model.modelId)}
                                    className="btn remove-model-btn"
                                >
                                    Remove
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No models assigned to this job.</p>
                )}
            </div>

            <div className="add-model-section">
                <button
                    onClick={() => onSelectForAddModel(job)}
                    className="btn add-model-btn"
                >
                    Add Models to this Job
                </button>
            </div>
        </div>
    );
};

JobItem.propTypes = {
    job: PropTypes.shape({
        jobId: PropTypes.string.isRequired,
        customer: PropTypes.string.isRequired,
        startDate: PropTypes.string.isRequired,
        days: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        location: PropTypes.string.isRequired,
        comments: PropTypes.string,
        models: PropTypes.arrayOf(
            PropTypes.shape({
                modelId: PropTypes.string.isRequired,
                firstName: PropTypes.string.isRequired,
                lastName: PropTypes.string.isRequired
            })
        )
    }).isRequired,
    onRemoveModel: PropTypes.func.isRequired,
    onEditJob: PropTypes.func.isRequired,
    onDeleteJob: PropTypes.func.isRequired,
    onSelectForAddModel: PropTypes.func.isRequired
};

export default JobItem;