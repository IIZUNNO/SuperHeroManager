// Types pour les utilisateurs
export interface User {
  id: string;
  username: string;
  role: 'admin' | 'editor';
}

// Types pour les héros
export interface Hero {
  _id?: string;
  nom: string;
  alias: string;
  universe: 'Marvel' | 'DC' | 'Autre';
  pouvoirs: string[];
  description: string;
  image?: string;
  origine: string;
  premiereApparition: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface HeroFormData {
  nom: string;
  alias: string;
  universe: 'Marvel' | 'DC' | 'Autre';
  pouvoirs: string;
  description: string;
  image?: File;
  origine: string;
  premiereApparition: string;
}

// Types pour l'authentification
export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: User;
  };
}

export interface LoginFormData {
  username: string;
  password: string;
}

export interface RegisterFormData {
  username: string;
  password: string;
  role: 'admin' | 'editor';
}