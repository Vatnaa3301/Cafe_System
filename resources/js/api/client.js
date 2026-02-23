import axios from 'axios';

const client = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
});

// Attach stored token to every request
client.interceptors.request.use((config) => {
    const token = localStorage.getItem('cafe_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Global 401 handler
client.interceptors.response.use(
    (res) => res,
    (err) => {
        if (err.response?.status === 401) {
            localStorage.removeItem('cafe_token');
            localStorage.removeItem('cafe_user');
            window.location.href = '/login';
        }
        return Promise.reject(err);
    }
);

export default client;
