// frontend/src/components/HeroForm.tsx

import React, { useRef, useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import type { HeroFormValues, InitialData } from '../types/FormTypes'; // Import du nouveau type

// Schéma de validation avec Yup
const HeroSchema = Yup.object().shape({
    nom: Yup.string().required('Le nom est requis.'),
    alias: Yup.string().required('L’alias est requis.'),
    univers: Yup.string().oneOf(['Marvel', 'DC', 'Autre']).required('L’univers est requis.'),
    description: Yup.string().min(20, 'Doit contenir au moins 20 caractères.').required('La description est requise.'),
    pouvoirs: Yup.string().required('Les pouvoirs sont requis (liste séparée par des virgules).'),
});

// Définir les props du formulaire
interface HeroFormProps {
    initialData: InitialData; 
    onSubmitForm: (formData: FormData) => Promise<void>; 
    title: string;
    isEdit: boolean;
}

const HeroForm: React.FC<HeroFormProps> = ({ initialData, onSubmitForm, title, isEdit }) => {
    const navigate = useNavigate();
    const [statusMessage, setStatusMessage] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
    const fileRef = useRef<HTMLInputElement>(null);

    // Initialisation des valeurs de Formik
    const initialValues: HeroFormValues = {
        nom: initialData?.nom || '',
        alias: initialData?.alias || '',
        univers: initialData?.univers || 'Autre',
        // Convertir le tableau de pouvoirs en chaîne pour le formulaire (join par virgule)
        pouvoirs: initialData?.pouvoirs.join(', ') || '', 
        description: initialData?.description || '',
        origine: initialData?.origine || '',
        premiereApparition: initialData?.premiereApparition || '',
        imageFile: null,
    };

    const formik = useFormik({
        initialValues,
        validationSchema: HeroSchema,
        enableReinitialize: true, // Permet de recharger les données si initialData change (utile pour l'édition)
        
        onSubmit: async (values) => {
            setStatusMessage(null);
            
            // 1. Créer l'objet FormData pour gérer l'upload de fichiers
            const formData = new FormData();

            // Ajouter les champs de texte
            Object.keys(values).forEach(key => {
                const value = values[key as keyof HeroFormValues];
                // Ignorer le champ 'imageFile' ici, nous l'ajoutons séparément
                if (key !== 'imageFile' && value !== null && value !== undefined) {
                     // Gérer spécifiquement le tableau de pouvoirs en stringifiant
                    if (key === 'pouvoirs' && typeof value === 'string') {
                         formData.append(key, JSON.stringify(value.split(',').map(p => p.trim()))); 
                    } else {
                        formData.append(key, String(value));
                    }
                }
            });

            // 2. Ajouter le fichier image
            if (values.imageFile) {
                formData.append('image', values.imageFile); 
            }

            // 3. Appeler la fonction d'envoi (passée par AddHero ou EditHero)
            try {
                await onSubmitForm(formData);
                setStatusMessage({ message: `Héros ${isEdit ? 'mis à jour' : 'ajouté'} avec succès ! Redirection...`, type: 'success' });
                // Rediriger vers le tableau de bord après un court délai
                setTimeout(() => navigate('/'), 2000); 

            } catch (error) {
                setStatusMessage({ message: `Erreur lors de la soumission du héros.`, type: 'error' });
                console.error('Erreur de soumission:', error);
            }
        },
    });

    // Afficher un aperçu de l'image sélectionnée (si le fichier est mis à jour)
    const [previewImage, setPreviewImage] = useState<string | null>(initialData?.image || null);

    useEffect(() => {
        if (formik.values.imageFile) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result as string);
            };
            reader.readAsDataURL(formik.values.imageFile);
        } else if (initialData?.image && !formik.values.imageFile) {
            setPreviewImage(initialData.image); // Afficher l'image existante
        } else if (!isEdit) {
            setPreviewImage(null); // Nettoyer pour un nouvel ajout
        }
    }, [formik.values.imageFile, initialData, isEdit]);


    return (
        <div className="hero-form-container">
            <h2>{title}</h2>
            {/* Messages de statut */}
            {statusMessage && (
                <div className={`status-message ${statusMessage.type}`}>
                    {statusMessage.message}
                </div>
            )}

            <form onSubmit={formik.handleSubmit} encType="multipart/form-data">
                {/* Champ Nom */}
                <div></div> className="form-group"
                    <label htmlFor="nom">Nom Réel</label>
               {/* Champ Nom */}
<div className="form-group">
    <label htmlFor="nom">Nom Réel</label>
    <input id="nom" type="text" {...formik.getFieldProps('nom')} />
    {formik.touched.nom && formik.errors.nom && <div className="error-text">{formik.errors.nom}</div>}
</div>

{/* Champ Alias */}
<div className="form-group">
    <label htmlFor="alias">Alias (Nom de Héros)</label>
    <input id="alias" type="text" {...formik.getFieldProps('alias')} />
    {formik.touched.alias && formik.errors.alias && <div className="error-text">{formik.errors.alias}</div>}
</div>

{/* Champ Univers */}
<div className="form-group">
    <label htmlFor="univers">Univers</label>
    <select id="univers" {...formik.getFieldProps('univers')}>
        <option value="Marvel">Marvel</option>
        <option value="DC">DC</option>
        <option value="Autre">Autre</option>
    </select>
    {formik.touched.univers && formik.errors.univers && <div className="error-text">{formik.errors.univers}</div>}
</div>

{/* Champ Pouvoirs */}
<div className="form-group">
    <label htmlFor="pouvoirs">Pouvoirs (séparés par une virgule)</label>
    <input id="pouvoirs" type="text" {...formik.getFieldProps('pouvoirs')} />
    {formik.touched.pouvoirs && formik.errors.pouvoirs && <div className="error-text">{formik.errors.pouvoirs}</div>}
</div>

{/* Champ Description */}
<div className="form-group">
    <label htmlFor="description">Description</label>
    <textarea id="description" {...formik.getFieldProps('description')} rows={4} />
    {formik.touched.description && formik.errors.description && <div className="error-text">{formik.errors.description}</div>}
</div>

{/* Champ Origine et Première Apparition  */}
<div className="form-group-row">
    <div className="form-group">
        <label htmlFor="origine">Origine</label>
        <input id="origine" type="text" {...formik.getFieldProps('origine')} />
    </div>
    <div className="form-group">
        <label htmlFor="premiereApparition">Première Apparition</label>
        <input id="premiereApparition" type="text" {...formik.getFieldProps('premiereApparition')} />
    </div>
</div>

                {/* Champ Upload d'Image */}
                <div className="form-group upload-group">
                    <label htmlFor="imageFile">Image du Héros</label>
                    <input
                        id="imageFile"
                        name="imageFile"
                        type="file"
                        accept="image/*"
                        ref={fileRef}
                        onChange={(event) => {
                            formik.setFieldValue('imageFile', event.currentTarget.files ? event.currentTarget.files[0] : null);
                        }}
                    />
                    {previewImage && (
                        <div className="image-preview">
                            <p>Aperçu de l'image actuelle:</p>
                            <img src={previewImage} alt="Aperçu du héros" style={{ maxWidth: '200px', maxHeight: '200px' }} />
                        </div>
                    )}
                </div>


                <div className="form-actions">
                    <button type="submit" disabled={formik.isSubmitting || !formik.isValid}>
                        {isEdit ? 'Mettre à jour le Héros' : 'Ajouter le Héros'}
                    </button>
                    <button type="button" onClick={() => navigate('/')} className="btn-cancel">
                        Annuler
                    </button>
                </div>
            </form>
        </div>
    );
};

export default HeroForm;