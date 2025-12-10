// frontend/src/types/Hero.ts
// frontend/src/types/Hero.ts
import type { AuthUser } from "../types/Hero";
// Interface pour le typage TypeScript de l'objet Héros
export interface Hero {
    _id: string; 
    nom: string;
    alias: string;
    univers: 'Marvel' | 'DC' | 'Autre';
    pouvoirs: string[]; // Tableau de chaînes de caractères
    description: string;
    image: string; // URL ou chemin local de l'image
    origine: string;
    premiereApparition: string;
}

// Interface pour l'objet Utilisateur (déplacé ici pour être partagé)
export type AuthUser  = {
    id: string;
    username: string;
    role: 'admin' | 'editor' | 'visitor';
}