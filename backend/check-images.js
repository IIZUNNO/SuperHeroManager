// backend/check-images.js
const mongoose = require('mongoose');
require('dotenv').config();

async function checkImages() {
    await mongoose.connect(process.env.MONGO_URI);
    const { Hero } = require('./src/models/Hero');
    
    // Compter par type d'image
    const heroes = await Hero.find();
    
    console.log('📊 ANALYSE DES IMAGES DANS LA BDD:');
    console.log('==================================');
    
    const stats = {
        total: heroes.length,
        noImage: 0,
        defaultHero: 0,
        hasImage: 0,
        imageTypes: {}
    };
    
    heroes.forEach(hero => {
        if (!hero.image || hero.image.trim() === '') {
            stats.noImage++;
        } else if (hero.image.includes('default-hero')) {
            stats.defaultHero++;
            console.log(`❌ ${hero.nom}: ${hero.image}`);
        } else {
            stats.hasImage++;
            // Extraire le type
            const match = hero.image.match(/\/([^\/]+)\/[^\/]+$/);
            if (match) {
                const type = match[1];
                stats.imageTypes[type] = (stats.imageTypes[type] || 0) + 1;
            }
        }
    });
    
    console.log('\n📈 STATISTIQUES:');
    console.log(`Total héros: ${stats.total}`);
    console.log(`Sans image: ${stats.noImage}`);
    console.log(`Avec default-hero: ${stats.defaultHero}`);
    console.log(`Avec vraie image: ${stats.hasImage}`);
    console.log('\n📁 Types d\'images:');
    Object.entries(stats.imageTypes).forEach(([type, count]) => {
        console.log(`  ${type}: ${count}`);
    });
    
    // Afficher 5 héros avec default-hero
    console.log('\n🔧 Héros à corriger (premiers 5):');
    const toFix = heroes.filter(h => h.image && h.image.includes('default-hero')).slice(0, 5);
    toFix.forEach(hero => {
        console.log(`  ${hero.nom}: ${hero.image}`);
    });
    
    await mongoose.disconnect();
}

checkImages().catch(console.error);