import React, { useState, useEffect } from 'react';
import { managerService } from '../../services/api';
import ModelForm from '../../components/forms/ModelForm';
import ModelCard from '../../components/models/ModelCard';

const Models = () => {
    const [models, setModels] = useState([]);
    const [filteredModels, setFilteredModels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formLoading, setFormLoading] = useState(false);
    const [error, setError] = useState('');
    const [formMode, setFormMode] = useState('create'); // 'create' or 'edit'
    const [editingModel, setEditingModel] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showForm, setShowForm] = useState(true);

    // Load models when component mounts
    useEffect(() => {
        const fetchModels = async () => {
            try {
                setLoading(true);
                const response = await managerService.getModels();
                setModels(response.data);
                setFilteredModels(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to load models: ' + (err.message || err.response?.data || 'Unknown error'));
                setLoading(false);
            }
        };

        fetchModels();
    }, []);

    // Filter models when search term changes
    useEffect(() => {
        if (searchTerm.trim() === '') {
            setFilteredModels(models);
            return;
        }

        const lowerCaseSearch = searchTerm.toLowerCase();
        const filtered = models.filter(model =>
            model.firstName.toLowerCase().includes(lowerCaseSearch) ||
            model.lastName.toLowerCase().includes(lowerCaseSearch) ||
            model.email.toLowerCase().includes(lowerCaseSearch) ||
            (model.phoneNo && model.phoneNo.toLowerCase().includes(lowerCaseSearch))
        );

        setFilteredModels(filtered);
    }, [searchTerm, models]);

    // Create a new model
    const handleCreateModel = async (modelData) => {
        setFormLoading(true);
        try {
            const response = await managerService.createModel(modelData);
            setModels([...models, response.data]);
            setShowForm(false); // Hide the form after successful creation
            return response.data;
        } catch (err) {
            console.error("Create model error:", err.response?.data || err);
            setError('Failed to create model: ' + (err.response?.data || err.message || 'Unknown error'));
            throw err;
        } finally {
            setFormLoading(false);
        }
    };

    // Update an existing model
    const handleUpdateModel = async (modelData) => {
        if (!editingModel) return;

        setFormLoading(true);
        try {
            // When updating, we don't send the password unless it's changed
            const submitData = { ...modelData };
            if (!submitData.password) {
                delete submitData.password;
            }

            const response = await managerService.updateModel(editingModel.modelId, submitData);

            // Update the models array with the updated model
            const updatedModels = models.map(model =>
                model.modelId === editingModel.modelId ? response.data : model
            );

            setModels(updatedModels);
            setEditingModel(null);
            setFormMode('create');
            setShowForm(false); // Hide the form after successful update

            return response.data;
        } catch (err) {
            setError('Failed to update model: ' + (err.response?.data || err.message || 'Unknown error'));
            throw err;
        } finally {
            setFormLoading(false);
        }
    };

    // Handle form submission based on mode
    const handleSubmitModel = async (modelData) => {
        if (formMode === 'create') {
            return handleCreateModel(modelData);
        } else {
            return handleUpdateModel(modelData);
        }
    };

    // Set up model editing
    const handleEditModel = (model) => {
        setEditingModel(model);
        setFormMode('edit');
        setShowForm(true);
        // Scroll to form
        const scrollPosY = document.querySelector('.slide-up').offsetTop;
        window.scrollTo({ top: scrollPosY, behavior: 'smooth' });
    };

    // Cancel editing
    const handleCancelEdit = () => {
        setEditingModel(null);
        setFormMode('create');
    };

    // Delete a model
    const handleDeleteModel = async (modelId) => {
        try {
            await managerService.deleteModel(modelId);
            setModels(models.filter(model => model.modelId !== modelId));
        } catch (err) {
            setError('Failed to delete model: ' + (err.response?.data || err.message || 'Unknown error'));
        }
    };

    // Toggle form visibility
    const toggleForm = () => {
        setShowForm(!showForm);
        if (!showForm && formMode === 'edit') {
            // Reset to create mode if we're showing the form and were in edit mode
            setEditingModel(null);
            setFormMode('create');
        }
    };

    return (
        <div className="models-page fade-in">
            

            {/* Search and Filter Section */}
            <div className="filters-section">
                <div className="search-input">
                    <input
                        type="text"
                        placeholder="Search models..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="results-count">
                    {filteredModels.length} {filteredModels.length === 1 ? 'model' : 'models'} found
                </div>
            </div>

            {/* Models List */}
            <div className="models-list">
                <h2>Models</h2>
                {loading ? (
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                    </div>
                ) : filteredModels.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state-icon">🔍</div>
                        <h3 className="empty-state-title">No models found</h3>
                        <p className="empty-state-description">
                            {searchTerm ?
                                `No models match your search for "${searchTerm}". Try a different search term.` :
                                "There are no models yet. Create your first model using the form above."}
                        </p>
                        {searchTerm && (
                            <button
                                className="btn btn-primary"
                                onClick={() => setSearchTerm('')}
                            >
                                Clear Search
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="models-grid">
                        {filteredModels.map((model) => (
                            <ModelCard
                                key={model.modelId}
                                model={model}
                                onEdit={handleEditModel}
                                onDelete={handleDeleteModel}
                            />
                        ))}
                    </div>
                )}
                <div className="page-header">
                    <h1>Add a new model or edit an existing model</h1>
                    <div className="actions">
                        <button
                            className="btn btn-primary"
                            onClick={toggleForm}
                        >
                            {showForm ? 'Hide Form' : (formMode === 'edit' ? 'Edit Model' : 'Add New Model')}
                        </button>
                    </div>
                </div>

                {error && <div className="error-message">{error}</div>}

                {/* Model Form - conditionally shown */}
                {showForm && (
                    <div className="slide-up">
                        <h2>{formMode === 'create' ? 'Create New Model' : 'Edit Model'}</h2>
                        <ModelForm
                            initialData={editingModel || {}}
                            onSubmit={handleSubmitModel}
                            submitButtonText={formMode === 'create' ? 'Create Model' : 'Update Model'}
                            isLoading={formLoading}
                            onCancel={formMode === 'edit' ? handleCancelEdit : null}
                            hidePassword={formMode === 'edit'} // Don't require password when editing
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Models;