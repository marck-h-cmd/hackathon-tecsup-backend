import { Router } from 'express';

// Curso Controllers
import {
  createCurso,
  getCursoById,
  getCursoByCodigo,
  getAllCursos,
  getCursosWithFilters,
  updateCurso,
  deleteCurso,
  deactivateCurso,
  getCursoWithSecciones,
  getCursoCompleto,
  getCursosPublicos,
  getEstadisticasCurso,
  getEstadisticasGeneralesCursos
} from '../controllers/SeccionTema';

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

const cursoRouter = Router();
const seccionRouter = Router();
const temaRouter = Router();

// ============================================
// RUTAS: CURSOS
// ============================================

// CRUD Básico
cursoRouter.post('/', createCurso);
cursoRouter.get('/', getAllCursos);
cursoRouter.get('/filtros', getCursosWithFilters);
cursoRouter.get('/publicos', getCursosPublicos);
cursoRouter.get('/estadisticas', getEstadisticasGeneralesCursos);
cursoRouter.get('/:id', getCursoById);
cursoRouter.get('/codigo/:codigo', getCursoByCodigo);
cursoRouter.put('/:id', updateCurso);
cursoRouter.delete('/:id', deleteCurso);
cursoRouter.patch('/:id/desactivar', deactivateCurso);

// Consultas Avanzadas
cursoRouter.get('/:id/secciones', getCursoWithSecciones);
cursoRouter.get('/:id/completo', getCursoCompleto);
cursoRouter.get('/:id/estadisticas', getEstadisticasCurso);

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

// ============================================
// EXPORTAR ROUTERS
// ============================================

export { cursoRouter, seccionRouter, temaRouter };