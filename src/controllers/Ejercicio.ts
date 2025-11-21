import { Request, Response } from 'express';
import {
  createEjercicioService,
  getEjercicioByIdService,
  getEjerciciosByTemaService,
  getAllEjerciciosService,
  getEjerciciosWithFiltersService,
  updateEjercicioService,
  deleteEjercicioService,
  deactivateEjercicioService,
  getEjerciciosByTipoService,
  reordenarEjerciciosService,
  duplicarEjercicioService,
  verificarRespuestaService,
  getEstadisticasEjercicioService,
  getEstadisticasPorTipoService
} from '../services/Ejercicio';
import { 
  IEjercicioCreationAttributes, 
  IEjercicioUpdateData, 
  IEjercicioFilters 
} from '../interfaces/mysql/Ejercicio';

// ============================================
// CRUD BÁSICO
// ============================================

export const createEjercicio = async (req: Request, res: Response): Promise<void> => {
  try {
    const ejercicioData: IEjercicioCreationAttributes = req.body;
    
    if (!ejercicioData.tema_id || !ejercicioData.titulo || !ejercicioData.enunciado || !ejercicioData.tipo || !ejercicioData.respuesta_correcta) {
      res.status(400).json({ 
        success: false, 
        message: 'Tema ID, título, enunciado, tipo y respuesta correcta son obligatorios' 
      });
      return;
    }

    const result = await createEjercicioService(ejercicioData);
    res.status(201).json({ 
      success: true, 
      data: result,
      message: 'Ejercicio creado exitosamente' 
    });
  } catch (error: any) {
    res.status(400).json({ 
      success: false, 
      message: error.message || 'Error al crear el ejercicio' 
    });
  }
};

export const getEjercicioById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      res.status(400).json({ 
        success: false, 
        message: 'ID de ejercicio inválido' 
      });
      return;
    }

    const result = await getEjercicioByIdService(id);
    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    res.status(404).json({ 
      success: false, 
      message: error.message || 'Ejercicio no encontrado' 
    });
  }
};

export const getEjerciciosByTema = async (req: Request, res: Response): Promise<void> => {
  try {
    const temaId = parseInt(req.params.temaId);
    
    if (isNaN(temaId)) {
      res.status(400).json({ 
        success: false, 
        message: 'ID de tema inválido' 
      });
      return;
    }

    const result = await getEjerciciosByTemaService(temaId);
    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Error al obtener ejercicios' 
    });
  }
};

export const getAllEjercicios = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await getAllEjerciciosService({ page, limit });
    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Error al obtener ejercicios' 
    });
  }
};

export const getEjerciciosWithFilters = async (req: Request, res: Response): Promise<void> => {
  try {
    const filters: IEjercicioFilters = {
      tema_id: req.query.tema_id ? parseInt(req.query.tema_id as string) : undefined,
      titulo: req.query.titulo as string,
      tipo: req.query.tipo as any,
      activo: req.query.activo === 'true' ? true : req.query.activo === 'false' ? false : undefined
    };

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await getEjerciciosWithFiltersService(filters, { page, limit });
    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Error al obtener ejercicios' 
    });
  }
};

export const updateEjercicio = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      res.status(400).json({ 
        success: false, 
        message: 'ID de ejercicio inválido' 
      });
      return;
    }

    const updateData: IEjercicioUpdateData = req.body;
    const result = await updateEjercicioService(id, updateData);
    
    res.status(200).json({ 
      success: true, 
      data: result,
      message: 'Ejercicio actualizado exitosamente' 
    });
  } catch (error: any) {
    res.status(400).json({ 
      success: false, 
      message: error.message || 'Error al actualizar el ejercicio' 
    });
  }
};

export const deleteEjercicio = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      res.status(400).json({ 
        success: false, 
        message: 'ID de ejercicio inválido' 
      });
      return;
    }

    const result = await deleteEjercicioService(id);
    res.status(200).json({ 
      success: true, 
      data: result,
      message: 'Ejercicio eliminado exitosamente' 
    });
  } catch (error: any) {
    res.status(400).json({ 
      success: false, 
      message: error.message || 'Error al eliminar el ejercicio' 
    });
  }
};

export const deactivateEjercicio = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      res.status(400).json({ 
        success: false, 
        message: 'ID de ejercicio inválido' 
      });
      return;
    }

    const result = await deactivateEjercicioService(id);
    res.status(200).json({ 
      success: true, 
      data: result,
      message: 'Ejercicio desactivado exitosamente' 
    });
  } catch (error: any) {
    res.status(400).json({ 
      success: false, 
      message: error.message || 'Error al desactivar el ejercicio' 
    });
  }
};

// ============================================
// CONSULTAS AVANZADAS
// ============================================

export const getEjerciciosByTipo = async (req: Request, res: Response): Promise<void> => {
  try {
    const tipo = req.params.tipo;
    
    if (!tipo) {
      res.status(400).json({ 
        success: false, 
        message: 'Tipo es obligatorio' 
      });
      return;
    }

    const result = await getEjerciciosByTipoService(tipo);
    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Error al obtener ejercicios por tipo' 
    });
  }
};

export const reordenarEjercicios = async (req: Request, res: Response): Promise<void> => {
  try {
    const temaId = parseInt(req.params.temaId);
    const { orden } = req.body;
    
    if (isNaN(temaId)) {
      res.status(400).json({ 
        success: false, 
        message: 'ID de tema inválido' 
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

    const result = await reordenarEjerciciosService(temaId, orden);
    res.status(200).json({ 
      success: true, 
      data: result,
      message: 'Ejercicios reordenados exitosamente' 
    });
  } catch (error: any) {
    res.status(400).json({ 
      success: false, 
      message: error.message || 'Error al reordenar ejercicios' 
    });
  }
};

export const duplicarEjercicio = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    const { nuevo_tema_id } = req.body;
    
    if (isNaN(id)) {
      res.status(400).json({ 
        success: false, 
        message: 'ID de ejercicio inválido' 
      });
      return;
    }

    const result = await duplicarEjercicioService(id, nuevo_tema_id);
    res.status(201).json({ 
      success: true, 
      data: result,
      message: 'Ejercicio duplicado exitosamente' 
    });
  } catch (error: any) {
    res.status(400).json({ 
      success: false, 
      message: error.message || 'Error al duplicar el ejercicio' 
    });
  }
};

export const verificarRespuesta = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    const { respuesta } = req.body;
    
    if (isNaN(id)) {
      res.status(400).json({ 
        success: false, 
        message: 'ID de ejercicio inválido' 
      });
      return;
    }

    if (!respuesta) {
      res.status(400).json({ 
        success: false, 
        message: 'La respuesta es obligatoria' 
      });
      return;
    }

    const result = await verificarRespuestaService(id, respuesta);
    res.status(200).json({ 
      success: true, 
      data: result 
    });
  } catch (error: any) {
    res.status(400).json({ 
      success: false, 
      message: error.message || 'Error al verificar respuesta' 
    });
  }
};

// ============================================
// ESTADÍSTICAS
// ============================================

export const getEstadisticasEjercicio = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      res.status(400).json({ 
        success: false, 
        message: 'ID de ejercicio inválido' 
      });
      return;
    }

    const result = await getEstadisticasEjercicioService(id);
    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    res.status(404).json({ 
      success: false, 
      message: error.message || 'Error al obtener estadísticas del ejercicio' 
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