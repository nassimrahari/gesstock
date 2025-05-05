
// services/authService.js

import axios from 'axios';
import { BACKEND_SERVER } from '../conf';

const BASE_URL = `${BACKEND_SERVER}/api/auth`;

import axiosInstance from './apiInterceptor';

// Function to log in
export const login = async (email, password) => {
    try {
        const response = await axios.post(`${BASE_URL}/login`, { email, password });
     

        const { token,access,refresh, user } = response.data;

        // Store the token and user in localStorage

        if(token){
            localStorage.setItem('token', token);
        }else{
            localStorage.setItem('token', access);
            localStorage.setItem('refresh', refresh);
        }
        localStorage.setItem('user', JSON.stringify(user));

        return response.data; // Return the data for future use
    } catch (error) {
        throw error.response.data || 'Login failed';
    }
};

// Function to check user authentication
export const getUserAuth = async () => {
    try {
        const response = await axiosInstance.get(`${BASE_URL}/checkauth`);
        return response.data;

    } catch (error) {
        throw error.response.data || 'Check User Failed';
    }
};

// Function to log out
export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
};

// Function to check if the user is logged in
export const isLoggedIn = () => {
    return localStorage.getItem('token') !== null;
};

// Function to get user information
export const getUser = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
};

// Function to change the user's password
export const changePassword = async (currentPassword, newPassword, confirmPassword) => {
    try {
        const response = await axiosInstance.put(`${BASE_URL}/change-password`, {
            currentPassword,
            newPassword,
            confirmPassword,
        });
        return response.data; // Return success message or updated user data
    } catch (error) {
        throw error.response.data || 'Change password failed';
    }
};

// Function to request a password reset
export const requestPasswordReset = async (email) => {
    try {
        const response = await axios.post(`${BASE_URL}/request-password-reset`, { email });
        return response.data; // Return success message
    } catch (error) {
        throw error.response.data || 'Request password reset failed';
    }
};

// Function to reset the user's password
export const resetPassword = async (token, newPassword) => {
    try {
        const response = await axios.post(`${BASE_URL}/reset-password`, { token, newPassword });
        return response.data; // Return success message
    } catch (error) {
        throw error.response.data || 'Reset password failed';
    }
};


// Function to fetch profile details
export const fetchProfileDetails = async () => {
    try {
        const response = await axiosInstance.get(`${BASE_URL}/change-profile`); // Fetch profile details
        return response.data; // Return user profile details
    } catch (error) {
        throw error.response.data || 'Fetch profile details failed';
    }
};

// Function to update profile details
export const updateProfileDetails = async (data) => {
    try {
        const response = await axiosInstance.put(`${BASE_URL}/change-profile`, data); // Update profile details
        return response.data; // Return updated user profile data
    } catch (error) {
        throw error.response.data || 'Update profile details failed';
    }
};    
        