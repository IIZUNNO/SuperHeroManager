import { Request, Response } from 'express';
import { Hero, IHero } from '../models/Hero';

// @desc    Récupérer tous les héros
// @route   GET /api/heroes
// @access  Public
export const getHeroes = async (req: Request, res: Response): Promise<void> => {
  try {
    const { search, universe, sort } = req.query;
    
    // Construction de la requête de filtrage
    let query: any = {};
    
    if (search) {
      query.$or = [
        { nom: { $regex: search, $options: 'i' } },
        { alias: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (universe && universe !== 'all') {
      query.universe = universe;
    }
    
    // Construction du tri
    let sortOptions: any = { createdAt: -1 }; // Par défaut: plus récent d'abord
    
    if (sort === 'name') {
      sortOptions = { nom: 1 };
    } else if (sort === 'oldest') {
      sortOptions = { createdAt: 1 };
    }
    
    const heroes = await Hero.find(query).sort(sortOptions);
    
    res.status(200).json({
      success: true,
      count: heroes.length,
      data: heroes
    });
  } catch (error) {
    console.error('Error getting heroes:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération des héros'
    });
  }
};

// @desc    Récupérer un héros par son ID
// @route   GET /api/heroes/:id
// @access  Public
export const getHeroById = async (req: Request, res: Response): Promise<void> => {
  try {
    const hero = await Hero.findById(req.params.id);
    
    if (!hero) {
      res.status(404).json({
        success: false,
        message: 'Héros non trouvé'
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      data: hero
    });
  } catch (error) {
    console.error('Error getting hero by ID:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};

// @desc    Créer un nouveau héros
// @route   POST /api/heroes
// @access  Privé (Admin/Editor)
export const createHero = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nom, alias, universe, pouvoirs, description, origine, premiereApparition } = req.body;
    
    // Validation des champs requis
    if (!nom || !alias || !universe || !description || !origine || !premiereApparition) {
      res.status(400).json({
        success: false,
        message: 'Tous les champs obligatoires doivent être remplis'
      });
      return;
    }
    
    const heroData: Partial<IHero> = {
      nom,
      alias,
      universe,
      pouvoirs: Array.isArray(pouvoirs) ? pouvoirs : [pouvoirs].filter(Boolean),
      description,
      origine,
      premiereApparition
    };
    
    // Gestion de l'image si uploadée
    if (req.file) {
      heroData.image = `/uploads/${req.file.filename}`;
    }
    
    const hero = await Hero.create(heroData);
    
    res.status(201).json({
      success: true,
      message: 'Héros créé avec succès',
      data: hero
    });
  } catch (error) {
    console.error('Error creating hero:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création du héros'
    });
  }
};

// @desc    Mettre à jour un héros
// @route   PUT /api/heroes/:id
// @access  Privé (Admin/Editor)
export const updateHero = async (req: Request, res: Response): Promise<void> => {
  try {
    const hero = await Hero.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!hero) {
      res.status(404).json({
        success: false,
        message: 'Héros non trouvé'
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      message: 'Héros mis à jour avec succès',
      data: hero
    });
  } catch (error) {
    console.error('Error updating hero:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du héros'
    });
  }
};

// @desc    Supprimer un héros
// @route   DELETE /api/heroes/:id
// @access  Privé (Admin seulement)
export const deleteHero = async (req: Request, res: Response): Promise<void> => {
  try {
    const hero = await Hero.findById(req.params.id);
    
    if (!hero) {
      res.status(404).json({
        success: false,
        message: 'Héros non trouvé'
      });
      return;
    }
    
    // TODO: Supprimer l'image associée si elle existe
    
    await Hero.findByIdAndDelete(req.params.id);
    
    res.status(200).json({
      success: true,
      message: 'Héros supprimé avec succès'
    });
  } catch (error) {
    console.error('Error deleting hero:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression du héros'
    });
  }
};