import { Request, Response } from 'express';
import {
  createCarreraService,
  getCarreraByIdService,
  getCarrerasService,
  getCarrerasByAreaService,
  updateCarreraService,
  deactivateCarreraService
} from '../services/Carrera';
import { ICarreraCreationAttributes } from '../interfaces/mysql/Carrera';
import { PaginationParams } from '../interfaces/shared/types';

export const createCarrera = async (req: Request, res: Response): Promise<void> => {
  try {
    const data: ICarreraCreationAttributes = req.body;
    const result = await createCarreraService(data);
    res.status(201).json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message || 'Error creando carrera' });
  }
};

export const getCarreras = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const pagination: PaginationParams = { page, limit };
    const filters = {
      nombre: req.query.nombre as string | undefined,
      area_id: req.query.area_id ? parseInt(req.query.area_id as string) : undefined,
      activo: req.query.activo === 'true' ? true : req.query.activo === 'false' ? false : undefined
    };
    const result = await getCarrerasService(filters, pagination);
    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error obteniendo carreras' });
  }
};

export const getCarreraById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) { res.status(400).json({ success: false, message: 'ID inválido' }); return; }
    const result = await getCarreraByIdService(id);
    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    res.status(404).json({ success: false, message: error.message || 'Carrera no encontrada' });
  }
};

export const getCarrerasByArea = async (req: Request, res: Response): Promise<void> => {
  try {
    const areaId = parseInt(req.params.areaId);
    if (isNaN(areaId)) { res.status(400).json({ success: false, message: 'ID inválido' }); return; }
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const pagination: PaginationParams = { page, limit };
    const result = await getCarrerasByAreaService(areaId, pagination);
    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error obteniendo carreras por área' });
  }
};

export const updateCarrera = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) { res.status(400).json({ success: false, message: 'ID inválido' }); return; }
    const updateData = req.body;
    const result = await updateCarreraService(id, updateData);
    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message || 'Error actualizando carrera' });
  }
};

export const deactivateCarrera = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) { res.status(400).json({ success: false, message: 'ID inválido' }); return; }
    const result = await deactivateCarreraService(id);
    res.status(200).json({ success: true, data: result, message: 'Carrera desactivada' });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message || 'Error desactivando carrera' });
  }
};
