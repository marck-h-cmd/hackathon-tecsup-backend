import { Router } from 'express';
import {
  createEjercicio,
  getEjercicioById,
  getEjerciciosByTema,
  getAllEjercicios,
  getEjerciciosWithFilters,
  updateEjercicio,
  deleteEjercicio,
  deactivateEjercicio,
  getEjerciciosByTipo,
  reordenarEjercicios,
  duplicarEjercicio,
  verificarRespuesta,
  getEstadisticasEjercicio,
  getEstadisticasPorTipo
} from '../controllers/Ejercicio';

const ejercicioRouter = Router();

// CRUD Básico
ejercicioRouter.post('/', createEjercicio);
ejercicioRouter.get('/', getAllEjercicios);
ejercicioRouter.get('/filtros', getEjerciciosWithFilters);
ejercicioRouter.get('/tema/:temaId', getEjerciciosByTema);
ejercicioRouter.get('/tipo/:tipo', getEjerciciosByTipo);
ejercicioRouter.get('/estadisticas/tipos', getEstadisticasPorTipo);
ejercicioRouter.get('/:id', getEjercicioById);
ejercicioRouter.put('/:id', updateEjercicio);
ejercicioRouter.delete('/:id', deleteEjercicio);
ejercicioRouter.patch('/:id/desactivar', deactivateEjercicio);

// Consultas Avanzadas
ejercicioRouter.put('/tema/:temaId/reordenar', reordenarEjercicios);
ejercicioRouter.post('/:id/duplicar', duplicarEjercicio);
ejercicioRouter.post('/:id/verificar', verificarRespuesta);
ejercicioRouter.get('/:id/estadisticas', getEstadisticasEjercicio);

export default ejercicioRouter;