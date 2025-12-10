// backend/fix-images.js
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function fixImages() {
    await mongoose.connect(process.env.MONGO_URI);
    const { Hero } = require('./src/models/Hero');
    
    // 1. Lister toutes les images disponibles
    const imagesDir = path.join(__dirname, 'public-images');
    const imageMap = new Map();
    
    const walkDir = (dir, prefix = '') => {
        const files = fs.readdirSync(dir);
        files.forEach(file => {
            const fullPath = path.join(dir, file);
            const relativePath = path.join(prefix, file);
            
            if (fs.statSync(fullPath).isDirectory()) {
                walkDir(fullPath, relativePath);
            } else if (file.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
                // Extraire le nom "propre" pour le matching
                const cleanName = file
                    .replace(/\.[^/.]+$/, '')
                    .toLowerCase()
                    .replace(/[^a-z0-9]/g, '');
                
                imageMap.set(cleanName, `/images/${relativePath}`);
            }
        });
    };
    
    if (fs.existsSync(imagesDir)) {
        walkDir(imagesDir);
    }
    
    console.log(`📸 ${imageMap.size} images disponibles`);
    
    // 2. Trouver et corriger les héros
    const heroes = await Hero.find();
    let fixed = 0;
    let unchanged = 0;
    
    for (const hero of heroes) {
        const oldImage = hero.image;
        
        // Si l'image est default-hero ou vide, on cherche une vraie image
        if (!oldImage || oldImage.includes('default-hero')) {
            // Nettoyer le nom du héros pour le matching
            const cleanHeroName = hero.nom
                .toLowerCase()
                .replace(/[^a-z0-9]/g, '');
            
            // Chercher une image correspondante
            let foundImage = null;
            
            // 1. Correspondance exacte
            if (imageMap.has(cleanHeroName)) {
                foundImage = imageMap.get(cleanHeroName);
            }
            // 2. Chercher dans les différentes tailles
            else {
                const sizes = ['lg', 'md', 'sm', 'xs'];
                for (const size of sizes) {
                    const possibleImage = `/images/${size}/${cleanHeroName}.jpg`;
                    const testPath = path.join(__dirname, 'public-images', size, `${cleanHeroName}.jpg`);
                    
                    if (fs.existsSync(testPath)) {
                        foundImage = possibleImage;
                        break;
                    }
                }
            }
            
            // Si on a trouvé une image, on met à jour
            if (foundImage) {
                hero.image = foundImage;
                await hero.save();
                fixed++;
                console.log(`✅ ${hero.nom}: ${oldImage} → ${foundImage}`);
            } else {
                unchanged++;
                console.log(`❌ ${hero.nom}: AUCUNE IMAGE TROUVÉE`);
            }
        } else {
            unchanged++;
        }
    }
    
    console.log('\n📊 RÉSULTAT:');
    console.log(`✅ Corrigés: ${fixed}`);
    console.log(`⏭️  Non modifiés: ${unchanged}`);
    
    await mongoose.disconnect();
}

fixImages().catch(console.error);