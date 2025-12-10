// frontend/src/components/HeroCard.tsx
import React, { useState, useEffect } from 'react'; 
import {type Hero } from '../types/Hero';
import { getImageUrl } from '../api/heroApi';

interface HeroCardProps {
    hero: Hero;
    onDelete: (id: string) => void;
}

const HeroCard: React.FC<HeroCardProps> = ({ hero, onDelete }) => {
    const [imageError, setImageError] = useState(false);
    
    // Reset imageError quand l'héro change
    useEffect(() => {
        setImageError(false);
    }, [hero.image]);

    return (
        <div className="hero-card">
            <div className="hero-image">
                <img 
                    src={imageError ? '/images/placeholder-hero.png' : getImageUrl(hero.image)}
                    alt={hero.nom}
                    onError={() => setImageError(true)}
                    loading="lazy"
                />
            </div>
            
            <div className="hero-content">
                <h3>{hero.nom}</h3>
                {hero.alias && <p className="alias">"{hero.alias}"</p>}
                
                <div className="universe-badge">
                    {hero.univers}
                </div>
                
                {hero.pouvoirs && hero.pouvoirs.length > 0 && (
                    <div className="powers">
                        <div className="power-tags">
                            {hero.pouvoirs.slice(0, 3).map((pouvoir, index) => (
                                <span key={index} className="power-tag">{pouvoir}</span>
                            ))}
                        </div>
                    </div>
                )}
                
                <div className="hero-actions">
                    <button className="btn-view">👁️ Voir</button>
                    <button className="btn-edit">✏️ Modifier</button>
                    <button 
                        className="btn-delete"
                        onClick={() => onDelete(hero._id)}
                    >
                        🗑️ Supprimer
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HeroCard;