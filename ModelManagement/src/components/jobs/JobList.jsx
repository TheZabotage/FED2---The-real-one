// src/components/jobs/JobList.jsx
import { useState } from 'react';

const JobList = ({ jobs, models, onAddModel, onRemoveModel }) => {
    const [selectedJob, setSelectedJob] = useState(null);
    const [selectedModel, setSelectedModel] = useState('');

    const handleAddModel = () => {
        if (!selectedJob || !selectedModel) return;
        onAddModel(selectedJob.jobId, selectedModel);
        setSelectedModel('');
    };

    return (
        <div className="jobs-list">
            <h2>All Jobs</h2>
            {jobs.length === 0 ? (
                <p>No jobs available.</p>
            ) : (
                <div className="jobs-grid">
                    {jobs.map((job) => (
                        <div key={job.jobId} className="job-card">
                            <h3>{job.customer}</h3>
                            <p><strong>Start Date:</strong> {new Date(job.startDate).toLocaleDateString()}</p>
                            <p><strong>Days:</strong> {job.days}</p>
                            <p><strong>Location:</strong> {job.location}</p>
                            {job.comments && <p><strong>Comments:</strong> {job.comments}</p>}

                            <div className="job-models">
                                <h4>Models Assigned</h4>
                                {job.models && job.models.length > 0 ? (
                                    <ul>
                                        {job.models.map((model) => (
                                            <li key={model.modelId}>
                                                {model.firstName} {model.lastName}
                                                <button
                                                    onClick={() => onRemoveModel(job.jobId, model.modelId)}
                                                    className="remove-model-btn"
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
                                    onClick={() => setSelectedJob(job)}
                                    className="select-job-btn"
                                >
                                    Add Models to this Job
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add Model to Job Modal/Section */}
            {selectedJob && (
                <div className="add-model-modal">
                    <h3>Add Model to: {selectedJob.customer}</h3>
                    <div className="model-selection">
                        <label htmlFor="modelSelect">Select Model:</label>
                        <select
                            id="modelSelect"
                            value={selectedModel}
                            onChange={(e) => setSelectedModel(e.target.value)}
                        >
                            <option value="">-- Select a Model --</option>
                            {models.map((model) => (
                                <option key={model.modelId} value={model.modelId}>
                                    {model.firstName} {model.lastName}
                                </option>
                            ))}
                        </select>
                        <button
                            onClick={handleAddModel}
                            disabled={!selectedModel}
                            className="add-model-btn"
                        >
                            Add to Job
                        </button>
                        <button
                            onClick={() => setSelectedJob(null)}
                            className="cancel-btn"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default JobList;