// src/components/ProtectedRoute.jsx

import React from 'react';
import { Navigate } from 'react-router-dom';

import { logout } from '@/services/authService';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';

const Logout = () => {

    localStorage.setItem('token','')
    localStorage.setItem('user','')
    const {setUserAuth} = useAuth();

    useEffect(() => {
        
        setUserAuth(null)
    }, []);


    return <Navigate to="/login" />;
 
};

export default Logout;