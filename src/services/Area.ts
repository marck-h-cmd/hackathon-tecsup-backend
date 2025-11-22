import { areaDAO } from '../dao/Area';
import { IAreaCreationAttributes } from '../interfaces/mysql/Area';
import { PaginationParams } from '../interfaces/shared/types';

export const createAreaService = async (data: IAreaCreationAttributes) => {
  const res = await areaDAO.createArea(data);
  if (!res.success || !res.data) throw new Error(res.error || 'Error creando área');
  return res.data;
};

export const getAreaByIdService = async (id: number) => {
  const res = await areaDAO.getAreaById(id);
  if (!res.success || !res.data) throw new Error(res.error || 'Área no encontrada');
  return res.data;
};

export const getAreasService = async (pagination: PaginationParams, query?: { nombre?: string; activo?: boolean }) => {
  const res = await areaDAO.getAreas(pagination, query);
  if (!res.success || !res.data) throw new Error(res.error || 'Error obteniendo áreas');
  return res.data;
};

export const getAreaWithCarrerasService = async (id: number) => {
  const res = await areaDAO.getAreaWithCarreras(id);
  if (!res.success || !res.data) throw new Error(res.error || 'Área no encontrada');
  return res.data;
};

export const updateAreaService = async (id: number, updateData: Partial<IAreaCreationAttributes>) => {
  const res = await areaDAO.updateArea(id, updateData);
  if (!res.success || !res.data) throw new Error(res.error || 'Error actualizando área');
  return res.data;
};

export const deactivateAreaService = async (id: number) => {
  const res = await areaDAO.deactivateArea(id);
  if (!res.success || !res.data) throw new Error(res.error || 'Error desactivando área');
  return res.data;
};
