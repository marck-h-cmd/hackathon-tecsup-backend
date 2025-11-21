import { cursoDAO } from '../dao/Curso';
import { seccionDAO } from '../dao/Seccion';
import { temaDAO } from '../dao/Tema';
import {
    ICursoCreationAttributes,
    ICursoUpdateData,
    ICursoFilters
} from '../interfaces/mysql/Curso';
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
import { PaginationParams } from '../interfaces/shared/types';

// ============================================
// CURSO SERVICES
// ============================================

export const createCursoService = async (cursoData: ICursoCreationAttributes) => {
    const result = await cursoDAO.createCurso(cursoData);
    if (!result.success) {
        throw new Error(result.error);
    }
    return result.data;
};

export const getCursoByIdService = async (id: number) => {
    const result = await cursoDAO.getCursoById(id);
    if (!result.success) {
        throw new Error(result.error);
    }
    return result.data;
};

export const getCursoByCodigoService = async (codigo: string) => {
    const result = await cursoDAO.getCursoByCodigo(codigo);
    if (!result.success) {
        throw new Error(result.error);
    }
    return result.data;
};

export const getAllCursosService = async (pagination: PaginationParams) => {
    const result = await cursoDAO.getAllCursos(pagination);
    if (!result.success) {
        throw new Error(result.error);
    }
    return result.data;
};

export const getCursosWithFiltersService = async (
    filters: ICursoFilters,
    pagination: PaginationParams
) => {
    const result = await cursoDAO.getCursosWithFilters(filters, pagination);
    if (!result.success) {
        throw new Error(result.error);
    }
    return result.data;
};

export const updateCursoService = async (id: number, updateData: ICursoUpdateData) => {
    const result = await cursoDAO.updateCurso(id, updateData);
    if (!result.success) {
        throw new Error(result.error);
    }
    return result.data;
};

export const deleteCursoService = async (id: number) => {
    const result = await cursoDAO.deleteCurso(id);
    if (!result.success) {
        throw new Error(result.error);
    }
    return result.data;
};

export const deactivateCursoService = async (id: number) => {
    const result = await cursoDAO.deactivateCurso(id);
    if (!result.success) {
        throw new Error(result.error);
    }
    return result.data;
};

export const getCursoWithSeccionesService = async (id: number) => {
    const result = await cursoDAO.getCursoWithSecciones(id);
    if (!result.success) {
        throw new Error(result.error);
    }
    return result.data;
};

export const getCursoCompletoService = async (id: number) => {
    const result = await cursoDAO.getCursoCompleto(id);
    if (!result.success) {
        throw new Error(result.error);
    }
    return result.data;
};

export const getCursosPublicosService = async (pagination: PaginationParams) => {
    const result = await cursoDAO.getCursosPublicos(pagination);
    if (!result.success) {
        throw new Error(result.error);
    }
    return result.data;
};

export const getEstadisticasCursoService = async (id: number) => {
    const result = await cursoDAO.getEstadisticasCurso(id);
    if (!result.success) {
        throw new Error(result.error);
    }
    return result.data;
};

export const getEstadisticasGeneralesCursosService = async () => {
    const result = await cursoDAO.getEstadisticasGenerales();
    if (!result.success) {
        throw new Error(result.error);
    }
    return result.data;
};

// ============================================
// SECCION SERVICES
// ============================================

export const createSeccionService = async (seccionData: ISeccionCreationAttributes) => {
    const result = await seccionDAO.createSeccion(seccionData);
    if (!result.success) {
        throw new Error(result.error);
    }
    return result.data;
};

export const getSeccionByIdService = async (id: number) => {
    const result = await seccionDAO.getSeccionById(id);
    if (!result.success) {
        throw new Error(result.error);
    }
    return result.data;
};

export const getSeccionesByCursoService = async (cursoId: number) => {
    const result = await seccionDAO.getSeccionesByCurso(cursoId);
    if (!result.success) {
        throw new Error(result.error);
    }
    return result.data;
};

export const getAllSeccionesService = async (pagination: PaginationParams) => {
    const result = await seccionDAO.getAllSecciones(pagination);
    if (!result.success) {
        throw new Error(result.error);
    }
    return result.data;
};

export const getSeccionesWithFiltersService = async (
    filters: ISeccionFilters,
    pagination: PaginationParams
) => {
    const result = await seccionDAO.getSeccionesWithFilters(filters, pagination);
    if (!result.success) {
        throw new Error(result.error);
    }
    return result.data;
};

export const updateSeccionService = async (id: number, updateData: ISeccionUpdateData) => {
    const result = await seccionDAO.updateSeccion(id, updateData);
    if (!result.success) {
        throw new Error(result.error);
    }
    return result.data;
};

export const deleteSeccionService = async (id: number) => {
    const result = await seccionDAO.deleteSeccion(id);
    if (!result.success) {
        throw new Error(result.error);
    }
    return result.data;
};

export const deactivateSeccionService = async (id: number) => {
    const result = await seccionDAO.deactivateSeccion(id);
    if (!result.success) {
        throw new Error(result.error);
    }
    return result.data;
};

export const getSeccionWithTemasService = async (id: number) => {
    const result = await seccionDAO.getSeccionWithTemas(id);
    if (!result.success) {
        throw new Error(result.error);
    }
    return result.data;
};

export const reordenarSeccionesService = async (cursoId: number, ordenNuevo: number[]) => {
    const result = await seccionDAO.reordenarSecciones(cursoId, ordenNuevo);
    if (!result.success) {
        throw new Error(result.error);
    }
    return result.data;
};

export const getEstadisticasSeccionService = async (id: number) => {
    const result = await seccionDAO.getEstadisticasSeccion(id);
    if (!result.success) {
        throw new Error(result.error);
    }
    return result.data;
};

// ============================================
// TEMA SERVICES
// ============================================

export const createTemaService = async (temaData: ITemaCreationAttributes) => {
    const result = await temaDAO.createTema(temaData);
    if (!result.success) {
        throw new Error(result.error);
    }
    return result.data;
};

export const getTemaByIdService = async (id: number) => {
    const result = await temaDAO.getTemaById(id);
    if (!result.success) {
        throw new Error(result.error);
    }
    return result.data;
};

export const getTemasBySeccionService = async (seccionId: number) => {
    const result = await temaDAO.getTemasBySeccion(seccionId);
    if (!result.success) {
        throw new Error(result.error);
    }
    return result.data;
};

export const getTemasByCursoService = async (cursoId: number) => {
    const result = await temaDAO.getTemasByCurso(cursoId);
    if (!result.success) {
        throw new Error(result.error);
    }
    return result.data;
};

export const getAllTemasService = async (pagination: PaginationParams) => {
    const result = await temaDAO.getAllTemas(pagination);
    if (!result.success) {
        throw new Error(result.error);
    }
    return result.data;
};

export const getTemasWithFiltersService = async (
    filters: ITemaFilters,
    pagination: PaginationParams
) => {
    const result = await temaDAO.getTemasWithFilters(filters, pagination);
    if (!result.success) {
        throw new Error(result.error);
    }
    return result.data;
};

export const updateTemaService = async (id: number, updateData: ITemaUpdateData) => {
    const result = await temaDAO.updateTema(id, updateData);
    if (!result.success) {
        throw new Error(result.error);
    }
    return result.data;
};

export const deleteTemaService = async (id: number) => {
    const result = await temaDAO.deleteTema(id);
    if (!result.success) {
        throw new Error(result.error);
    }
    return result.data;
};

export const deactivateTemaService = async (id: number) => {
    const result = await temaDAO.deactivateTema(id);
    if (!result.success) {
        throw new Error(result.error);
    }
    return result.data;
};

export const reordenarTemasService = async (seccionId: number, ordenNuevo: number[]) => {
    const result = await temaDAO.reordenarTemas(seccionId, ordenNuevo);
    if (!result.success) {
        throw new Error(result.error);
    }
    return result.data;
};

export const getTemasByTipoService = async (tipoContenido: string) => {
    const result = await temaDAO.getTemasByTipo(tipoContenido);
    if (!result.success) {
        throw new Error(result.error);
    }
    return result.data;
};

export const duplicarTemaService = async (id: number, nuevaSeccionId?: number) => {
    const result = await temaDAO.duplicarTema(id, nuevaSeccionId);
    if (!result.success) {
        throw new Error(result.error);
    }
    return result.data;
};

export const moverTemaService = async (id: number, nuevaSeccionId: number, nuevoOrden?: number) => {
    const result = await temaDAO.moverTema(id, nuevaSeccionId, nuevoOrden);
    if (!result.success) {
        throw new Error(result.error);
    }
    return result.data;
};

export const getEstadisticasTemaService = async (id: number) => {
    const result = await temaDAO.getEstadisticasTema(id);
    if (!result.success) {
        throw new Error(result.error);
    }
    return result.data;
};

export const getEstadisticasPorTipoService = async () => {
    const result = await temaDAO.getEstadisticasPorTipo();
    if (!result.success) {
        throw new Error(result.error);
    }
    return result.data;
};