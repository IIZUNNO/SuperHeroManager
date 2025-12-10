import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { Hero } from '../models/Hero';

dotenv.config();

// Fonction pour normaliser l'univers
const normalizeUniverse = (rawUniverse: string): string => {
    if (!rawUniverse) return 'Autre';
    
    const lower = rawUniverse.toLowerCase().trim();
    
    // Détection Marvel
    if (lower.includes('marvel') || 
        lower === 'marvel comics' ||
        lower.includes('marvel comics')) {
        return 'Marvel';
    }
    
    // Détection DC
    if (lower.includes('dc') || 
        lower.includes('detective comics') ||
        lower.includes('dc comics') ||
        lower === 'dc comics') {
        return 'DC';
    }
    
    // Autres cas spécifiques
    if (lower === 'marvel universe') return 'Marvel';
    if (lower === 'dc universe') return 'DC';
    
    return 'Autre';
};

const importData = async () => {
    try {
        console.log('🔗 Connexion à MongoDB...');
        await mongoose.connect(process.env.MONGO_URI as string);
        console.log('✅ Connecté à MongoDB');

        // Vider la collection
        console.log('🗑️  Nettoyage des anciens héros...');
        await Hero.deleteMany({});
        console.log('✅ Collection nettoyée');

        // Lire le JSON
        const jsonPath = path.join(process.cwd(), 'SuperHerosComplet.json');
        const data = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
        const heroesArray = data.superheros;
        
        console.log(`📊 ${heroesArray.length} héros à traiter`);

        // Transformer les données
        console.log('🔄 Transformation des données...');
        const heroesToInsert = heroesArray.map((hero: any) => {
            const rawUniverse = (hero.universe || hero.univers || '').toString().trim();
            const normalizedUniverse = normalizeUniverse(rawUniverse);
            
            return {
                nom: hero.nom || hero.name || 'Héros sans nom',
                alias: hero.alias || hero.alias || '',
                universe: normalizedUniverse,
                pouvoirs: Array.isArray(hero.pouvoirs) ? hero.pouvoirs : 
                         Array.isArray(hero.powers) ? hero.powers : [],
                description: hero.description || hero.desc || '',
                image: hero.image || hero.imageUrl || '/uploads/default-hero.png',
                origine: hero.origine || hero.origin || '',
                premiereApparition: hero.premiereApparition || hero.firstAppearance || '',
                createdAt: new Date()
            };
        });

        // Insérer dans MongoDB
        console.log('💾 Insertion dans MongoDB...');
        await Hero.insertMany(heroesToInsert);
        
        console.log(`\n🎉 IMPORTATION RÉUSSIE !`);
        console.log(`📊 ${heroesToInsert.length} héros importés`);

        // Afficher les statistiques
        console.log('\n📋 STATISTIQUES :');
        const allHeroes = await Hero.find();
        
        const marvelCount = allHeroes.filter(h => h.universe === 'Marvel').length;
        const dcCount = allHeroes.filter(h => h.universe === 'DC').length;
        const otherCount = allHeroes.length - marvelCount - dcCount;
        
        console.log(`Marvel: ${marvelCount} héros`);
        console.log(`DC: ${dcCount} héros`);
        console.log(`Autre: ${otherCount} héros`);

        await mongoose.disconnect();
        console.log('\n✅ Terminé !');
        
    } catch (error: any) {
        console.error('❌ Erreur:', error.message);
        process.exit(1);
    }
};

importData();