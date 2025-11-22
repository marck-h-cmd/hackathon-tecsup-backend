import express from 'express';
import {
  createCarrera,
  getCarreras,
  getCarreraById,
  getCarrerasByArea,
  updateCarrera,
  deactivateCarrera
} from '../controllers/Carrera';

const authenticateClerkToken = require('../middleware/auth');
const router = express.Router();

router.post('/', authenticateClerkToken, createCarrera);
router.get('/', authenticateClerkToken, getCarreras);
router.get('/:id', authenticateClerkToken, getCarreraById);
router.get('/area/:areaId', authenticateClerkToken, getCarrerasByArea);
router.put('/:id', authenticateClerkToken, updateCarrera);
router.delete('/:id', authenticateClerkToken, deactivateCarrera);

export default router;
