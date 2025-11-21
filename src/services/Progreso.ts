import { progresoDAO } from '../dao/Progreso';
import { 
  ITemaCompletadoCreationAttributes,
  ISeccionCompletadaCreationAttributes
} from '../interfaces/mysql/Progreso';

// ============================================
// TEMAS COMPLETADOS SERVICES
// ============================================

export const marcarTemaCompletadoService = async (data: ITemaCompletadoCreationAttributes) => {
  const result = await progresoDAO.marcarTemaCompletado(data);
  if (!result.success) {
    throw new Error(result.error);
  }

  // Después de completar un tema, actualizar progreso de la sección
  const tema = result.data?.tema;
  if (tema?.seccion_id) {
    await progresoDAO.actualizarProgresoSeccion(data.usuario_id, tema.seccion_id);
  }

  return result.data;
};

export const getTemasCompletadosByUsuarioService = async (usuarioId: number) => {
  const result = await progresoDAO.getTemasCompletadosByUsuario(usuarioId);
  if (!result.success) {
    throw new Error(result.error);
  }
  return result.data;
};

export const verificarTemaCompletadoService = async (usuarioId: number, temaId: number) => {
  const result = await progresoDAO.verificarTemaCompletado(usuarioId, temaId);
  if (!result.success) {
    throw new Error(result.error);
  }
  return result.data;
};

export const eliminarTemaCompletadoService = async (usuarioId: number, temaId: number) => {
  const result = await progresoDAO.eliminarTemaCompletado(usuarioId, temaId);
  if (!result.success) {
    throw new Error(result.error);
  }
  return result.data;
};

// ============================================
// SECCIONES COMPLETADAS SERVICES
// ============================================

export const marcarSeccionCompletadaService = async (data: ISeccionCompletadaCreationAttributes) => {
  const result = await progresoDAO.marcarSeccionCompletada(data);
  if (!result.success) {
    throw new Error(result.error);
  }
  return result.data;
};

export const getSeccionesCompletadasByUsuarioService = async (usuarioId: number) => {
  const result = await progresoDAO.getSeccionesCompletadasByUsuario(usuarioId);
  if (!result.success) {
    throw new Error(result.error);
  }
  return result.data;
};

export const calcularProgresoSeccionService = async (usuarioId: number, seccionId: number) => {
  const result = await progresoDAO.calcularProgresoSeccion(usuarioId, seccionId);
  if (!result.success) {
    throw new Error(result.error);
  }
  return result.data;
};

export const actualizarProgresoSeccionService = async (usuarioId: number, seccionId: number) => {
  const result = await progresoDAO.actualizarProgresoSeccion(usuarioId, seccionId);
  if (!result.success) {
    throw new Error(result.error);
  }

  // Después de actualizar la sección, actualizar el progreso del curso
  const seccion = await progresoDAO.getSeccionesCompletadasByUsuario(usuarioId);
  if (seccion.success && seccion.data) {
    const seccionData = seccion.data.find((s: any) => s.seccion_id === seccionId);
    if (seccionData?.seccion?.curso_id) {
      await progresoDAO.actualizarProgresoCurso(usuarioId, seccionData.seccion.curso_id);
    }
  }

  return result.data;
};

// ============================================
// CURSOS COMPLETADOS SERVICES
// ============================================

export const inscribirEnCursoService = async (usuarioId: number, cursoId: number) => {
  const result = await progresoDAO.inscribirEnCurso(usuarioId, cursoId);
  if (!result.success) {
    throw new Error(result.error);
  }
  return result.data;
};

export const getCursosDelUsuarioService = async (usuarioId: number) => {
  const result = await progresoDAO.getCursosDelUsuario(usuarioId);
  if (!result.success) {
    throw new Error(result.error);
  }
  return result.data;
};

export const calcularProgresoCursoService = async (usuarioId: number, cursoId: number) => {
  const result = await progresoDAO.calcularProgresoCurso(usuarioId, cursoId);
  if (!result.success) {
    throw new Error(result.error);
  }
  return result.data;
};

export const actualizarProgresoCursoService = async (usuarioId: number, cursoId: number) => {
  const result = await progresoDAO.actualizarProgresoCurso(usuarioId, cursoId);
  if (!result.success) {
    throw new Error(result.error);
  }
  return result.data;
};

export const emitirCertificadoService = async (usuarioId: number, cursoId: number) => {
  const result = await progresoDAO.emitirCertificado(usuarioId, cursoId);
  if (!result.success) {
    throw new Error(result.error);
  }
  return result.data;
};

// ============================================
// ESTADÍSTICAS SERVICES
// ============================================

export const getEstadisticasProgresoService = async (usuarioId: number) => {
  const result = await progresoDAO.getEstadisticasProgreso(usuarioId);
  if (!result.success) {
    throw new Error(result.error);
  }
  return result.data;
};

export const getProgresoPorCursoService = async (usuarioId: number, cursoId: number) => {
  const result = await progresoDAO.getProgresoPorCurso(usuarioId, cursoId);
  if (!result.success) {
    throw new Error(result.error);
  }
  return result.data;
};