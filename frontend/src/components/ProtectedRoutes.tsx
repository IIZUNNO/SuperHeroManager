// frontend/src/components/ProtectedRoute.tsx

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute: React.FC = () => {
    const { token } = useAuth(); // Seul le token est nécessaire ici

    if (!token) {
        // Redirige vers la page de connexion si pas de token
        return <Navigate to="/login" replace />; 
    }

    // Affiche le contenu imbriqué (Dashboard, AddHero, etc.)
    return <Outlet />; 
};

export default ProtectedRoute;