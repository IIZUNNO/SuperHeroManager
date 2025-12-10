
import { Hero } from './Hero';

// Type pour les valeurs initiales du formulaire
export interface HeroFormValues {
    nom: string;
    alias: string;
    univers: 'Marvel' | 'DC' | 'Autre';
    pouvoirs: string; // Sera une chaîne JSON stringifiée du côté front-end
    description: string;
    origine: string;
    premiereApparition: string;
    imageFile?: File | null; // L'objet fichier pour l'upload
}

// Les données d'un héros existant pour l'édition (peut être null pour l'ajout)
export type InitialData = Hero | null;