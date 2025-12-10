import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import type { Hero } from '../types';
import HeroCard from '../components/HeroCard';

const Heroes: React.FC = () => {
  const [heroes, setHeroes] = useState<Hero[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // Charger les héros au démarrage
  useEffect(() => {
    const fetchHeroes = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        const response = await axios.get('http://localhost:5000/api/heroes', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.data.success) {
          setHeroes(response.data.data);
        }
      } catch (error: any) {
        setError('Erreur lors du chargement des héros');
        console.error('Error:', error);
        
        // Si token invalide, redirige vers login
        if (error.response?.status === 401) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchHeroes();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleAddHero = () => {
    alert('Fonctionnalité à implémenter !');
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh',
        fontSize: '18px',
        color: '#666'
      }}>
        Chargement des héros...
      </div>
    );
  }

  return (
    <div>
      {/* En-tête */}
      <header style={{
        backgroundColor: '#343a40',
        color: 'white',
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.5rem' }}>🦸 Liste des Super-Héros</h1>
          <p style={{ margin: '5px 0 0 0', fontSize: '14px', opacity: 0.8 }}>
            {heroes.length} héros dans la base de données
          </p>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span>
            Connecté en tant que <strong>{user.username}</strong> ({user.role})
          </span>
          <button
            onClick={handleAddHero}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            + Ajouter un héros
          </button>
          <button
            onClick={handleLogout}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Déconnexion
          </button>
        </div>
      </header>

      {/* Message d'erreur */}
      {error && (
        <div style={{
          backgroundColor: '#f8d7da',
          color: '#721c24',
          padding: '1rem',
          margin: '1rem',
          borderRadius: '4px',
          border: '1px solid #f5c6cb'
        }}>
          {error}
        </div>
      )}

      {/* Liste des héros */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '1rem',
        padding: '2rem'
      }}>
        {heroes.map(hero => (
          <HeroCard key={hero._id} hero={hero} />
        ))}
      </div>

      {/* Message si aucun héros */}
      {heroes.length === 0 && !loading && (
        <div style={{ 
          textAlign: 'center', 
          padding: '3rem',
          color: '#6c757d'
        }}>
          <h3>🎭 Aucun héros trouvé</h3>
          <p>Commencez par ajouter un héros à votre collection !</p>
        </div>
      )}
    </div>
  );
};

export default Heroes;