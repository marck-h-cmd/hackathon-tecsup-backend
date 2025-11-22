import { Op } from 'sequelize';
import Notificacion from '../models/mysql/Notificacion';
import { INotificacionCreationAttributes, INotificacionFilters, INotificacionUpdateData } from '../interfaces/mysql/Notificacion';
import { ApiResponse, PaginationParams, PaginatedResponse } from '../interfaces/shared/types';

export class NotificacionDAO {
  async createNotificacion(data: INotificacionCreationAttributes): Promise<ApiResponse<any>> {
    try {
      const n = await Notificacion.create(data);
      return { success: true, data: n.toJSON() };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Error creando notificación' };
    }
  }

  async getNotificacionById(id: number): Promise<ApiResponse<any>> {
    try {
      const n = await Notificacion.findByPk(id);
      if (!n) return { success: false, error: 'Notificación no encontrada' };
      return { success: true, data: n.toJSON() };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Error obteniendo notificación' };
    }
  }

  async getNotificacionesByUsuario(
    filters: INotificacionFilters,
    pagination: PaginationParams
  ): Promise<ApiResponse<PaginatedResponse<any>>> {
    try {
      const where: any = {};
      if (filters.usuario_id !== undefined) where.usuario_id = filters.usuario_id;
      if (filters.tipo) where.tipo = filters.tipo;
      if (filters.leida !== undefined) where.leida = filters.leida;
      if (filters.prioridad) where.prioridad = filters.prioridad;
      if (filters.activo !== undefined) where.activo = filters.activo;
      if (filters.fechaDesde || filters.fechaHasta) {
        where.fecha_creacion = {};
        if (filters.fechaDesde) where.fecha_creacion[Op.gte] = filters.fechaDesde;
        if (filters.fechaHasta) where.fecha_creacion[Op.lte] = filters.fechaHasta;
      }

      const { count, rows } = await Notificacion.findAndCountAll({
        where,
        limit: pagination.limit,
        offset: (pagination.page - 1) * pagination.limit,
        order: [['fecha_creacion', 'DESC']]
      });

      return {
        success: true,
        data: {
          data: rows.map(r => r.toJSON()),
          total: count,
          page: pagination.page,
          limit: pagination.limit,
          totalPages: Math.ceil(count / pagination.limit)
        }
      };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Error obteniendo notificaciones' };
    }
  }

  async markAsLeida(id: number): Promise<ApiResponse<any>> {
    try {
      const n = await Notificacion.findByPk(id);
      if (!n) return { success: false, error: 'Notificación no encontrada' };
      await n.update({ leida: true });
      return { success: true, data: n.toJSON() };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Error actualizando notificación' };
    }
  }

  async deactivateNotificacion(id: number): Promise<ApiResponse<any>> {
    try {
      const n = await Notificacion.findByPk(id);
      if (!n) return { success: false, error: 'Notificación no encontrada' };
      await n.update({ activo: false });
      return { success: true, data: n.toJSON() };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Error desactivando notificación' };
    }
  }
}

export const notificacionDAO = new NotificacionDAO();
