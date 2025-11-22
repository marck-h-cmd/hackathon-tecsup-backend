import { notificacionDAO } from '../dao/Notificacion';
import { INotificacionCreationAttributes, INotificacionFilters } from '../interfaces/mysql/Notificacion';
import { PaginationParams } from '../interfaces/shared/types';

export const createNotificacionService = async (data: INotificacionCreationAttributes) => {
  try {
    const result = await notificacionDAO.createNotificacion(data);
    if (!result.success || !result.data) throw new Error(result.error || 'Error creando notificación');
    return result.data;
  } catch (error: any) {
    throw error instanceof Error ? error : new Error('Error en servicio crear notificación');
  }
};

export const getNotificacionByIdService = async (id: number) => {
  try {
    const result = await notificacionDAO.getNotificacionById(id);
    if (!result.success || !result.data) throw new Error(result.error || 'Notificación no encontrada');
    return result.data;
  } catch (error: any) {
    throw error instanceof Error ? error : new Error('Error en servicio obtener notificación');
  }
};

export const getNotificacionesByUsuarioService = async (filters: INotificacionFilters, pagination: PaginationParams) => {
  try {
    const result = await notificacionDAO.getNotificacionesByUsuario(filters, pagination);
    if (!result.success || !result.data) throw new Error(result.error || 'Error obteniendo notificaciones');
    return result.data;
  } catch (error: any) {
    throw error instanceof Error ? error : new Error('Error en servicio obtener notificaciones');
  }
};

export const markAsLeidaService = async (id: number) => {
  try {
    const result = await notificacionDAO.markAsLeida(id);
    if (!result.success || !result.data) throw new Error(result.error || 'Error marcando como leída');
    return result.data;
  } catch (error: any) {
    throw error instanceof Error ? error : new Error('Error en servicio marcar como leída');
  }
};

export const deactivateNotificacionService = async (id: number) => {
  try {
    const result = await notificacionDAO.deactivateNotificacion(id);
    if (!result.success || !result.data) throw new Error(result.error || 'Error desactivando notificación');
    return result.data;
  } catch (error: any) {
    throw error instanceof Error ? error : new Error('Error en servicio desactivar notificación');
  }
};
