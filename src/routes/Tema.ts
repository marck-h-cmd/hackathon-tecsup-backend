// Tema Controllers
import {
  createTema,
  getTemaById,
  getTemasBySeccion,
  getTemasByCurso,
  getAllTemas,
  getTemasWithFilters,
  updateTema,
  deleteTema,
  deactivateTema,
  reordenarTemas,
  getTemasByTipo,
  duplicarTema,
  moverTema,
  getEstadisticasTema,
  getEstadisticasPorTipo
} from '../controllers/SeccionTema';

import { Router } from 'express';
const temaRouter = Router();


// ============================================
// RUTAS: TEMAS
// ============================================

// CRUD Básico
temaRouter.post('/', createTema);
temaRouter.get('/', getAllTemas);
temaRouter.get('/filtros', getTemasWithFilters);
temaRouter.get('/seccion/:seccionId', getTemasBySeccion);
temaRouter.get('/curso/:cursoId', getTemasByCurso);
temaRouter.get('/tipo/:tipo', getTemasByTipo);
temaRouter.get('/estadisticas/tipos', getEstadisticasPorTipo);
temaRouter.get('/:id', getTemaById);
temaRouter.put('/:id', updateTema);
temaRouter.delete('/:id', deleteTema);
temaRouter.patch('/:id/desactivar', deactivateTema);

// Consultas Avanzadas
temaRouter.put('/seccion/:seccionId/reordenar', reordenarTemas);
temaRouter.post('/:id/duplicar', duplicarTema);
temaRouter.put('/:id/mover', moverTema);
temaRouter.get('/:id/estadisticas', getEstadisticasTema);

export  default temaRouter ;