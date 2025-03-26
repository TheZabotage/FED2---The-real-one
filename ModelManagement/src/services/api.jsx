// the API is forr communicating with the backend

import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

//instance of axios
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Handle JWT token for all requests, works as request interceptor, so all rrequests will have the token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

//Authentification service, login.
//Try catch is reddundant as the error is handled in await

export const authService = {
    login: async (email, password) => {
        const response = await axios.post(`${API_URL}/account/login`, { email, password });
        if (response.data.jwt) {
            localStorage.setItem('token', response.data.jwt);
            return response.data;
        }
    },
    logout: () => {
        localStorage.removeItem('token');
    }
};


//Manager service; what can a manage do?
export const managerService = {
    createModel: (modelData) => api.post('/models', modelData),
    createManager: (managerData) => api.post('/account/managers', managerData),
    createJob: (jobData) => api.post('/jobs', jobData),
    addModelToJob: (jobId, modelId) => api.post(`/jobs/${jobId}/models/${modelId}`),
    removeModelFromJob: (jobId, modelId) => api.delete(`/jobs/${jobId}/models/${modelId}`),
    getAllJobs: () => api.get('/jobs')
};

//Model service; what can a model do?
export const modelService = {
    getMyJobs: () => api.get('/jobs/mine'),
    addExpense: (jobId, expenseData) => api.post(`/jobs/${jobId}/expenses`, expenseData)
};

export default api;