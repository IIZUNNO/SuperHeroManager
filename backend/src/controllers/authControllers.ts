import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

// @desc    Inscription utilisateur
// @route   POST /api/auth/register
// @access  Public
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password, role = 'editor' } = req.body;

    // Validation
    if (!username || !password) {
      res.status(400).json({
        success: false,
        message: 'Nom d\'utilisateur et mot de passe requis'
      });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({
        success: false,
        message: 'Le mot de passe doit contenir au moins 6 caractères'
      });
      return;
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      res.status(400).json({
        success: false,
        message: 'Nom d\'utilisateur déjà utilisé'
      });
      return;
    }

    // Hasher le mot de passe
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Créer l'utilisateur
    const user = await User.create({
      username,
      passwordHash,
      role
    });

    // Générer le token JWT
    const token = jwt.sign(
      { userId: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'Utilisateur créé avec succès',
      data: {
        token,
        user: {
          id: user._id,
          username: user.username,
          role: user.role
        }
      }
    });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'inscription'
    });
  }
};

// @desc    Connexion utilisateur
// @route   POST /api/auth/login
// @access  Public
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;

    // Validation
    if (!username || !password) {
      res.status(400).json({
        success: false,
        message: 'Nom d\'utilisateur et mot de passe requis'
      });
      return;
    }

    // Trouver l'utilisateur
    const user = await User.findOne({ username });
    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Identifiants invalides'
      });
      return;
    }

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        message: 'Identifiants invalides'
      });
      return;
    }

    // Générer le token JWT
    const token = jwt.sign(
      { userId: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      success: true,
      message: 'Connexion réussie',
      data: {
        token,
        user: {
          id: user._id,
          username: user.username,
          role: user.role
        }
      }
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la connexion'
    });
  }
};

// @desc    Récupérer le profil utilisateur
// @route   GET /api/auth/me
// @access  Privé
export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    // L'utilisateur est attaché à la requête par le middleware d'authentification
    const user = await User.findById((req as any).user.userId).select('-passwordHash');
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error getting user profile:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};