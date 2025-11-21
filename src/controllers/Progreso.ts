import { Request, Response } from 'express';
import {
  marcarTemaCompletadoService,
  getTemasCompletadosByUsuarioService,
  verificarTemaCompletadoService,
  eliminarTemaCompletadoService,
  marcarSeccionCompletadaService,
  getSeccionesCompletadasByUsuarioService,
  calcularProgresoSeccionService,
  actualizarProgresoSeccionService,
  inscribirEnCursoService,
  getCursosDelUsuarioService,
  calcularProgresoCursoService,
  actualizarProgresoCursoService,
  emitirCertificadoService,
  getEstadisticasProgresoService,
  getProgresoPorCursoService
} from '../services/Progreso';

// ============================================
// TEMAS COMPLETADOS CONTROLLERS
// ============================================

export const marcarTemaCompletado = async (req: Request, res: Response): Promise<void> => {
  try {
    const usuarioId = parseInt(req.params.usuarioId);
    const temaId = parseInt(req.params.temaId);

    if (isNaN(usuarioId) || isNaN(temaId)) {
      res.status(400).json({ 
        success: false, 
        message: 'IDs inválidos' 
      });
      return;
    }

    const { tiempo_dedicado_minutos, puntos_obtenidos } = req.body;

    const result = await marcarTemaCompletadoService({
      usuario_id: usuarioId,
      tema_id: temaId,
      tiempo_dedicado_minutos,
      puntos_obtenidos: puntos_obtenidos || 0
    });

    res.status(201).json({ 
      success: true, 
      data: result,
      message: 'Tema marcado como completado' 
    });
  } catch (error: any) {
    res.status(400).json({ 
      success: false, 
      message: error.message || 'Error al marcar tema como completado' 
    });
  }
};

export const getTemasCompletadosByUsuario = async (req: Request, res: Response): Promise<void> => {
  try {
    const usuarioId = parseInt(req.params.usuarioId);

    if (isNaN(usuarioId)) {
      res.status(400).json({ 
        success: false, 
        message: 'ID de usuario inválido' 
      });
      return;
    }

    const result = await getTemasCompletadosByUsuarioService(usuarioId);
    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Error al obtener temas completados' 
    });
  }
};

export const verificarTemaCompletado = async (req: Request, res: Response): Promise<void> => {
  try {
    const usuarioId = parseInt(req.params.usuarioId);
    const temaId = parseInt(req.params.temaId);

    if (isNaN(usuarioId) || isNaN(temaId)) {
      res.status(400).json({ 
        success: false, 
        message: 'IDs inválidos' 
      });
      return;
    }

    const result = await verificarTemaCompletadoService(usuarioId, temaId);
    res.status(200).json({ 
      success: true, 
      data: { completado: result } 
    });
  } catch (error: any) {
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Error al verificar tema completado' 
    });
  }
};

export const eliminarTemaCompletado = async (req: Request, res: Response): Promise<void> => {
  try {
    const usuarioId = parseInt(req.params.usuarioId);
    const temaId = parseInt(req.params.temaId);

    if (isNaN(usuarioId) || isNaN(temaId)) {
      res.status(400).json({ 
        success: false, 
        message: 'IDs inválidos' 
      });
      return;
    }

    const result = await eliminarTemaCompletadoService(usuarioId, temaId);
    res.status(200).json({ 
      success: true, 
      data: result,
      message: 'Tema completado eliminado' 
    });
  } catch (error: any) {
    res.status(400).json({ 
      success: false, 
      message: error.message || 'Error al eliminar tema completado' 
    });
  }
};

// ============================================
// SECCIONES COMPLETADAS CONTROLLERS
// ============================================

export const marcarSeccionCompletada = async (req: Request, res: Response): Promise<void> => {
  try {
    const usuarioId = parseInt(req.params.usuarioId);
    const seccionId = parseInt(req.params.seccionId);

    if (isNaN(usuarioId) || isNaN(seccionId)) {
      res.status(400).json({ 
        success: false, 
        message: 'IDs inválidos' 
      });
      return;
    }

    const { tiempo_total_minutos, puntos_totales, porcentaje_completado } = req.body;

    const result = await marcarSeccionCompletadaService({
      usuario_id: usuarioId,
      seccion_id: seccionId,
      tiempo_total_minutos,
      puntos_totales: puntos_totales || 0,
      porcentaje_completado: porcentaje_completado || 0
    });

    res.status(201).json({ 
      success: true, 
      data: result,
      message: 'Sección actualizada' 
    });
  } catch (error: any) {
    res.status(400).json({ 
      success: false, 
      message: error.message || 'Error al marcar sección como completada' 
    });
  }
};

export const getSeccionesCompletadasByUsuario = async (req: Request, res: Response): Promise<void> => {
  try {
    const usuarioId = parseInt(req.params.usuarioId);

    if (isNaN(usuarioId)) {
      res.status(400).json({ 
        success: false, 
        message: 'ID de usuario inválido' 
      });
      return;
    }

    const result = await getSeccionesCompletadasByUsuarioService(usuarioId);
    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Error al obtener secciones completadas' 
    });
  }
};

export const calcularProgresoSeccion = async (req: Request, res: Response): Promise<void> => {
  try {
    const usuarioId = parseInt(req.params.usuarioId);
    const seccionId = parseInt(req.params.seccionId);

    if (isNaN(usuarioId) || isNaN(seccionId)) {
      res.status(400).json({ 
        success: false, 
        message: 'IDs inválidos' 
      });
      return;
    }

    const result = await calcularProgresoSeccionService(usuarioId, seccionId);
    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Error al calcular progreso de sección' 
    });
  }
};

export const actualizarProgresoSeccion = async (req: Request, res: Response): Promise<void> => {
  try {
    const usuarioId = parseInt(req.params.usuarioId);
    const seccionId = parseInt(req.params.seccionId);

    if (isNaN(usuarioId) || isNaN(seccionId)) {
      res.status(400).json({ 
        success: false, 
        message: 'IDs inválidos' 
      });
      return;
    }

    const result = await actualizarProgresoSeccionService(usuarioId, seccionId);
    res.status(200).json({ 
      success: true, 
      data: result,
      message: 'Progreso de sección actualizado' 
    });
  } catch (error: any) {
    res.status(400).json({ 
      success: false, 
      message: error.message || 'Error al actualizar progreso de sección' 
    });
  }
};

// ============================================
// CURSOS COMPLETADOS CONTROLLERS
// ============================================

export const inscribirEnCurso = async (req: Request, res: Response): Promise<void> => {
  try {
    const usuarioId = parseInt(req.params.usuarioId);
    const cursoId = parseInt(req.params.cursoId);

    if (isNaN(usuarioId) || isNaN(cursoId)) {
      res.status(400).json({ 
        success: false, 
        message: 'IDs inválidos' 
      });
      return;
    }

    const result = await inscribirEnCursoService(usuarioId, cursoId);
    res.status(201).json({ 
      success: true, 
      data: result,
      message: 'Inscrito en curso exitosamente' 
    });
  } catch (error: any) {
    res.status(400).json({ 
      success: false, 
      message: error.message || 'Error al inscribir en curso' 
    });
  }
};

export const getCursosDelUsuario = async (req: Request, res: Response): Promise<void> => {
  try {
    const usuarioId = parseInt(req.params.usuarioId);

    if (isNaN(usuarioId)) {
      res.status(400).json({ 
        success: false, 
        message: 'ID de usuario inválido' 
      });
      return;
    }

    const result = await getCursosDelUsuarioService(usuarioId);
    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Error al obtener cursos del usuario' 
    });
  }
};

export const calcularProgresoCurso = async (req: Request, res: Response): Promise<void> => {
  try {
    const usuarioId = parseInt(req.params.usuarioId);
    const cursoId = parseInt(req.params.cursoId);

    if (isNaN(usuarioId) || isNaN(cursoId)) {
      res.status(400).json({ 
        success: false, 
        message: 'IDs inválidos' 
      });
      return;
    }

    const result = await calcularProgresoCursoService(usuarioId, cursoId);
    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Error al calcular progreso del curso' 
    });
  }
};

export const actualizarProgresoCurso = async (req: Request, res: Response): Promise<void> => {
  try {
    const usuarioId = parseInt(req.params.usuarioId);
    const cursoId = parseInt(req.params.cursoId);

    if (isNaN(usuarioId) || isNaN(cursoId)) {
      res.status(400).json({ 
        success: false, 
        message: 'IDs inválidos' 
      });
      return;
    }

    const result = await actualizarProgresoCursoService(usuarioId, cursoId);
    res.status(200).json({ 
      success: true, 
      data: result,
      message: 'Progreso del curso actualizado' 
    });
  } catch (error: any) {
    res.status(400).json({ 
      success: false, 
      message: error.message || 'Error al actualizar progreso del curso' 
    });
  }
};

export const emitirCertificado = async (req: Request, res: Response): Promise<void> => {
  try {
    const usuarioId = parseInt(req.params.usuarioId);
    const cursoId = parseInt(req.params.cursoId);

    if (isNaN(usuarioId) || isNaN(cursoId)) {
      res.status(400).json({ 
        success: false, 
        message: 'IDs inválidos' 
      });
      return;
    }

    const result = await emitirCertificadoService(usuarioId, cursoId);
    res.status(200).json({ 
      success: true, 
      data: result,
      message: 'Certificado emitido exitosamente' 
    });
  } catch (error: any) {
    res.status(400).json({ 
      success: false, 
      message: error.message || 'Error al emitir certificado' 
    });
  }
};

// ============================================
// ESTADÍSTICAS CONTROLLERS
// ============================================

export const getEstadisticasProgreso = async (req: Request, res: Response): Promise<void> => {
  try {
    const usuarioId = parseInt(req.params.usuarioId);

    if (isNaN(usuarioId)) {
      res.status(400).json({ 
        success: false, 
        message: 'ID de usuario inválido' 
      });
      return;
    }

    const result = await getEstadisticasProgresoService(usuarioId);
    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Error al obtener estadísticas de progreso' 
    });
  }
};

export const getProgresoPorCurso = async (req: Request, res: Response): Promise<void> => {
  try {
    const usuarioId = parseInt(req.params.usuarioId);
    const cursoId = parseInt(req.params.cursoId);

    if (isNaN(usuarioId) || isNaN(cursoId)) {
      res.status(400).json({ 
        success: false, 
        message: 'IDs inválidos' 
      });
      return;
    }

    const result = await getProgresoPorCursoService(usuarioId, cursoId);
    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Error al obtener progreso del curso' 
    });
  }
};