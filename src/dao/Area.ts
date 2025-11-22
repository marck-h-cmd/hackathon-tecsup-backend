import { Op } from 'sequelize';
import Area from '../models/mysql/Area';
import Carrera from '../models/mysql/Carrera';
import { IAreaCreationAttributes } from '../interfaces/mysql/Area';
import { ApiResponse, PaginationParams, PaginatedResponse } from '../interfaces/shared/types';

export class AreaDAO {
  async createArea(data: IAreaCreationAttributes): Promise<ApiResponse<any>> {
    try {
      const a = await Area.create(data);
      return { success: true, data: a.toJSON() };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Error creando área' };
    }
  }

  async getAreaById(id: number): Promise<ApiResponse<any>> {
    try {
      const a = await Area.findByPk(id);
      if (!a) return { success: false, error: 'Área no encontrada' };
      return { success: true, data: a.toJSON() };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Error obteniendo área' };
    }
  }

  async getAreas(pagination: PaginationParams, query?: { nombre?: string; activo?: boolean }): Promise<ApiResponse<PaginatedResponse<any>>> {
    try {
      const where: any = {};
      if (query?.nombre) where.nombre = { [Op.like]: `%${query.nombre}%` };
      if (query?.activo !== undefined) where.activo = query.activo;

      const { count, rows } = await Area.findAndCountAll({
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
      return { success: false, error: error instanceof Error ? error.message : 'Error obteniendo áreas' };
    }
  }

  async getAreaWithCarreras(id: number): Promise<ApiResponse<any>> {
    try {
      const a = await Area.findByPk(id, {
        include: [{ model: Carrera, as: 'carreras', where: { activo: true }, required: false }]
      });
      if (!a) return { success: false, error: 'Área no encontrada' };
      return { success: true, data: a.toJSON() };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Error obteniendo área con carreras' };
    }
  }

  async updateArea(id: number, updateData: Partial<IAreaCreationAttributes>): Promise<ApiResponse<any>> {
    try {
      const a = await Area.findByPk(id);
      if (!a) return { success: false, error: 'Área no encontrada' };
      await a.update(updateData);
      return { success: true, data: a.toJSON() };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Error actualizando área' };
    }
  }

  async deactivateArea(id: number): Promise<ApiResponse<any>> {
    try {
      const a = await Area.findByPk(id);
      if (!a) return { success: false, error: 'Área no encontrada' };
      await a.update({ activo: false });
      return { success: true, data: a.toJSON() };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Error desactivando área' };
    }
  }
}

export const areaDAO = new AreaDAO();
