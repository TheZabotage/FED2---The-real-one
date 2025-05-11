import { useState, useEffect } from 'react';
import { managerService } from '../../services/api';
import JobForm from '../../components/forms/JobForm';
import JobList from '../../components/jobs/JobList'; // We'll refactor this next

const Jobs = () => {
    const [jobs, setJobs] = useState([]);
    const [models, setModels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formLoading, setFormLoading] = useState(false);
    const [error, setError] = useState('');
    const [formMode, setFormMode] = useState('create'); // 'create' or 'edit'
    const [editingJob, setEditingJob] = useState(null);

    // Fetch jobs and models on component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [jobsResponse, modelsResponse] = await Promise.all([
                    managerService.getAllJobs(),
                    managerService.getModels()
                ]);
                setJobs(jobsResponse.data);
                setModels(modelsResponse.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to load data: ' + (err.message || 'Unknown error'));
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Create a new job
    const handleCreateJob = async (jobData) => {
        setFormLoading(true);
        try {
            const formattedData = {
                ...jobData,
                days: parseInt(jobData.days, 10)
            };

            const response = await managerService.createJob(formattedData);
            setJobs([...jobs, response.data]);
            return response.data;
        } catch (err) {
            setError('Failed to create job: ' + (err.message || 'Unknown error'));
            throw err;
        } finally {
            setFormLoading(false);
        }
    };

    // Update an existing job
    const handleUpdateJob = async (jobData) => {
        if (!editingJob) return;

        setFormLoading(true);
        try {
            const formattedData = {
                ...jobData,
                days: parseInt(jobData.days, 10)
            };

            const response = await managerService.updateJob(editingJob.jobId, formattedData);

            // Update the jobs array with the updated job
            const updatedJobs = jobs.map(job =>
                job.jobId === editingJob.jobId ? response.data : job
            );

            setJobs(updatedJobs);
            setEditingJob(null);
            setFormMode('create');

            return response.data;
        } catch (err) {
            setError('Failed to update job: ' + (err.message || 'Unknown error'));
            throw err;
        } finally {
            setFormLoading(false);
        }
    };

    // Handle form submission based on mode
    const handleSubmitJob = async (jobData) => {
        if (formMode === 'create') {
            return handleCreateJob(jobData);
        } else {
            return handleUpdateJob(jobData);
        }
    };

    // Set up job editing
    const handleEditJob = (job) => {
        setEditingJob(job);
        setFormMode('edit');
        // Scroll to form
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Cancel editing
    const handleCancelEdit = () => {
        setEditingJob(null);
        setFormMode('create');
    };

    // Add model to job
    const handleAddModel = async (jobId, modelId) => {
        try {
            await managerService.addModelToJob(jobId, modelId);
            await refreshJobs();
        } catch (err) {
            setError('Failed to add model to job: ' + (err.message || 'Unknown error'));
        }
    };

    // Remove model from job
    const handleRemoveModel = async (jobId, modelId) => {
        try {
            await managerService.removeModelFromJob(jobId, modelId);
            await refreshJobs();
        } catch (err) {
            setError('Failed to remove model from job: ' + (err.message || 'Unknown error'));
        }
    };

    // Refresh jobs data
    const refreshJobs = async () => {
        try {
            const response = await managerService.getAllJobs();
            setJobs(response.data);
        } catch (err) {
            setError('Failed to refresh jobs: ' + (err.message || 'Unknown error'));
        }
    };

    // Delete a job
    const handleDeleteJob = async (jobId) => {
        if (window.confirm('Are you sure you want to delete this job?')) {
            try {
                await managerService.deleteJob(jobId);
                setJobs(jobs.filter(job => job.jobId !== jobId));
            } catch (err) {
                setError('Failed to delete job: ' + (err.message || 'Unknown error'));
            }
        }
    };

    return (
        <div className="jobs-page">
            <h1>Jobs Management</h1>

            {error && <div className="alert alert-danger">{error}</div>}

            <div className="job-form-container">
                <h2>{formMode === 'create' ? 'Create New Job' : 'Edit Job'}</h2>
                <JobForm
                    initialData={editingJob || {}}
                    onSubmit={handleSubmitJob}
                    submitButtonText={formMode === 'create' ? 'Create Job' : 'Update Job'}
                    isLoading={formLoading}
                    onCancel={formMode === 'edit' ? handleCancelEdit : null}
                />
            </div>

            {loading ? (
                <p>Loading...</p>
            ) : (
                <JobList
                    jobs={jobs}
                    models={models}
                    onAddModel={handleAddModel}
                    onRemoveModel={handleRemoveModel}
                    onEditJob={handleEditJob}
                    onDeleteJob={handleDeleteJob}
                />
            )}
        </div>
    );
};

export default Jobs;