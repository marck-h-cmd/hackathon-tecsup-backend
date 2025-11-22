import express from 'express';
import {
  createNotificacion,
  getNotificacionesByUsuario,
  getNotificacionById,
  markAsLeida,
  deactivateNotificacion
} from '../controllers/Notificacion';

const authenticateClerkToken = require('../middleware/auth');

const router = express.Router();


router.post('/', authenticateClerkToken, createNotificacion);


router.get('/', authenticateClerkToken, getNotificacionesByUsuario);


router.get('/:id', authenticateClerkToken, getNotificacionById);

router.patch('/:id/leida', authenticateClerkToken, markAsLeida);


router.delete('/:id', authenticateClerkToken, deactivateNotificacion);

export default router;
