// src/api/productService.js
import axiosInstance from './apiInterceptor'; // Import the centralized Axios instance

const BASE_URL = `/api/products`;

export const fetchProducts = async (config=undefined) => {
    const response = await axiosInstance.get(BASE_URL,config);
    return response.data; // Use response.data to access the JSON response
};

export const createProduct = async (data,config=undefined) => {
    await axiosInstance.post(BASE_URL+"/", data,config); // Directly send data, Axios handles serialization
};

export const updateProduct = async (id, data,config=undefined) => {
    await axiosInstance.put(`${BASE_URL}/${id}/`, data,config); // Use template literals for URL
};

export const deleteProduct = async (id,config=undefined) => {
    await axiosInstance.delete(`${BASE_URL}/${id}/`,config); // Use template literals for URL
};

export const fetchProductsItem = async (id,config=undefined) => {
    const response = await axiosInstance.get(`${BASE_URL}/${id}/`,config);
    return response.data; // Use response.data to access the JSON response
};
        