// src/services/api.jsx
import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Handle JWT token for all requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        //Check if token is present
        if (token) {
            console.log("Adding token to request");
            config.headers['Authorization'] = `Bearer ${token}`;
        } else {
            console.log("No token found for request");
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Authentication service
export const authService = {
    login: async (email, password) => {
        try {
            const response = await axios.post(`${API_URL}/Account/login`, { email, password });

            // The response.data is directly the JWT token as a string
            const token = response.data;

            if (token) {
                localStorage.setItem('token', token);
                return { jwt: token }; // Return in expected format for your auth provider
            }
        } catch (error) {
            console.error('Login error:', error.response?.data || error.message);
            throw error;
        }
    },
    changePassword: (email, oldPassword, newPassword) => {
        return api.put('/Account/Password', { email, oldPassword, password: newPassword });
    },
    logout: () => {
        localStorage.removeItem('token');
    }
};

// Manager service
export const managerService = {
    // Models management
    getModels: () => api.get('/Models'),
    getModel: (id) => api.get(`/Models/${id}`),
    createModel: (modelData) => api.post('/Models', modelData),
    updateModel: (id, modelData) => api.put(`/Models/${id}`, modelData),
    deleteModel: (id) => api.delete(`/Models/${id}`),
    getModelJobs: (id) => api.get(`/Models/${id}/jobs`),

    // Managers management
    getManagers: () => api.get('/Managers'),
    getManager: (id) => api.get(`/Managers/${id}`),
    createManager: (managerData) => api.post('/Managers', managerData),
    updateManager: (id, managerData) => api.put(`/Managers/${id}`, managerData),
    deleteManager: (id) => api.delete(`/Managers/${id}`),

    // Jobs management
    getAllJobs: () => api.get('/Jobs'),
    getJob: (id) => api.get(`/Jobs/${id}`),
    createJob: (jobData) => api.post('/Jobs', jobData),
    updateJob: (id, jobData) => api.put(`/Jobs/${id}`, jobData),
    deleteJob: (id) => api.delete(`/Jobs/${id}`),

    // Job-model operations
    addModelToJob: (jobId, modelId) => api.post(`/Jobs/${jobId}/model/${modelId}`),
    removeModelFromJob: (jobId, modelId) => api.delete(`/Jobs/${jobId}/model/${modelId}`),

    // Expenses management
    getAllExpenses: () => api.get('/Expenses'),
    getExpense: (id) => api.get(`/Expenses/${id}`),
    getModelExpenses: (modelId) => api.get(`/Expenses/model/${modelId}`),
    createExpense: (expenseData) => api.post('/Expenses', expenseData),
    updateExpense: (id, expenseData) => api.put(`/Expenses/${id}`, expenseData),
    deleteExpense: (id) => api.delete(`/Expenses/${id}`)
};

// Model service
export const modelService = {
    // For models to access their own jobs and expenses
    //Added debugging because it doesn't work fucking work. PSS: Remember to check swagge once in a  while :DDD
    getMyJobs: () => {
        return api.get('/Jobs');
    },
    addExpense: (expenseData) => api.post('/Expenses', expenseData),
    getMyExpenses: (modelId) => api.get(`/Expenses/model/${modelId}`)

};

export default api;