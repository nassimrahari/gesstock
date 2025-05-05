// src/api/userService.js

import { BACKEND_SERVER } from "../conf";

const BASE_URL=`${BACKEND_SERVER}/api/users`

export const fetchUsers = async () => {
    const response = await fetch(`${BASE_URL}/`);
    return response.json();
};

export const createUser = async (data) => {
    await fetch(`${BASE_URL}/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
};

export const updateUser = async (id, data) => {
    await fetch(`${BASE_URL}/${id}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
};

export const deleteUser = async (id) => {
    await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' });
};


export const fetchUsersItem = async (id) => {
    const response = await fetch(`${BASE_URL}/${id}/`);
    return response.json();
};
        