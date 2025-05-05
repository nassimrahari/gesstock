// src/components/ProtectedRoute.jsx

import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { getUserAuth } from '@/services/authService';

import { useLocation } from 'react-router-dom';
import Logout from './Auth/Logout';

const ProtectedRoute = ({ element }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null); // État pour suivre l'authentification

    const location = useLocation(); // Obtenir l'emplacement actuel

    useEffect(() => {

   
        const checkAuth = async () => {
            const token = localStorage.getItem('token');

            if (!token) {
                setIsAuthenticated(false);
                return;
            }

            try {
                // Appel à la fonction pour vérifier l'authentification
                const user = await getUserAuth();
                if (user) {
                    setIsAuthenticated(true);
                } else {
                    setIsAuthenticated(false);
                }
            } catch (error) {
      
                setIsAuthenticated(false);
            }
        };

        checkAuth();
    
    },[location])

    // Afficher un loader pendant la vérification
    if (isAuthenticated === null) {
        return <div>Loading...</div>;
    }

    // Rediriger vers la page de connexion si non authentifié
    if (!isAuthenticated) {
        return <Logout />;
    }

    // Si l'utilisateur est authentifié, rendre l'élément demandé
    return element;
};

export default ProtectedRoute;