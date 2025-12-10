
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { type Hero } from '../types/Hero';
import { getHeroById } from '../api/heroApi';
import { useAuth } from '../context/AuthContext';

const HeroDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const heroId = id!;
    
    const { user } = useAuth();
    const canEdit = user && (user.role === 'admin' || user.role === 'editor');
    
    const [hero, setHero] = useState<Hero | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const data = await getHeroById(heroId);
                setHero(data);
            } catch (err) {
                setError("Désolé, les détails de ce héros n'ont pas pu être chargés.");
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [heroId]);

    const defaultImage = 'https://via.placeholder.com/600x400.png?text=Image+Manquante';
    const heroImageUrl = hero?.image && hero.image.startsWith('/') 
        ? hero.image
        : defaultImage;


    if (loading) return <div className="details-container"><p>Chargement des détails...</p></div>;
    if (error) return <div className="details-container"><p className="error">{error}</p></div>;
    if (!hero) return <div className="details-container"><p>Héros introuvable.</p></div>;

    return (
        <div className="details-container">
            <div className="details-header">
                <h1>{hero.alias} <span className="real-name">({hero.nom})</span></h1>
                
                {canEdit && (
                    <Link to={`/edit/${hero._id}`} className="btn btn-edit-details">
                        Modifier les informations
                    </Link>
                )}
            </div>
            
            <div className="details-content">
                <div className="image-details">
                    <img 
                        src={heroImageUrl} 
                        alt={hero.alias} 
                        onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                            e.currentTarget.src = defaultImage;
                        }}
                    />
                    <div className="details-meta">
                        <p><strong>Univers :</strong> {hero.univers}</p>
                        <p><strong>Origine :</strong> {hero.origine}</p>
                        <p><strong>Première Apparition :</strong> {hero.premiereApparition}</p>
                    </div>
                </div>

                <div className="description-details">
                    <h2>Description</h2>
                    <p>{hero.description}</p>

                    <h2>Pouvoirs</h2>
                    <div className="pouvoirs-list">
                        {hero.pouvoirs.map((p, index) => (
                            <span key={index} className="power-tag-large">{p}</span>
                        ))}
                    </div>
                </div>
            </div>

            <Link to="/" className="btn btn-back">
                Retour au Tableau de Bord
            </Link>
        </div>
    );
};

export default HeroDetails;