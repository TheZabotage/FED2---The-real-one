// src/pages/manager/Jobs.jsx
import { useState, useEffect } from 'react';
import { managerService } from '../../services/api';
import JobForm from '../../components/forms/JobForm';
import JobList from '../../components/jobs/JobList';

const Jobs = () => {
    const [jobs, setJobs] = useState([]);
    const [models, setModels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

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



    const handleCreateJob = async (jobData) => {
        try {
            const formattedData = {
                ...jobData,
                days: parseInt(jobData.days, 10)
            };

            const response = await managerService.createJob(formattedData);
            setJobs([...jobs, response.data]);
        } catch (err) {
            setError('Failed to create job: ' + (err.message || 'Unknown error'));
        }
    };

    const handleAddModel = async (jobId, modelId) => {
        try {
            await managerService.addModelToJob(jobId, modelId);
            refreshJobs();
        } catch (err) {
            setError('Failed to add model to job: ' + (err.message || 'Unknown error'));
        }
    };

    const handleRemoveModel = async (jobId, modelId) => {
        try {
            await managerService.removeModelFromJob(jobId, modelId);
            refreshJobs();
        } catch (err) {
            setError('Failed to remove model from job: ' + (err.message || 'Unknown error'));
        }
    };

    const refreshJobs = async () => {
        try {
            const response = await managerService.getAllJobs();
            setJobs(response.data);
        } catch (err) {
            setError('Failed to refresh jobs: ' + (err.message || 'Unknown error'));
        }
    };



    return (
        <div className="jobs-page">
            <h1>Jobs Management</h1>

            {error && <div className="alert alert-danger">{error}</div>}

            <div className="create-job-form">
                <h2>Create New Job</h2>
                <JobForm onSubmit={handleCreateJob} />
            </div>

            {loading ? (
                <p>Loading...</p>
            ) : (
                <JobList
                    jobs={jobs}
                    models={models}
                    onAddModel={handleAddModel}
                    onRemoveModel={handleRemoveModel}
                />
            )}
        </div>
    );
};

export default Jobs;