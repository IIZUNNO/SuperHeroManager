
import React from 'react';
import HeroForm from '../components/HeroForm';
import {type Hero } from '../types/Hero';
import { createHero } from '../api/heroApi'; 

const AddHero: React.FC = () => {
    // La fonction `createHero` prend l'objet FormData et l'envoie à l'API.
    const handleAddHero = async (formData: FormData) => {
        await createHero(formData); 
    };

    return (
        <HeroForm
            title="Ajouter un Nouveau Super-Héros"
            initialData={null} // Pas de données initiales pour l'ajout
            onSubmitForm={handleAddHero}
            isEdit={false}
        />
    );
};

export default AddHero;