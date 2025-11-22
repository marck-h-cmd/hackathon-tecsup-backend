import { carreraDAO } from '../dao/Carrera';
import { ICarreraCreationAttributes } from '../interfaces/mysql/Carrera';
import { PaginationParams } from '../interfaces/shared/types';

export const createCarreraService = async (data: ICarreraCreationAttributes) => {
  const res = await carreraDAO.createCarrera(data);
  if (!res.success || !res.data) throw new Error(res.error || 'Error creando carrera');
  return res.data;
};

export const getCarreraByIdService = async (id: number) => {
  const res = await carreraDAO.getCarreraById(id);
  if (!res.success || !res.data) throw new Error(res.error || 'Carrera no encontrada');
  return res.data;
};

export const getCarrerasService = async (filters: { nombre?: string; area_id?: number; activo?: boolean }, pagination: PaginationParams) => {
  const res = await carreraDAO.getCarreras(filters, pagination);
  if (!res.success || !res.data) throw new Error(res.error || 'Error obteniendo carreras');
  return res.data;
};

export const getCarrerasByAreaService = async (areaId: number, pagination: PaginationParams) => {
  const res = await carreraDAO.getCarrerasByArea(areaId, pagination);
  if (!res.success || !res.data) throw new Error(res.error || 'Error obteniendo carreras por área');
  return res.data;
};

export const updateCarreraService = async (id: number, updateData: Partial<ICarreraCreationAttributes>) => {
  const res = await carreraDAO.updateCarrera(id, updateData as any);
  if (!res.success || !res.data) throw new Error(res.error || 'Error actualizando carrera');
  return res.data;
};

export const deactivateCarreraService = async (id: number) => {
  const res = await carreraDAO.deactivateCarrera(id);
  if (!res.success || !res.data) throw new Error(res.error || 'Error desactivando carrera');
  return res.data;
};
