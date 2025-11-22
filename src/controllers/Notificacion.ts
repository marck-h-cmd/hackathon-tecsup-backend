import { Request, Response } from 'express';
import {
    createNotificacionService,
    getNotificacionesByUsuarioService,
    getNotificacionByIdService,
    markAsLeidaService,
    deactivateNotificacionService
} from '../services/Notificacion';
import { INotificacionCreationAttributes, INotificacionFilters } from '../interfaces/mysql/Notificacion';

// Crear notificación
export const createNotificacion = async (req: Request, res: Response): Promise<void> => {
    try {
        const data: INotificacionCreationAttributes = req.body;
        const result = await createNotificacionService(data);
        res.status(201).json({ success: true, data: result });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message || 'Error al crear notificación' });
    }
};

// Listar notificaciones por usuario (filtros + paginación)
export const getNotificacionesByUsuario = async (req: Request, res: Response): Promise<void> => {
    try {
        const filters: INotificacionFilters = {
            usuario_id: req.query.usuario_id ? parseInt(req.query.usuario_id as string) : undefined,
            tipo: req.query.tipo as any,
            leida: req.query.leida === 'true' ? true : req.query.leida === 'false' ? false : undefined,
            prioridad: req.query.prioridad as any,
            activo: req.query.activo === 'true' ? true : req.query.activo === 'false' ? false : undefined
        };
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;
        const pagination = { page, limit };
        const result = await getNotificacionesByUsuarioService(filters, pagination);
        res.status(200).json({ success: true, data: result });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message || 'Error al obtener notificaciones' });
    }
};

// Obtener notificación por id
export const getNotificacionById = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) { res.status(400).json({ success: false, message: 'ID inválido' }); return; }
        const result = await getNotificacionByIdService(id);
        res.status(200).json({ success: true, data: result });
    } catch (error: any) {
        res.status(404).json({ success: false, message: error.message || 'Notificación no encontrada' });
    }
};

// Marcar como leída
export const markAsLeida = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) { res.status(400).json({ success: false, message: 'ID inválido' }); return; }
        const result = await markAsLeidaService(id);
        res.status(200).json({ success: true, data: result });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message || 'Error al marcar como leída' });
    }
};

// Desactivar notificación
export const deactivateNotificacion = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) { res.status(400).json({ success: false, message: 'ID inválido' }); return; }
        const result = await deactivateNotificacionService(id);
        res.status(200).json({ success: true, data: result, message: 'Notificación desactivada' });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message || 'Error al desactivar notificación' });
    }
};
