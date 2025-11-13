import { chatDAO } from '../dao/Chat';
import { 
  ICreateChatSession, 
  IAddMessage, 
  IChatFilters, 
  IUpdateSession,
  IChatResponse 
} from '../interfaces/mongodb/Chat';
import { ISesionTutoria, IMensajeTutoria } from '../interfaces/mongodb/SesionTutoria';
import { ChatMessage } from '../interfaces/shared/AIProvider';
import { AIProviderFactory } from './AIProviders';
import { PaginationParams, PaginatedResponse } from '../interfaces/shared/types';
import { v4 as uuidv4 } from 'uuid';

// ============================================
// CHAT SERVICES
// ============================================

/**
 * Crea una nueva sesión de chat (tutoría o general)
 */
export const createChatSessionService = async (
  sessionData: ICreateChatSession
): Promise<ISesionTutoria | any> => {
  try {
    const tipo = sessionData.tipo || 'general';
    
    const result = tipo === 'tutoria' 
      ? await chatDAO.createSesionTutoria(sessionData)
      : await chatDAO.createGeneralChat(sessionData);

    if (!result.success || !result.data) {
      throw new Error(result.error || 'Error al crear sesión de chat');
    }

    return result.data;
  } catch (error: any) {
    throw error instanceof Error ? error : new Error('Error en el servicio al crear sesión de chat');
  }
};

/**
 * Obtiene una sesión de chat por ID
 */
export const getChatSessionService = async (
  sesionId: string,
  tipo: 'tutoria' | 'general' = 'general'
): Promise<ISesionTutoria | any> => {
  try {
    const result = tipo === 'tutoria'
      ? await chatDAO.getSesionTutoriaById(sesionId)
      : await chatDAO.getGeneralChatById(sesionId);

    if (!result.success || !result.data) {
      throw new Error(result.error || 'Sesión no encontrada');
    }

    return result.data;
  } catch (error: any) {
    throw error instanceof Error ? error : new Error('Error al obtener sesión de chat');
  }
};

/**
 * Envía un mensaje al chatbot y obtiene respuesta
 */
export const sendMessageService = async (
  messageData: IAddMessage,
  tipo: 'tutoria' | 'general' = 'general',
  aiConfig?: any
): Promise<IChatResponse> => {
  try {
    // 1. Obtener la sesión
    const sesionResult = tipo === 'tutoria'
      ? await chatDAO.getSesionTutoriaById(messageData.sesion_id)
      : await chatDAO.getGeneralChatById(messageData.sesion_id);

    if (!sesionResult.success || !sesionResult.data) {
      throw new Error(sesionResult.error || 'Sesión no encontrada');
    }

    const sesion = sesionResult.data;

    // 2. Crear mensaje del estudiante
    const mensajeEstudiante: IMensajeTutoria = {
      id: uuidv4(),
      rol: 'estudiante',
      contenido: messageData.contenido,
      timestamp: new Date(),
      tipo: messageData.tipo || 'pregunta'
    };

    // 3. Preparar mensajes para el modelo de IA
    const chatMessages: ChatMessage[] = sesion.mensajes.map((msg: IMensajeTutoria) => ({
      role: msg.rol === 'estudiante' ? 'user' : 'assistant',
      content: msg.contenido
    }));

    // Agregar el nuevo mensaje del estudiante
    chatMessages.push({
      role: 'user',
      content: messageData.contenido
    });

    // 4. Obtener respuesta del modelo de IA
    const aiProvider = AIProviderFactory.create(aiConfig);
    const aiResponse = await aiProvider.chat(chatMessages, aiConfig);

    // 5. Crear mensaje del sistema (IA)
    const mensajeSistema: IMensajeTutoria = {
      id: uuidv4(),
      rol: 'sistema',
      contenido: aiResponse.content,
      timestamp: new Date(),
      tipo: 'respuesta'
    };

    // 6. Agregar ambos mensajes a la sesión
    if (tipo === 'tutoria') {
      await chatDAO.addMessageToSesionTutoria(messageData.sesion_id, mensajeEstudiante);
      await chatDAO.addMessageToSesionTutoria(messageData.sesion_id, mensajeSistema);
    } else {
      await chatDAO.addMessageToGeneralChat(messageData.sesion_id, mensajeEstudiante);
      await chatDAO.addMessageToGeneralChat(messageData.sesion_id, mensajeSistema);
    }

    // 7. Obtener la sesión actualizada
    const updatedSesionResult = tipo === 'tutoria'
      ? await chatDAO.getSesionTutoriaById(messageData.sesion_id)
      : await chatDAO.getGeneralChatById(messageData.sesion_id);

    const updatedSesion = updatedSesionResult.success && updatedSesionResult.data 
      ? updatedSesionResult.data 
      : sesion;

    return {
      sesion_id: messageData.sesion_id,
      mensaje: mensajeEstudiante,
      respuesta_ia: mensajeSistema,
      sesion: updatedSesion
    };
  } catch (error: any) {
    throw error instanceof Error ? error : new Error('Error en el servicio al enviar mensaje');
  }
};

/**
 * Obtiene sesiones de chat con filtros
 */
export const getChatSessionsService = async (
  filters: IChatFilters,
  pagination: PaginationParams
): Promise<PaginatedResponse<ISesionTutoria | any>> => {
  try {
    const tipo = filters.tipo || 'general';
    
    const result = tipo === 'tutoria'
      ? await chatDAO.getSesionesTutoria(filters, pagination)
      : await chatDAO.getGeneralChats(filters, pagination);

    if (!result.success || !result.data) {
      throw new Error(result.error || 'Error al obtener sesiones');
    }

    return result.data;
  } catch (error: any) {
    throw error instanceof Error ? error : new Error('Error en el servicio al obtener sesiones');
  }
};

/**
 * Actualiza una sesión de chat
 */
export const updateChatSessionService = async (
  sesionId: string,
  updateData: IUpdateSession,
  tipo: 'tutoria' | 'general' = 'general'
): Promise<ISesionTutoria | any> => {
  try {
    // Solo las sesiones de tutoría tienen duración
    if (tipo === 'tutoria') {
      const result = await chatDAO.updateSesionTutoria(sesionId, updateData);
      
      if (!result.success || !result.data) {
        throw new Error(result.error || 'Error al actualizar sesión');
      }

      return result.data;
    } else {
      // Para chat general, solo podemos actualizar fecha_fin
      const sesion = await chatDAO.getGeneralChatById(sesionId);
      if (!sesion.success || !sesion.data) {
        throw new Error(sesion.error || 'Sesión no encontrada');
      }
      return sesion.data;
    }
  } catch (error: any) {
    throw error instanceof Error ? error : new Error('Error en el servicio al actualizar sesión');
  }
};

/**
 * Obtiene la última sesión activa de un estudiante
 */
export const getLastActiveSessionService = async (
  estudianteId: number,
  tipo: 'tutoria' | 'general' = 'general'
): Promise<ISesionTutoria | any> => {
  try {
    const result = await chatDAO.getLastActiveSession(estudianteId, tipo);

    if (!result.success || !result.data) {
      throw new Error(result.error || 'No se encontró sesión activa');
    }

    return result.data;
  } catch (error: any) {
    throw error instanceof Error ? error : new Error('Error al obtener última sesión activa');
  }
};

/**
 * Crea o reutiliza una sesión de chat para un estudiante
 */
export const getOrCreateSessionService = async (
  estudianteId: number,
  tipo: 'tutoria' | 'general' = 'general',
  cursoId?: number,
  temaId?: number
): Promise<ISesionTutoria | any> => {
  try {
    // Intentar obtener la última sesión activa
    const lastSessionResult = await chatDAO.getLastActiveSession(estudianteId, tipo);
    
    if (lastSessionResult.success && lastSessionResult.data) {
      const lastSession = lastSessionResult.data;
      // Si la sesión es reciente (menos de 1 hora), reutilizarla
      const ahora = new Date();
      const fechaFin = new Date(lastSession.fecha_fin);
      const horasDiferencia = (ahora.getTime() - fechaFin.getTime()) / (1000 * 60 * 60);
      
      if (horasDiferencia < 1) {
        return lastSession;
      }
    }

    // Crear nueva sesión
    const sessionData: ICreateChatSession = {
      estudiante_id: estudianteId,
      tipo,
      curso_id: cursoId,
      tema_id: temaId
    };

    return await createChatSessionService(sessionData);
  } catch (error: any) {
    throw error instanceof Error ? error : new Error('Error al obtener o crear sesión');
  }
};


