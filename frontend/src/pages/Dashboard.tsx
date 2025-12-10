// frontend/src/pages/Dashboard.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { getHeroes, deleteHero } from '../api/heroApi';
import { type Hero } from '../types/Hero'; 
import HeroCard from '../components/HeroCard'; 
import SearchBar from './../components/SearchBar';
import { useAuth } from '../context/AuthContext';

const Dashboard: React.FC = () => {
    const [heroes, setHeroes] = useState<Hero[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();

    // Fonction pour charger les héros
    const loadHeroes = useCallback(async (query: string = '') => {
        setLoading(true);
        setError(null);
        try {
            console.log('📡 Appel API pour les héros...');
            
            const data = await getHeroes(query);
            
            console.log('✅ Héros reçus:', data.length, 'héros');
            console.log('👑 Exemple du premier héros:', data[0]);
            
            setHeroes(data);
        } catch (err) {
            console.error("❌ Erreur lors du chargement des héros:", err);
            setError("Impossible de charger les héros. Vérifiez que le back-end est démarré.");
        } finally {
            setLoading(false);
        }
    }, []);

    // Déclencher le chargement initial
    useEffect(() => {
        loadHeroes(searchQuery);
    }, [searchQuery, loadHeroes]);

    // Fonction pour la suppression
    const handleDelete = async (heroId: string) => {
        if (user && (user.role === 'admin' || user.role === 'editor')) {
            if (window.confirm("Êtes-vous sûr de vouloir supprimer ce super-héros ?")) {
                try {
                    await deleteHero(heroId);
                    // Recharger la liste
                    loadHeroes(searchQuery);
                } catch (err) {
                    console.error("Erreur de suppression:", err);
                    alert("Échec de la suppression.");
                }
            }
        } else {
            alert("Vous n'avez pas la permission de supprimer des héros.");
        }
    };

    if (loading) return <div className="loading">🔄 Chargement des héros...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="dashboard-container">
            <h1>🦸 Tableau de Bord des Super-Héros</h1>
            
            {/* Barre de Recherche */}
            <SearchBar 
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
            />

            {/* Statistiques */}
            <div className="dashboard-stats">
                <p>📊 <strong>{heroes.length}</strong> héros dans la base de données</p>
            </div>

            {/* Bouton d'ajout (accessible aux éditeurs et admins) */}
            {user && (user.role === 'admin' || user.role === 'editor') && (
                <button 
                    className="btn-add-hero"
                    onClick={() => { 
                        window.location.href = '/heroes/add';
                    }}
                >
                    ➕ Ajouter un nouveau héros
                </button>
            )}

            <div className="heroes-list">
                {heroes.length > 0 ? (
                    heroes.map((hero) => (
                        <HeroCard 
                            key={hero._id} 
                            hero={hero} 
                            onDelete={handleDelete}
                        />
                    ))
                ) : (
                    <div className="no-results">
                        <p>😕 Aucun héros trouvé correspondant à la recherche.</p>
                        <button 
                            onClick={() => setSearchQuery('')}
                            className="btn-reset"
                        >
                            Voir tous les héros
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;