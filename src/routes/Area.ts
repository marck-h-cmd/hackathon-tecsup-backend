import express from 'express';
import {
  createArea,
  getAreas,
  getAreaById,
  getAreaWithCarreras,
  updateArea,
  deactivateArea
} from '../controllers/Area';

const authenticateClerkToken = require('../middleware/auth');
const router = express.Router();

router.post('/', authenticateClerkToken, createArea);
router.get('/', authenticateClerkToken, getAreas);
router.get('/:id', authenticateClerkToken, getAreaById);
router.get('/:id/carreras', authenticateClerkToken, getAreaWithCarreras);
router.put('/:id', authenticateClerkToken, updateArea);
router.delete('/:id', authenticateClerkToken, deactivateArea);

export default router;
