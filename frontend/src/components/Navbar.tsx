// frontend/src/components/Navbar.tsx

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import du hook d'authentification

const Navbar: React.FC = () => {
    // Récupérer l'état de l'utilisateur et les fonctions du contexte
    const { user, logout } = useAuth(); 
    const navigate = useNavigate();

    // Vérification des rôles pour les liens conditionnels
    const isAdmin = user && user.role === 'admin';
    const isEditorOrAdmin = user && (user.role === 'admin' || user.role === 'editor');

    // Fonction de déconnexion
    const handleLogout = () => {
        logout(); // Efface l'état global et le localStorage
        navigate('/login'); // Redirige l'utilisateur vers la page de connexion
    };

    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <Link to="/">
                    🦸‍♂️ SuperHeroManager
                </Link>
            </div>
            
            <div className="navbar-links">
                {/* 1. LIENS VISIBLES SEULEMENT SI CONNECTÉ */}
                {user ? (
                    <>
                        {/* Tableau de Bord (Home) */}
                        <Link to="/" className="nav-link">
                            Héros
                        </Link>

                        {/* Lien d'ajout (visible pour Admin et Éditeur) */}
                        {isEditorOrAdmin && (
                            <Link to="/add" className="nav-link">
                                Ajouter un Héros
                            </Link>
                        )}
                        
                        {/* Lien Admin (visible pour Admin seulement) */}
                        {isAdmin && (
                            <Link to="/admin" className="nav-link">
                                Admin
                            </Link>
                        )}

                        {/* 2. INFOS UTILISATEUR ET DÉCONNEXION */}
                        <span className="user-info">
                            Connecté: <strong>{user.username}</strong> ({user.role})
                        </span>

                        <button onClick={handleLogout} className="nav-btn btn-logout">
                            Déconnexion
                        </button>
                    </>
                ) : (
                    /* 3. LIEN VISIBLE SEULEMENT SI DÉCONNECTÉ */
                    <Link to="/login" className="nav-btn btn-login">
                        Connexion
                    </Link>
                )}
            </div>
        </nav>
    );
};

export default Navbar;