import { Request, Response } from "express";
import {
  createChatSessionService,
  getChatSessionService,
  sendMessageService,
  getChatSessionsService,
  updateChatSessionService,
  getLastActiveSessionService,
  getOrCreateSessionService
} from "../services/Chat";
import { 
  ICreateChatSession, 
  IAddMessage, 
  IChatFilters, 
  IUpdateSession 
} from "../interfaces/mongodb/Chat";

// ============================================
// CHAT CONTROLLERS
// ============================================

/**
 * Crea una nueva sesión de chat
 */
export const createChatSession = async (req: Request, res: Response): Promise<void> => {
  try {
    const sessionData: ICreateChatSession = {
      estudiante_id: parseInt(req.body.estudiante_id),
      curso_id: req.body.curso_id ? parseInt(req.body.curso_id) : undefined,
      tema_id: req.body.tema_id ? parseInt(req.body.tema_id) : undefined,
      tipo: req.body.tipo || 'general'
    };

    if (!sessionData.estudiante_id || isNaN(sessionData.estudiante_id)) {
      res.status(400).json({ 
        success: false, 
        message: 'El ID del estudiante es obligatorio y debe ser un número válido' 
      });
      return;
    }

    const result = await createChatSessionService(sessionData);
    res.status(201).json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ 
      success: false, 
      message: error.message || 'Error al crear sesión de chat' 
    });
  }
};

/**
 * Obtiene una sesión de chat por ID
 */
export const getChatSession = async (req: Request, res: Response): Promise<void> => {
  try {
    const sesionId = req.params.sesionId;
    const tipo = (req.query.tipo as 'tutoria' | 'general') || 'general';

    if (!sesionId) {
      res.status(400).json({ 
        success: false, 
        message: 'El ID de sesión es obligatorio' 
      });
      return;
    }

    const result = await getChatSessionService(sesionId, tipo);
    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    res.status(404).json({ 
      success: false, 
      message: error.message || 'Sesión no encontrada' 
    });
  }
};

/**
 * Envía un mensaje al chatbot y obtiene respuesta
 */
export const sendMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const messageData: IAddMessage = {
      sesion_id: req.body.sesion_id || req.params.sesionId,
      contenido: req.body.contenido || req.body.mensaje,
      tipo: req.body.tipo || 'pregunta'
    };

    const tipo = (req.body.tipo_sesion || req.query.tipo || 'general') as 'tutoria' | 'general';
    
    // Configuración opcional de IA desde el body
    const aiConfig = req.body.ai_config || {};

    if (!messageData.sesion_id) {
      res.status(400).json({ 
        success: false, 
        message: 'El ID de sesión es obligatorio' 
      });
      return;
    }

    if (!messageData.contenido) {
      res.status(400).json({ 
        success: false, 
        message: 'El contenido del mensaje es obligatorio' 
      });
      return;
    }

    const result = await sendMessageService(messageData, tipo, aiConfig);
    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ 
      success: false, 
      message: error.message || 'Error al enviar mensaje' 
    });
  }
};

/**
 * Obtiene sesiones de chat con filtros
 */
export const getChatSessions = async (req: Request, res: Response): Promise<void> => {
  try {
    const filters: IChatFilters = {
      estudiante_id: req.query.estudiante_id ? parseInt(req.query.estudiante_id as string) : undefined,
      curso_id: req.query.curso_id ? parseInt(req.query.curso_id as string) : undefined,
      tema_id: req.query.tema_id ? parseInt(req.query.tema_id as string) : undefined,
      fecha_inicio: req.query.fecha_inicio ? new Date(req.query.fecha_inicio as string) : undefined,
      fecha_fin: req.query.fecha_fin ? new Date(req.query.fecha_fin as string) : undefined,
      tipo: (req.query.tipo as 'tutoria' | 'general') || 'general'
    };

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const pagination = { page, limit };

    const result = await getChatSessionsService(filters, pagination);
    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Error al obtener sesiones' 
    });
  }
};

/**
 * Actualiza una sesión de chat
 */
export const updateChatSession = async (req: Request, res: Response): Promise<void> => {
  try {
    const sesionId = req.params.sesionId;
    const tipo = (req.query.tipo || req.body.tipo || 'general') as 'tutoria' | 'general';
    
    const updateData: IUpdateSession = {
      fecha_fin: req.body.fecha_fin ? new Date(req.body.fecha_fin) : undefined,
      duracion_minutos: req.body.duracion_minutos
    };

    if (!sesionId) {
      res.status(400).json({ 
        success: false, 
        message: 'El ID de sesión es obligatorio' 
      });
      return;
    }

    const result = await updateChatSessionService(sesionId, updateData, tipo);
    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ 
      success: false, 
      message: error.message || 'Error al actualizar sesión' 
    });
  }
};

/**
 * Obtiene la última sesión activa de un estudiante
 */
export const getLastActiveSession = async (req: Request, res: Response): Promise<void> => {
  try {
    const estudianteId = parseInt(req.params.estudianteId);
    const tipo = (req.query.tipo || 'general') as 'tutoria' | 'general';

    if (!estudianteId || isNaN(estudianteId)) {
      res.status(400).json({ 
        success: false, 
        message: 'El ID del estudiante es obligatorio y debe ser un número válido' 
      });
      return;
    }

    const result = await getLastActiveSessionService(estudianteId, tipo);
    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    res.status(404).json({ 
      success: false, 
      message: error.message || 'No se encontró sesión activa' 
    });
  }
};

/**
 * Obtiene o crea una sesión de chat para un estudiante
 */
export const getOrCreateSession = async (req: Request, res: Response): Promise<void> => {
  try {
    const estudianteId = parseInt(req.body.estudiante_id || req.params.estudianteId);
    const tipo = (req.body.tipo || req.query.tipo || 'general') as 'tutoria' | 'general';
    const cursoId = req.body.curso_id ? parseInt(req.body.curso_id) : undefined;
    const temaId = req.body.tema_id ? parseInt(req.body.tema_id) : undefined;

    if (!estudianteId || isNaN(estudianteId)) {
      res.status(400).json({ 
        success: false, 
        message: 'El ID del estudiante es obligatorio y debe ser un número válido' 
      });
      return;
    }

    const result = await getOrCreateSessionService(estudianteId, tipo, cursoId, temaId);
    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ 
      success: false, 
      message: error.message || 'Error al obtener o crear sesión' 
    });
  }
};

/**
 * Endpoint combinado: obtiene o crea sesión y envía mensaje en una sola llamada
 */
export const chatWithBot = async (req: Request, res: Response): Promise<void> => {
  try {
    const estudianteId = parseInt(req.body.estudiante_id);
    const contenido = req.body.contenido || req.body.mensaje;
    const tipo = (req.body.tipo || 'general') as 'tutoria' | 'general';
    const cursoId = req.body.curso_id ? parseInt(req.body.curso_id) : undefined;
    const temaId = req.body.tema_id ? parseInt(req.body.tema_id) : undefined;
    const aiConfig = req.body.ai_config || {};

    if (!estudianteId || isNaN(estudianteId)) {
      res.status(400).json({ 
        success: false, 
        message: 'El ID del estudiante es obligatorio y debe ser un número válido' 
      });
      return;
    }

    if (!contenido) {
      res.status(400).json({ 
        success: false, 
        message: 'El contenido del mensaje es obligatorio' 
      });
      return;
    }

    // 1. Obtener o crear sesión
    const sesion = await getOrCreateSessionService(estudianteId, tipo, cursoId, temaId);

    // 2. Enviar mensaje
    const messageData: IAddMessage = {
      sesion_id: sesion._id,
      contenido,
      tipo: 'pregunta'
    };

    const result = await sendMessageService(messageData, tipo, aiConfig);
    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ 
      success: false, 
      message: error.message || 'Error al chatear con el bot' 
    });
  }
};


