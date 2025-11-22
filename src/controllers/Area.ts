import { Request, Response } from 'express';
import {
  createAreaService,
  getAreaByIdService,
  getAreasService,
  getAreaWithCarrerasService,
  updateAreaService,
  deactivateAreaService
} from '../services/Area';
import { IAreaCreationAttributes } from '../interfaces/mysql/Area';
import { PaginationParams } from '../interfaces/shared/types';

export const createArea = async (req: Request, res: Response): Promise<void> => {
  try {
    const data: IAreaCreationAttributes = req.body;
    const result = await createAreaService(data);
    res.status(201).json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message || 'Error creando área' });
  }
};

export const getAreas = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const pagination: PaginationParams = { page, limit };
    const query = {
      nombre: req.query.nombre as string | undefined,
      activo: req.query.activo === 'true' ? true : req.query.activo === 'false' ? false : undefined
    };
    const result = await getAreasService(pagination, query);
    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error obteniendo áreas' });
  }
};

export const getAreaById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) { res.status(400).json({ success: false, message: 'ID inválido' }); return; }
    const result = await getAreaByIdService(id);
    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    res.status(404).json({ success: false, message: error.message || 'Área no encontrada' });
  }
};

export const getAreaWithCarreras = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) { res.status(400).json({ success: false, message: 'ID inválido' }); return; }
    const result = await getAreaWithCarrerasService(id);
    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    res.status(404).json({ success: false, message: error.message || 'Área no encontrada' });
  }
};

export const updateArea = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) { res.status(400).json({ success: false, message: 'ID inválido' }); return; }
    const updateData = req.body;
    const result = await updateAreaService(id, updateData);
    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message || 'Error actualizando área' });
  }
};

export const deactivateArea = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) { res.status(400).json({ success: false, message: 'ID inválido' }); return; }
    const result = await deactivateAreaService(id);
    res.status(200).json({ success: true, data: result, message: 'Área desactivada' });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message || 'Error desactivando área' });
  }
};
