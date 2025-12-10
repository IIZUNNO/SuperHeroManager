// frontend/src/api/heroApi.ts
import axiosInstance from './axiosInstance'; 
import { type Hero } from '../types/Hero';

const API_URL = '/heroes';

export const getHeroes = async (searchQuery: string = ''): Promise<Hero[]> => {
    try {
        const response = await axiosInstance.get(API_URL, {
            params: { search: searchQuery }
        });
        
        console.log('📦 Réponse API héros:', {
            success: response.data.success,
            count: response.data.count,
            dataLength: response.data.data?.length
        });
        
        // Vérifie la structure de la réponse
        if (response.data && response.data.success && Array.isArray(response.data.data)) {
            return response.data.data;
        } else {
            console.error('❌ Structure de réponse inattendue:', response.data);
            return [];
        }
    } catch (error) {
        console.error('❌ Erreur getHeroes:', error);
        throw error;
    }
};

export const getHeroById = async (heroId: string): Promise<Hero> => {
    const response = await axiosInstance.get(`${API_URL}/${heroId}`);
    return response.data.data;
};

export const createHero = async (heroData: FormData): Promise<Hero> => {
    const response = await axiosInstance.post(API_URL, heroData);
    return response.data.data;
};

export const updateHero = async (heroId: string, heroData: FormData): Promise<Hero> => {
    const response = await axiosInstance.put(`${API_URL}/${heroId}`, heroData);
    return response.data.data;
};

export const deleteHero = async (heroId: string): Promise<void> => {
    await axiosInstance.delete(`${API_URL}/${heroId}`);
};

export const getImageUrl = (imagePath: string | undefined): string => {
    const BASE_URL = 'http://localhost:5000';
    
    // 1. Pas d'image -> chercher une image par nom
    if (!imagePath || imagePath.trim() === '') {
        return `${BASE_URL}/images/placeholder-hero.png`;
    }
    
    // 2. Si l'image commence par /images/ → URL complète
    if (imagePath.startsWith('/images/')) {
        return `${BASE_URL}${imagePath}`;
    }
    
    // 3. Si c'est juste un nom de fichier → chercher dans /images/
    if (!imagePath.startsWith('/')) {
        const possiblePaths = [
            `${BASE_URL}/images/lg/${imagePath}`,
            `${BASE_URL}/images/md/${imagePath}`,
            `${BASE_URL}/images/sm/${imagePath}`,
            `${BASE_URL}/images/xs/${imagePath}`,
            `${BASE_URL}/images/${imagePath}`
        ];
        
        return possiblePaths[0]; 
    }
    
    // 4. URL complète
    if (imagePath.startsWith('http')) {
        return imagePath;
    }
    
    // 5. Chemin relatif avec base
    return `${BASE_URL}${imagePath}`;
};

export const testImageUrl = async (url: string): Promise<boolean> => {
    try {
        const response = await fetch(url, { method: 'HEAD' });
        return response.ok;
    } catch {
        return false;
    }
};