import { Op } from 'sequelize';
import Carrera from '../models/mysql/Carrera';
import Area from '../models/mysql/Area';
import { ICarreraCreationAttributes, ICarreraAttributes } from '../interfaces/mysql/Carrera';
import { ApiResponse, PaginationParams, PaginatedResponse } from '../interfaces/shared/types';

export class CarreraDAO {
  async createCarrera(data: ICarreraCreationAttributes): Promise<ApiResponse<any>> {
    try {
      const c = await Carrera.create(data);
      return { success: true, data: c.toJSON() };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Error creando carrera' };
    }
  }

  async getCarreraById(id: number): Promise<ApiResponse<any>> {
    try {
      const c = await Carrera.findByPk(id, { include: [{ model: Area, as: 'area', required: false }] });
      if (!c) return { success: false, error: 'Carrera no encontrada' };
      return { success: true, data: c.toJSON() };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Error obteniendo carrera' };
    }
  }

  async getCarreras(filters: { nombre?: string; area_id?: number; activo?: boolean }, pagination: PaginationParams): Promise<ApiResponse<PaginatedResponse<any>>> {
    try {
      const where: any = {};
      if (filters.nombre) where.nombre = { [Op.like]: `%${filters.nombre}%` };
      if (filters.area_id !== undefined) where.area_id = filters.area_id;
      if (filters.activo !== undefined) where.activo = filters.activo;

      const { count, rows } = await Carrera.findAndCountAll({
        where,
        limit: pagination.limit,
        offset: (pagination.page - 1) * pagination.limit,
        order: [['nombre', 'ASC']]
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
      return { success: false, error: error instanceof Error ? error.message : 'Error obteniendo carreras' };
    }
  }

  async getCarrerasByArea(areaId: number, pagination: PaginationParams): Promise<ApiResponse<PaginatedResponse<any>>> {
    return this.getCarreras({ area_id: areaId, activo: true }, pagination);
  }

  async updateCarrera(id: number, updateData: Partial<ICarreraAttributes>): Promise<ApiResponse<any>> {
    try {
      const c = await Carrera.findByPk(id);
      if (!c) return { success: false, error: 'Carrera no encontrada' };
      await c.update(updateData);
      return { success: true, data: c.toJSON() };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Error actualizando carrera' };
    }
  }

  async deactivateCarrera(id: number): Promise<ApiResponse<any>> {
    try {
      const c = await Carrera.findByPk(id);
      if (!c) return { success: false, error: 'Carrera no encontrada' };
      await c.update({ activo: false });
      return { success: true, data: c.toJSON() };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Error desactivando carrera' };
    }
  }
}

export const carreraDAO = new CarreraDAO();
