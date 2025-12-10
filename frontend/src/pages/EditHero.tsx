// frontend/src/pages/EditHero.tsx

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import HeroForm from '../components/HeroForm';
import { getHeroById, updateHero } from '../api/heroApi';
import { type Hero } from '../types/Hero';

const EditHero: React.FC = () => {
    // 1. Récupérer l'ID du héros depuis l'URL (défini dans App.tsx comme /edit/:id)
    const { id } = useParams<{ id: string }>();
    const heroId = id!; 
    
    const [heroData, setHeroData] = useState<Hero | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // 2. Charger les données du héros au montage
    useEffect(() => {
        const fetchHero = async () => {
            try {
                const data = await getHeroById(heroId);
                setHeroData(data);
            } catch (err) {
                console.error("Erreur de chargement du héros:", err);
                setError("Impossible de charger les données du héros.");
            } finally {
                setLoading(false);
            }
        };
        fetchHero();
    }, [heroId]);


    // 3. Fonction de soumission (mise à jour)
    const handleUpdateHero = async (formData: FormData) => {
        // Appeler la fonction de mise à jour de l'API avec l'ID du héros
        await updateHero(heroId, formData); 
        // Le HeroForm gère la redirection après succès
    };


    if (loading) return <p>Chargement des données du héros...</p>;
    if (error) return <p className="error">{error}</p>;
    if (!heroData) return <p>Héros non trouvé.</p>; // Si loading est false mais heroData est null

    return (
        <HeroForm
            title={`Modifier le Héros: ${heroData.alias}`}
            initialData={heroData} // Passer les données chargées
            onSubmitForm={handleUpdateHero} // Passer la fonction de mise à jour
            isEdit={true}
        />
    );
};

export default EditHero;