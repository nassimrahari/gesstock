// src/api/apiInterceptor.js

import axios from 'axios';
import { BACKEND_SERVER } from '../conf';

// Create an Axios instance
const axiosInstance = axios.create({
    baseURL: BACKEND_SERVER, // Set the base URL for all requests
});

// Function to get the auth token (replace this with your actual implementation)
export const getAuthToken = () => {
    return localStorage.getItem('token'); // Example: retrieve from local storage
};

// Interceptor to add the token to every request
axiosInstance.interceptors.request.use(async (config) => {
    const token = getAuthToken();
    console.log(token)
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    
    return Promise.reject(error);
});



// Export the configured Axios instance
export default axiosInstance;