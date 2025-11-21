import { Request, Response } from 'express';
import {
  // Secciones
  createSeccionService,
  getSeccionByIdService,
  getSeccionesByCursoService,
  getAllSeccionesService,
  getSeccionesWithFiltersService,
  updateSeccionService,
  deleteSeccionService,
  deactivateSeccionService,
  getSeccionWithTemasService,
  reordenarSeccionesService,
  getEstadisticasSeccionService,
  // Temas
  createTemaService,
  getTemaByIdService,
  getTemasBySeccionService,
  getTemasByCursoService,
  getAllTemasService,
  getTemasWithFiltersService,
  updateTemaService,
  deleteTemaService,
  deactivateTemaService,
  reordenarTemasService,
  getTemasByTipoService,
  duplicarTemaService,
  moverTemaService,
  getEstadisticasTemaService,
  getEstadisticasPorTipoService
} from '../services/CursoSeccionTema';

import {
  createCursoService,
  getCursoByIdService,
  getCursoByCodigoService,
  getAllCursosService,
  getCursosWithFiltersService,
  updateCursoService,
  deleteCursoService,
  deactivateCursoService,
  getCursoWithSeccionesService,
  getCursoCompletoService,
  getCursosPublicosService,
  getEstadisticasCursoService,
  getEstadisticasGeneralesCursosService
} from '../services/CursoSeccionTema';
import { ICursoCreationAttributes, ICursoUpdateData, ICursoFilters } from '../interfaces/mysql/Curso';

import { 
  ISeccionCreationAttributes, 
  ISeccionUpdateData, 
  ISeccionFilters 
} from '../interfaces/mysql/Seccion';
import { 
  ITemaCreationAttributes, 
  ITemaUpdateData, 
  ITemaFilters 
} from '../interfaces/mysql/Tema';

// ============================================
// SECCION CONTROLLERS
// ============================================

export const createSeccion = async (req: Request, res: Response): Promise<void> => {
  try {
    const seccionData: ISeccionCreationAttributes = req.body;
    
    if (!seccionData.curso_id || !seccionData.titulo) {
      res.status(400).json({ 
        success: false, 
        message: 'Curso ID y título son obligatorios' 
      });
      return;
    }

    const result = await createSeccionService(seccionData);
    res.status(201).json({ 
      success: true, 
      data: result,
      message: 'Sección creada exitosamente' 
    });
  } catch (error: any) {
    res.status(400).json({ 
      success: false, 
      message: error.message || 'Error al crear la sección' 
    });
  }
};

export const getSeccionById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      res.status(400).json({ 
        success: false, 
        message: 'ID de sección inválido' 
      });
      return;
    }

    const result = await getSeccionByIdService(id);
    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    res.status(404).json({ 
      success: false, 
      message: error.message || 'Sección no encontrada' 
    });
  }
};

export const getSeccionesByCurso = async (req: Request, res: Response): Promise<void> => {
  try {
    const cursoId = parseInt(req.params.cursoId);
    
    if (isNaN(cursoId)) {
      res.status(400).json({ 
        success: false, 
        message: 'ID de curso inválido' 
      });
      return;
    }

    const result = await getSeccionesByCursoService(cursoId);
    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Error al obtener secciones' 
    });
  }
};

export const getAllSecciones = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await getAllSeccionesService({ page, limit });
    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Error al obtener secciones' 
    });
  }
};

export const getSeccionesWithFilters = async (req: Request, res: Response): Promise<void> => {
  try {
    const filters: ISeccionFilters = {
      curso_id: req.query.curso_id ? parseInt(req.query.curso_id as string) : undefined,
      titulo: req.query.titulo as string,
      activa: req.query.activa === 'true' ? true : req.query.activa === 'false' ? false : undefined
    };

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await getSeccionesWithFiltersService(filters, { page, limit });
    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Error al obtener secciones' 
    });
  }
};

export const updateSeccion = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      res.status(400).json({ 
        success: false, 
        message: 'ID de sección inválido' 
      });
      return;
    }

    const updateData: ISeccionUpdateData = req.body;
    const result = await updateSeccionService(id, updateData);
    
    res.status(200).json({ 
      success: true, 
      data: result,
      message: 'Sección actualizada exitosamente' 
    });
  } catch (error: any) {
    res.status(400).json({ 
      success: false, 
      message: error.message || 'Error al actualizar la sección' 
    });
  }
};

export const deleteSeccion = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      res.status(400).json({ 
        success: false, 
        message: 'ID de sección inválido' 
      });
      return;
    }

    const result = await deleteSeccionService(id);
    res.status(200).json({ 
      success: true, 
      data: result,
      message: 'Sección eliminada exitosamente' 
    });
  } catch (error: any) {
    res.status(400).json({ 
      success: false, 
      message: error.message || 'Error al eliminar la sección' 
    });
  }
};

export const deactivateSeccion = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      res.status(400).json({ 
        success: false, 
        message: 'ID de sección inválido' 
      });
      return;
    }

    const result = await deactivateSeccionService(id);
    res.status(200).json({ 
      success: true, 
      data: result,
      message: 'Sección desactivada exitosamente' 
    });
  } catch (error: any) {
    res.status(400).json({ 
      success: false, 
      message: error.message || 'Error al desactivar la sección' 
    });
  }
};

export const getSeccionWithTemas = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      res.status(400).json({ 
        success: false, 
        message: 'ID de sección inválido' 
      });
      return;
    }

    const result = await getSeccionWithTemasService(id);
    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    res.status(404).json({ 
      success: false, 
      message: error.message || 'Sección no encontrada' 
    });
  }
};

export const reordenarSecciones = async (req: Request, res: Response): Promise<void> => {
  try {
    const cursoId = parseInt(req.params.cursoId);
    const { orden } = req.body;
    
    if (isNaN(cursoId)) {
      res.status(400).json({ 
        success: false, 
        message: 'ID de curso inválido' 
      });
      return;
    }

    if (!Array.isArray(orden)) {
      res.status(400).json({ 
        success: false, 
        message: 'El orden debe ser un array de IDs' 
      });
      return;
    }

    const result = await reordenarSeccionesService(cursoId, orden);
    res.status(200).json({ 
      success: true, 
      data: result,
      message: 'Secciones reordenadas exitosamente' 
    });
  } catch (error: any) {
    res.status(400).json({ 
      success: false, 
      message: error.message || 'Error al reordenar secciones' 
    });
  }
};

export const getEstadisticasSeccion = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      res.status(400).json({ 
        success: false, 
        message: 'ID de sección inválido' 
      });
      return;
    }

    const result = await getEstadisticasSeccionService(id);
    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    res.status(404).json({ 
      success: false, 
      message: error.message || 'Error al obtener estadísticas de la sección' 
    });
  }
};

// ============================================
// TEMA CONTROLLERS
// ============================================

export const createTema = async (req: Request, res: Response): Promise<void> => {
  try {
    const temaData: ITemaCreationAttributes = req.body;
    
    if (!temaData.seccion_id || !temaData.titulo || !temaData.contenido) {
      res.status(400).json({ 
        success: false, 
        message: 'Sección ID, título y contenido son obligatorios' 
      });
      return;
    }

    const result = await createTemaService(temaData);
    res.status(201).json({ 
      success: true, 
      data: result,
      message: 'Tema creado exitosamente' 
    });
  } catch (error: any) {
    res.status(400).json({ 
      success: false, 
      message: error.message || 'Error al crear el tema' 
    });
  }
};

export const getTemaById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      res.status(400).json({ 
        success: false, 
        message: 'ID de tema inválido' 
      });
      return;
    }

    const result = await getTemaByIdService(id);
    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    res.status(404).json({ 
      success: false, 
      message: error.message || 'Tema no encontrado' 
    });
  }
};

export const getTemasBySeccion = async (req: Request, res: Response): Promise<void> => {
  try {
    const seccionId = parseInt(req.params.seccionId);
    
    if (isNaN(seccionId)) {
      res.status(400).json({ 
        success: false, 
        message: 'ID de sección inválido' 
      });
      return;
    }

    const result = await getTemasBySeccionService(seccionId);
    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Error al obtener temas' 
    });
  }
};

export const getTemasByCurso = async (req: Request, res: Response): Promise<void> => {
  try {
    const cursoId = parseInt(req.params.cursoId);
    
    if (isNaN(cursoId)) {
      res.status(400).json({ 
        success: false, 
        message: 'ID de curso inválido' 
      });
      return;
    }

    const result = await getTemasByCursoService(cursoId);
    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Error al obtener temas' 
    });
  }
};

export const getAllTemas = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await getAllTemasService({ page, limit });
    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Error al obtener temas' 
    });
  }
};

export const getTemasWithFilters = async (req: Request, res: Response): Promise<void> => {
  try {
    const filters: ITemaFilters = {
      seccion_id: req.query.seccion_id ? parseInt(req.query.seccion_id as string) : undefined,
      curso_id: req.query.curso_id ? parseInt(req.query.curso_id as string) : undefined,
      titulo: req.query.titulo as string,
      tipo_contenido: req.query.tipo_contenido as any,
      activo: req.query.activo === 'true' ? true : req.query.activo === 'false' ? false : undefined
    };

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await getTemasWithFiltersService(filters, { page, limit });
    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Error al obtener temas' 
    });
  }
};

export const updateTema = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      res.status(400).json({ 
        success: false, 
        message: 'ID de tema inválido' 
      });
      return;
    }

    const updateData: ITemaUpdateData = req.body;
    const result = await updateTemaService(id, updateData);
    
    res.status(200).json({ 
      success: true, 
      data: result,
      message: 'Tema actualizado exitosamente' 
    });
  } catch (error: any) {
    res.status(400).json({ 
      success: false, 
      message: error.message || 'Error al actualizar el tema' 
    });
  }
};

export const deleteTema = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      res.status(400).json({ 
        success: false, 
        message: 'ID de tema inválido' 
      });
      return;
    }

    const result = await deleteTemaService(id);
    res.status(200).json({ 
      success: true, 
      data: result,
      message: 'Tema eliminado exitosamente' 
    });
  } catch (error: any) {
    res.status(400).json({ 
      success: false, 
      message: error.message || 'Error al eliminar el tema' 
    });
  }
};

export const deactivateTema = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      res.status(400).json({ 
        success: false, 
        message: 'ID de tema inválido' 
      });
      return;
    }

    const result = await deactivateTemaService(id);
    res.status(200).json({ 
      success: true, 
      data: result,
      message: 'Tema desactivado exitosamente' 
    });
  } catch (error: any) {
    res.status(400).json({ 
      success: false, 
      message: error.message || 'Error al desactivar el tema' 
    });
  }
};

export const reordenarTemas = async (req: Request, res: Response): Promise<void> => {
  try {
    const seccionId = parseInt(req.params.seccionId);
    const { orden } = req.body;
    
    if (isNaN(seccionId)) {
      res.status(400).json({ 
        success: false, 
        message: 'ID de sección inválido' 
      });
      return;
    }

    if (!Array.isArray(orden)) {
      res.status(400).json({ 
        success: false, 
        message: 'El orden debe ser un array de IDs' 
      });
      return;
    }

    const result = await reordenarTemasService(seccionId, orden);
    res.status(200).json({ 
      success: true, 
      data: result,
      message: 'Temas reordenados exitosamente' 
    });
  } catch (error: any) {
    res.status(400).json({ 
      success: false, 
      message: error.message || 'Error al reordenar temas' 
    });
  }
};

export const getTemasByTipo = async (req: Request, res: Response): Promise<void> => {
  try {
    const tipoContenido = req.params.tipo;
    
    if (!tipoContenido) {
      res.status(400).json({ 
        success: false, 
        message: 'Tipo de contenido es obligatorio' 
      });
      return;
    }

    const result = await getTemasByTipoService(tipoContenido);
    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Error al obtener temas por tipo' 
    });
  }
};

export const duplicarTema = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    const { nueva_seccion_id } = req.body;
    
    if (isNaN(id)) {
      res.status(400).json({ 
        success: false, 
        message: 'ID de tema inválido' 
      });
      return;
    }

    const result = await duplicarTemaService(id, nueva_seccion_id);
    res.status(201).json({ 
      success: true, 
      data: result,
      message: 'Tema duplicado exitosamente' 
    });
  } catch (error: any) {
    res.status(400).json({ 
      success: false, 
      message: error.message || 'Error al duplicar el tema' 
    });
  }
};

export const moverTema = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    const { nueva_seccion_id, nuevo_orden } = req.body;
    
    if (isNaN(id)) {
      res.status(400).json({ 
        success: false, 
        message: 'ID de tema inválido' 
      });
      return;
    }

    if (!nueva_seccion_id) {
      res.status(400).json({ 
        success: false, 
        message: 'Nueva sección ID es obligatorio' 
      });
      return;
    }

    const result = await moverTemaService(id, nueva_seccion_id, nuevo_orden);
    res.status(200).json({ 
      success: true, 
      data: result,
      message: 'Tema movido exitosamente' 
    });
  } catch (error: any) {
    res.status(400).json({ 
      success: false, 
      message: error.message || 'Error al mover el tema' 
    });
  }
};

export const getEstadisticasTema = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      res.status(400).json({ 
        success: false, 
        message: 'ID de tema inválido' 
      });
      return;
    }

    const result = await getEstadisticasTemaService(id);
    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    res.status(404).json({ 
      success: false, 
      message: error.message || 'Error al obtener estadísticas del tema' 
    });
  }
};

export const getEstadisticasPorTipo = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await getEstadisticasPorTipoService();
    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Error al obtener estadísticas por tipo' 
    });
  }
};



// ============================================
// CRUD BÁSICO
// ============================================

export const createCurso = async (req: Request, res: Response): Promise<void> => {
  try {
    const cursoData: ICursoCreationAttributes = req.body;
    
    if (!cursoData.codigo || !cursoData.nombre) {
      res.status(400).json({ 
        success: false, 
        message: 'Código y nombre son obligatorios' 
      });
      return;
    }

    const result = await createCursoService(cursoData);
    res.status(201).json({ 
      success: true, 
      data: result,
      message: 'Curso creado exitosamente' 
    });
  } catch (error: any) {
    res.status(400).json({ 
      success: false, 
      message: error.message || 'Error al crear el curso' 
    });
  }
};

export const getCursoById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      res.status(400).json({ 
        success: false, 
        message: 'ID de curso inválido' 
      });
      return;
    }

    const result = await getCursoByIdService(id);
    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    res.status(404).json({ 
      success: false, 
      message: error.message || 'Curso no encontrado' 
    });
  }
};

export const getCursoByCodigo = async (req: Request, res: Response): Promise<void> => {
  try {
    const codigo = req.params.codigo;
    
    if (!codigo) {
      res.status(400).json({ 
        success: false, 
        message: 'Código es obligatorio' 
      });
      return;
    }

    const result = await getCursoByCodigoService(codigo);
    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    res.status(404).json({ 
      success: false, 
      message: error.message || 'Curso no encontrado' 
    });
  }
};

export const getAllCursos = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await getAllCursosService({ page, limit });
    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Error al obtener cursos' 
    });
  }
};

export const getCursosWithFilters = async (req: Request, res: Response): Promise<void> => {
  try {
    const filters: ICursoFilters = {
      nombre: req.query.nombre as string,
      codigo: req.query.codigo as string,
      es_publico: req.query.es_publico === 'true' ? true : req.query.es_publico === 'false' ? false : undefined,
      activo: req.query.activo === 'true' ? true : req.query.activo === 'false' ? false : undefined
    };

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await getCursosWithFiltersService(filters, { page, limit });
    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Error al obtener cursos' 
    });
  }
};

export const updateCurso = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      res.status(400).json({ 
        success: false, 
        message: 'ID de curso inválido' 
      });
      return;
    }

    const updateData: ICursoUpdateData = req.body;
    const result = await updateCursoService(id, updateData);
    
    res.status(200).json({ 
      success: true, 
      data: result,
      message: 'Curso actualizado exitosamente' 
    });
  } catch (error: any) {
    res.status(400).json({ 
      success: false, 
      message: error.message || 'Error al actualizar el curso' 
    });
  }
};

export const deleteCurso = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      res.status(400).json({ 
        success: false, 
        message: 'ID de curso inválido' 
      });
      return;
    }

    const result = await deleteCursoService(id);
    res.status(200).json({ 
      success: true, 
      data: result,
      message: 'Curso eliminado exitosamente' 
    });
  } catch (error: any) {
    res.status(400).json({ 
      success: false, 
      message: error.message || 'Error al eliminar el curso' 
    });
  }
};

export const deactivateCurso = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      res.status(400).json({ 
        success: false, 
        message: 'ID de curso inválido' 
      });
      return;
    }

    const result = await deactivateCursoService(id);
    res.status(200).json({ 
      success: true, 
      data: result,
      message: 'Curso desactivado exitosamente' 
    });
  } catch (error: any) {
    res.status(400).json({ 
      success: false, 
      message: error.message || 'Error al desactivar el curso' 
    });
  }
};

// ============================================
// CONSULTAS AVANZADAS
// ============================================

export const getCursoWithSecciones = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      res.status(400).json({ 
        success: false, 
        message: 'ID de curso inválido' 
      });
      return;
    }

    const result = await getCursoWithSeccionesService(id);
    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    res.status(404).json({ 
      success: false, 
      message: error.message || 'Curso no encontrado' 
    });
  }
};

export const getCursoCompleto = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      res.status(400).json({ 
        success: false, 
        message: 'ID de curso inválido' 
      });
      return;
    }

    const result = await getCursoCompletoService(id);
    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    res.status(404).json({ 
      success: false, 
      message: error.message || 'Curso no encontrado' 
    });
  }
};

export const getCursosPublicos = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await getCursosPublicosService({ page, limit });
    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Error al obtener cursos públicos' 
    });
  }
};

// ============================================
// ESTADÍSTICAS
// ============================================

export const getEstadisticasCurso = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      res.status(400).json({ 
        success: false, 
        message: 'ID de curso inválido' 
      });
      return;
    }

    const result = await getEstadisticasCursoService(id);
    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    res.status(404).json({ 
      success: false, 
      message: error.message || 'Error al obtener estadísticas del curso' 
    });
  }
};

export const getEstadisticasGeneralesCursos = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await getEstadisticasGeneralesCursosService();
    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Error al obtener estadísticas generales' 
    });
  }
};