// Seccion Controllers
import {
  createSeccion,
  getSeccionById,
  getSeccionesByCurso,
  getAllSecciones,
  getSeccionesWithFilters,
  updateSeccion,
  deleteSeccion,
  deactivateSeccion,
  getSeccionWithTemas,
  reordenarSecciones,
  getEstadisticasSeccion
} from '../controllers/SeccionTema';
import { Router } from 'express';

const seccionRouter = Router();
// ============================================
// RUTAS: SECCIONES
// ============================================

// CRUD Básico
seccionRouter.post('/', createSeccion);
seccionRouter.get('/', getAllSecciones);
seccionRouter.get('/filtros', getSeccionesWithFilters);
seccionRouter.get('/curso/:cursoId', getSeccionesByCurso);
seccionRouter.get('/:id', getSeccionById);
seccionRouter.put('/:id', updateSeccion);
seccionRouter.delete('/:id', deleteSeccion);
seccionRouter.patch('/:id/desactivar', deactivateSeccion);

// Consultas Avanzadas
seccionRouter.get('/:id/temas', getSeccionWithTemas);
seccionRouter.put('/curso/:cursoId/reordenar', reordenarSecciones);
seccionRouter.get('/:id/estadisticas', getEstadisticasSeccion);

export  default seccionRouter ;