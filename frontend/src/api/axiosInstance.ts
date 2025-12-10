// frontend/src/api/axiosInstance.ts

import axios from 'axios';

// Définir l'URL de base pour toutes les requêtes API (hors auth, qui est déjà gérée)
const API_BASE_URL = 'http://localhost:5000/api'; 

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Intercepteur de requête : s'exécute avant que chaque requête ne soit envoyée
axiosInstance.interceptors.request.use(
    (config) => {
        // 1. Récupérer le token depuis le stockage local (ou le contexte)
        const token = localStorage.getItem('token'); 

        // 2. Si un token existe, l'ajouter à l'en-tête Authorization
        if (token) {
            // Le format standard pour les JWT est "Bearer [token]"
            config.headers.Authorization = `Bearer ${token}`;
        }
        
        // 3. Retourner la configuration modifiée
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;