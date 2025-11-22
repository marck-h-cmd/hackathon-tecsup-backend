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


const cursoRouter = Router();

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
// EXPORTAR ROUTERS
// ============================================

export  default cursoRouter ;