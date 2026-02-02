import axios from 'axios';

// Base URL for API
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add token to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Handle response errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth API calls
export const authAPI = {
    login: (emailOrPhone) => api.post('/auth/login', { emailOrPhone }),
    verifyOTP: (userId, otp) => api.post('/auth/verify-otp', { userId, otp }),
    register: (data) => api.post('/auth/register', data),
    getCurrentUser: () => api.get('/auth/me')
};

// Product API calls
export const productAPI = {
    getAll: (isPublished) => {
        const params = isPublished !== undefined ? { isPublished } : {};
        return api.get('/products', { params });
    },
    getById: (id) => api.get(`/products/${id}`),
    create: (formData) => {
        return api.post('/products', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    },
    update: (id, formData) => {
        return api.put(`/products/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    },
    delete: (id) => api.delete(`/products/${id}`),
    togglePublish: (id) => api.patch(`/products/${id}/publish`)
};

export default api;