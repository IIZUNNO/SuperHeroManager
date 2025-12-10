// frontend/src/App.tsx (Structure des Routes)

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Importez vos composants
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import AddHero from './pages/AddHero';
import EditHero from './pages/EditHero';
import HeroDetails from './pages/HeroDetails';
import ProtectedRoute from './components/ProtectedRoutes'; // 👈 Le nouveau composant

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                {/* Route non protégée */}
                <Route path="/login" element={<LoginPage />} />
                
                {/* 🔑 Routes Protégées (Toutes les pages de gestion) */}
                <Route element={<ProtectedRoute />}>
                    {/* Le Dashboard est la page d'accueil après connexion */}
                    <Route path="/" element={<Dashboard />} /> 
                    <Route path="/dashboard" element={<Dashboard />} /> 

                    {/* Routes CRUD */}
                    <Route path="/heroes/add" element={<AddHero />} />
                    <Route path="/heroes/edit/:id" element={<EditHero />} />
                    <Route path="/heroes/:id" element={<HeroDetails />} />
                </Route>

                {/* 👑 Route protégée par rôle (Exemple : Administration, si nécessaire) */}
                {/* <Route element={<ProtectedRoute requiredRole="admin" />}>
                    <Route path="/admin" element={<AdminPage />} />
                </Route>
                */}

            </Routes>
        </Router>
    );
};

export default App;