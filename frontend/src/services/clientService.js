// src/api/clientService.js
import axiosInstance from './apiInterceptor'; // Import the centralized Axios instance

const BASE_URL = `/api/clients`;

export const fetchClients = async (config=undefined) => {
    const response = await axiosInstance.get(BASE_URL,config);
    return response.data; // Use response.data to access the JSON response
};

export const createClient = async (data,config=undefined) => {
    await axiosInstance.post(BASE_URL+"/", data,config); // Directly send data, Axios handles serialization
};

export const updateClient = async (id, data,config=undefined) => {
    await axiosInstance.put(`${BASE_URL}/${id}/`, data,config); // Use template literals for URL
};

export const deleteClient = async (id,config=undefined) => {
    await axiosInstance.delete(`${BASE_URL}/${id}/`,config); // Use template literals for URL
};

export const fetchClientsItem = async (id,config=undefined) => {
    const response = await axiosInstance.get(`${BASE_URL}/${id}/`,config);
    return response.data; // Use response.data to access the JSON response
};
        