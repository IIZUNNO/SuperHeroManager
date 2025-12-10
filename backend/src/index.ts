import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { connectDB } from './config/db';
import heroRoutes from './routes/heroRoutes';
import authRoutes from './routes/authRoutes';

// Charge les variables d'environnement
dotenv.config();

// Debug
console.log('🔧 PORT:', process.env.PORT);

// Initialisation
const app = express();
const PORT = process.env.PORT || 5000;

// Connexion DB
connectDB();

app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000'], // Frontend ports
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/images', express.static(path.join(__dirname, '../public-images')));

app.get('/images/placeholder-hero.png', (req, res) => {
    // Redirige vers une image par défaut si elle existe
    const defaultImage = path.join(__dirname, '../public-images/default-hero.png');
    const placeholder = path.join(__dirname, '../public-images/placeholder.png');
    
    if (require('fs').existsSync(defaultImage)) {
        res.sendFile(defaultImage);
    } else if (require('fs').existsSync(placeholder)) {
        res.sendFile(placeholder);
    } else {
        // Crée une image placeholder simple
        res.status(404).json({ error: 'Image placeholder not found' });
    }
});

// Routes de base
app.get('/api/health', (req, res) => {
    res.status(200).json({ 
        message: 'SuperHeroManager API is running!', 
        timestamp: new Date().toISOString() 
    });
});

// Routes API
app.use('/api/heroes', heroRoutes);
app.use('/api/auth', authRoutes);

// Route 404
app.use('*', (req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// Démarrage
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🌐 CORS enabled for: http://localhost:5173`);
    console.log(`🖼️ Images available at: http://localhost:${PORT}/images/`);
});