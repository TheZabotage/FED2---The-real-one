// src/components/jobs/JobList.jsx
import { useState } from 'react';
import PropTypes from 'prop-types';
import JobItem from './JobItem';
import ModelSelector from '../models/ModelSelector'; // We'll create this next

const JobList = ({
    jobs,
    models,
    onAddModel,
    onRemoveModel,
    onEditJob,
    onDeleteJob
}) => {
    const [selectedJob, setSelectedJob] = useState(null);
    const [selectedModel, setSelectedModel] = useState('');
    const [addingModel, setAddingModel] = useState(false);

    const handleAddModel = () => {
        if (!selectedJob || !selectedModel) return;

        onAddModel(selectedJob.jobId, selectedModel);
        setSelectedModel('');
        setAddingModel(false);
    };

    const handleSelectForAddModel = (job) => {
        setSelectedJob(job);
        setAddingModel(true);
        setSelectedModel('');
    };

    const handleCancelAddModel = () => {
        setSelectedJob(null);
        setAddingModel(false);
    };

    const handleModelChange = (modelId) => {
        setSelectedModel(modelId);
    };

    return (
        <div className="jobs-list">
            <h2>All Jobs</h2>

            {addingModel && selectedJob && (
                <div className="add-model-modal">
                    <h3>Add Model to: {selectedJob.customer}</h3>
                    <div className="model-selection">
                        <ModelSelector
                            models={models}
                            selectedModelId={selectedModel}
                            onChange={handleModelChange}
                            label="Select Model:"
                            placeholder="-- Select a Model --"
                        />

                        <div className="modal-actions">
                            <button
                                onClick={handleAddModel}
                                disabled={!selectedModel}
                                className="add-model-btn"
                            >
                                Add to Job
                            </button>
                            <button
                                onClick={handleCancelAddModel}
                                className="cancel-btn"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {jobs.length === 0 ? (
                <p>No jobs available.</p>
            ) : (
                <div className="jobs-grid">
                    {jobs.map((job) => (
                        <JobItem
                            key={job.jobId}
                            job={job}
                            onRemoveModel={onRemoveModel}
                            onEditJob={onEditJob}
                            onDeleteJob={onDeleteJob}
                            onSelectForAddModel={handleSelectForAddModel}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

JobList.propTypes = {
    jobs: PropTypes.array.isRequired,
    models: PropTypes.array.isRequired,
    onAddModel: PropTypes.func.isRequired,
    onRemoveModel: PropTypes.func.isRequired,
    onEditJob: PropTypes.func.isRequired,
    onDeleteJob: PropTypes.func.isRequired
};

export default JobList;