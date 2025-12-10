import mongoose, { Schema, Document } from 'mongoose';

export interface IHero extends Document {
    nom: string;
    alias?: string;  
    universe: string;
    pouvoirs: string[];
    description?: string; 
    image: string;
    origine?: string;  
    premiereApparition?: string;  
    createdAt: Date;
}

const HeroSchema: Schema = new Schema({
    nom: {
        type: String,
        required: [true, 'Le nom est requis'],
        trim: true
    },
    alias: {
        type: String,
        trim: true
    },
    universe: {
        type: String,
        enum: ['Marvel', 'DC', 'Autre'],
        default: 'Autre'
    },
    pouvoirs: [{
        type: String,
        trim: true
    }],
    description: {
        type: String,
        trim: true
    },
    image: {
        type: String,
        default: '/uploads/default-hero.jpg'
    },
    origine: {
        type: String,
        trim: true
    },
    premiereApparition: {
        type: String,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export const Hero = mongoose.model<IHero>('Hero', HeroSchema);