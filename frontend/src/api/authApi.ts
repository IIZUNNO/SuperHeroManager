// frontend/src/api/authApi.ts
import axios from 'axios';
import { type AuthUser } from '../types/Hero';

const API_URL = 'http://localhost:5000/api/auth'; 

interface LoginCredentials {
    username: string;
    password: string;
}

interface LoginResponse {
    success: boolean;
    message: string;
    data: {
        token: string;
        user: AuthUser;
    };
}

interface RegisterResponse {
    success: boolean;
    message: string;
    data: {
        token: string;
        user: AuthUser;
    };
}

// Fonction de connexion
export const loginUser = async (credentials: LoginCredentials): Promise<LoginResponse['data']> => {
    const response = await axios.post<LoginResponse>(`${API_URL}/login`, credentials);
    
    if (!response.data.success) {
        throw new Error(response.data.message);
    }
    
    // Stocker le token dans localStorage
    localStorage.setItem('token', response.data.data.token);
    
    axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.data.token}`;
    
    return response.data.data; // Retourne seulement { token, user }
};

// Fonction d'enregistrement
export const registerUser = async (credentials: LoginCredentials): Promise<RegisterResponse['data']> => {
    const response = await axios.post<RegisterResponse>(`${API_URL}/register`, credentials);
    
    if (!response.data.success) {
        throw new Error(response.data.message);
    }
    
    localStorage.setItem('token', response.data.data.token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.data.token}`;
    
    return response.data.data;
};

// Fonction pour vérifier le token au démarrage
export const checkAuth = async (): Promise<AuthUser | null> => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    
    try {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await axios.get(`${API_URL}/me`);
        return response.data.data;
    } catch (error) {
        console.error('Erreur de vérification du token:', error);
        localStorage.removeItem('token');
        return null;
    }
};