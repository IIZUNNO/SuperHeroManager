import express from 'express';
import {
  getHeroes,
  getHeroById,
  createHero,
  updateHero,
  deleteHero
} from '../controllers/heroController';
import { authMiddleware, requireRole } from '../middleware/authMiddleware';
import { uploadMiddleware } from '../middleware/uploadMiddleware';

const router = express.Router();

router.route('/')
  .get(getHeroes)
  .post(authMiddleware, requireRole(['admin', 'editor']), uploadMiddleware.single('image'), createHero);

router.route('/:id')
  .get(getHeroById)
  .put(authMiddleware, requireRole(['admin', 'editor']), updateHero)
  .delete(authMiddleware, requireRole(['admin']), deleteHero);

export default router;