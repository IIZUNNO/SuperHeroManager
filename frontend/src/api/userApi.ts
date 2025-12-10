// frontend/src/api/userApi.ts

import axios from 'axios';
import { type AuthUser } from '../types/Hero'; // Réutilisation du type utilisateur

const API_URL = '/api/users'; // Route typique pour la gestion des utilisateurs (back-end)

interface LogEntry {
    _id: string;
    action: string; // Ex: 'CREATE_HERO', 'UPDATE_HERO'
    user: string; // Nom d'utilisateur ou ID de l'utilisateur
    details: string; // Description de l'action
    timestamp: string;
}

// 1. Récupérer tous les utilisateurs (Admin seulement)
export const getUsers = async (): Promise<AuthUser[]> => {
    // Le token JWT sera ajouté automatiquement par l'intercepteur dans heroApi.ts
    const response = await axios.get(API_URL);
    return response.data;
};

// 2. Mettre à jour le rôle d'un utilisateur (Admin seulement)
export const updateUserRole = async (userId: string, newRole: 'admin' | 'editor' | 'visitor'): Promise<AuthUser> => {
    const response = await axios.put(`${API_URL}/${userId}/role`, { role: newRole });
    return response.data;
};

// 3. Récupérer le journal des activités (Admin seulement)
export const getAuditLogs = async (): Promise<LogEntry[]> => {
    const response = await axios.get('/api/logs'); 
    return response.data;
};