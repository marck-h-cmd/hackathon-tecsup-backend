import { ejercicioDAO } from '../dao/Ejercicio';
import { 
  IEjercicioCreationAttributes, 
  IEjercicioUpdateData, 
  IEjercicioFilters 
} from '../interfaces/mysql/Ejercicio';
import { PaginationParams } from '../interfaces/shared/types';

// ============================================
// EJERCICIO SERVICES
// ============================================

export const createEjercicioService = async (ejercicioData: IEjercicioCreationAttributes) => {
  const result = await ejercicioDAO.createEjercicio(ejercicioData);
  if (!result.success) {
    throw new Error(result.error);
  }
  return result.data;
};

export const getEjercicioByIdService = async (id: number) => {
  const result = await ejercicioDAO.getEjercicioById(id);
  if (!result.success) {
    throw new Error(result.error);
  }
  return result.data;
};

export const getEjerciciosByTemaService = async (temaId: number) => {
  const result = await ejercicioDAO.getEjerciciosByTema(temaId);
  if (!result.success) {
    throw new Error(result.error);
  }
  return result.data;
};

export const getAllEjerciciosService = async (pagination: PaginationParams) => {
  const result = await ejercicioDAO.getAllEjercicios(pagination);
  if (!result.success) {
    throw new Error(result.error);
  }
  return result.data;
};

export const getEjerciciosWithFiltersService = async (
  filters: IEjercicioFilters,
  pagination: PaginationParams
) => {
  const result = await ejercicioDAO.getEjerciciosWithFilters(filters, pagination);
  if (!result.success) {
    throw new Error(result.error);
  }
  return result.data;
};

export const updateEjercicioService = async (id: number, updateData: IEjercicioUpdateData) => {
  const result = await ejercicioDAO.updateEjercicio(id, updateData);
  if (!result.success) {
    throw new Error(result.error);
  }
  return result.data;
};

export const deleteEjercicioService = async (id: number) => {
  const result = await ejercicioDAO.deleteEjercicio(id);
  if (!result.success) {
    throw new Error(result.error);
  }
  return result.data;
};

export const deactivateEjercicioService = async (id: number) => {
  const result = await ejercicioDAO.deactivateEjercicio(id);
  if (!result.success) {
    throw new Error(result.error);
  }
  return result.data;
};

export const getEjerciciosByTipoService = async (tipo: string) => {
  const result = await ejercicioDAO.getEjerciciosByTipo(tipo);
  if (!result.success) {
    throw new Error(result.error);
  }
  return result.data;
};

export const reordenarEjerciciosService = async (temaId: number, ordenNuevo: number[]) => {
  const result = await ejercicioDAO.reordenarEjercicios(temaId, ordenNuevo);
  if (!result.success) {
    throw new Error(result.error);
  }
  return result.data;
};

export const duplicarEjercicioService = async (id: number, nuevoTemaId?: number) => {
  const result = await ejercicioDAO.duplicarEjercicio(id, nuevoTemaId);
  if (!result.success) {
    throw new Error(result.error);
  }
  return result.data;
};

export const verificarRespuestaService = async (id: number, respuestaUsuario: string) => {
  const result = await ejercicioDAO.verificarRespuesta(id, respuestaUsuario);
  if (!result.success) {
    throw new Error(result.error);
  }
  return result.data;
};

export const getEstadisticasEjercicioService = async (id: number) => {
  const result = await ejercicioDAO.getEstadisticasEjercicio(id);
  if (!result.success) {
    throw new Error(result.error);
  }
  return result.data;
};

export const getEstadisticasPorTipoService = async () => {
  const result = await ejercicioDAO.getEstadisticasPorTipo();
  if (!result.success) {
    throw new Error(result.error);
  }
  return result.data;
};