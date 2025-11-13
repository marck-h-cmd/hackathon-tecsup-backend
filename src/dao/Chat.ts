import { SesionTutoria, GeneralChat } from '../models/mongodb/SesionTutoria';
import { ISesionTutoria, IMensajeTutoria } from '../interfaces/mongodb/SesionTutoria';
import { 
  ICreateChatSession, 
  IAddMessage, 
  IChatFilters, 
  IUpdateSession 
} from '../interfaces/mongodb/Chat';
import { ApiResponse, PaginationParams, PaginatedResponse } from '../interfaces/shared/types';
import { v4 as uuidv4 } from 'uuid';

export class ChatDAO {
  
  // ============================================
  // SESIONES DE TUTORÍA
  // ============================================

  /**
   * Crea una nueva sesión de tutoría
   */
  async createSesionTutoria(sessionData: ICreateChatSession): Promise<ApiResponse<ISesionTutoria>> {
    try {
      const sesionId = uuidv4();
      const now = new Date();

      const sesion = new SesionTutoria({
        _id: sesionId,
        estudiante_id: sessionData.estudiante_id,
        curso_id: sessionData.curso_id,
        tema_id: sessionData.tema_id,
        mensajes: [],
        duracion_minutos: 0,
        fecha_inicio: now,
        fecha_fin: now
      });

      await sesion.save();

      return {
        success: true,
        data: sesion.toObject() as ISesionTutoria
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido al crear sesión'
      };
    }
  }

  /**
   * Obtiene una sesión de tutoría por ID
   */
  async getSesionTutoriaById(sesionId: string): Promise<ApiResponse<ISesionTutoria>> {
    try {
      const sesion = await SesionTutoria.findById(sesionId);
      
      if (!sesion) {
        return {
          success: false,
          error: 'Sesión de tutoría no encontrada'
        };
      }

      return {
        success: true,
        data: sesion.toObject() as ISesionTutoria
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  }

  /**
   * Agrega un mensaje a una sesión de tutoría
   */
  async addMessageToSesionTutoria(
    sesionId: string, 
    mensaje: IMensajeTutoria
  ): Promise<ApiResponse<ISesionTutoria>> {
    try {
      const sesion = await SesionTutoria.findById(sesionId);
      
      if (!sesion) {
        return {
          success: false,
          error: 'Sesión de tutoría no encontrada'
        };
      }

      sesion.mensajes.push(mensaje);
      sesion.fecha_fin = new Date();
      
      // Calcular duración en minutos
      const duracionMs = sesion.fecha_fin.getTime() - sesion.fecha_inicio.getTime();
      sesion.duracion_minutos = Math.floor(duracionMs / 60000);

      await sesion.save();

      return {
        success: true,
        data: sesion.toObject() as ISesionTutoria
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido al agregar mensaje'
      };
    }
  }

  /**
   * Obtiene sesiones de tutoría con filtros
   */
  async getSesionesTutoria(
    filters: IChatFilters,
    pagination: PaginationParams
  ): Promise<ApiResponse<PaginatedResponse<ISesionTutoria>>> {
    try {
      const query: any = {};

      if (filters.estudiante_id) {
        query.estudiante_id = filters.estudiante_id;
      }
      if (filters.curso_id) {
        query.curso_id = filters.curso_id;
      }
      if (filters.tema_id) {
        query.tema_id = filters.tema_id;
      }
      if (filters.fecha_inicio || filters.fecha_fin) {
        query.fecha_inicio = {};
        if (filters.fecha_inicio) {
          query.fecha_inicio.$gte = filters.fecha_inicio;
        }
        if (filters.fecha_fin) {
          query.fecha_inicio.$lte = filters.fecha_fin;
        }
      }

      const skip = (pagination.page - 1) * pagination.limit;
      
      const [sesiones, total] = await Promise.all([
        SesionTutoria.find(query)
          .sort({ fecha_inicio: -1 })
          .skip(skip)
          .limit(pagination.limit)
          .lean(),
        SesionTutoria.countDocuments(query)
      ]);

      return {
        success: true,
        data: {
          data: sesiones as ISesionTutoria[],
          total,
          page: pagination.page,
          limit: pagination.limit,
          totalPages: Math.ceil(total / pagination.limit)
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  }

  /**
   * Actualiza una sesión de tutoría
   */
  async updateSesionTutoria(
    sesionId: string,
    updateData: IUpdateSession
  ): Promise<ApiResponse<ISesionTutoria>> {
    try {
      const sesion = await SesionTutoria.findById(sesionId);
      
      if (!sesion) {
        return {
          success: false,
          error: 'Sesión de tutoría no encontrada'
        };
      }

      if (updateData.fecha_fin) {
        sesion.fecha_fin = updateData.fecha_fin;
      }
      if (updateData.duracion_minutos !== undefined) {
        sesion.duracion_minutos = updateData.duracion_minutos;
      } else if (updateData.fecha_fin) {
        // Recalcular duración si se actualiza fecha_fin
        const duracionMs = sesion.fecha_fin.getTime() - sesion.fecha_inicio.getTime();
        sesion.duracion_minutos = Math.floor(duracionMs / 60000);
      }

      await sesion.save();

      return {
        success: true,
        data: sesion.toObject() as ISesionTutoria
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  }

  // ============================================
  // CHAT GENERAL
  // ============================================

  /**
   * Crea una nueva sesión de chat general
   */
  async createGeneralChat(sessionData: ICreateChatSession): Promise<ApiResponse<any>> {
    try {
      const sesionId = uuidv4();
      const now = new Date();

      const sesion = new GeneralChat({
        _id: sesionId,
        estudiante_id: sessionData.estudiante_id,
        mensajes: [],
        fecha_inicio: now,
        fecha_fin: now
      });

      await sesion.save();

      return {
        success: true,
        data: sesion.toObject()
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido al crear sesión'
      };
    }
  }

  /**
   * Obtiene una sesión de chat general por ID
   */
  async getGeneralChatById(sesionId: string): Promise<ApiResponse<any>> {
    try {
      const sesion = await GeneralChat.findById(sesionId);
      
      if (!sesion) {
        return {
          success: false,
          error: 'Sesión de chat no encontrada'
        };
      }

      return {
        success: true,
        data: sesion.toObject()
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  }

  /**
   * Agrega un mensaje a una sesión de chat general
   */
  async addMessageToGeneralChat(
    sesionId: string, 
    mensaje: IMensajeTutoria
  ): Promise<ApiResponse<any>> {
    try {
      const sesion = await GeneralChat.findById(sesionId);
      
      if (!sesion) {
        return {
          success: false,
          error: 'Sesión de chat no encontrada'
        };
      }

      sesion.mensajes.push(mensaje);
      sesion.fecha_fin = new Date();

      await sesion.save();

      return {
        success: true,
        data: sesion.toObject()
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido al agregar mensaje'
      };
    }
  }

  /**
   * Obtiene sesiones de chat general con filtros
   */
  async getGeneralChats(
    filters: IChatFilters,
    pagination: PaginationParams
  ): Promise<ApiResponse<PaginatedResponse<any>>> {
    try {
      const query: any = {};

      if (filters.estudiante_id) {
        query.estudiante_id = filters.estudiante_id;
      }
      if (filters.fecha_inicio || filters.fecha_fin) {
        query.fecha_inicio = {};
        if (filters.fecha_inicio) {
          query.fecha_inicio.$gte = filters.fecha_inicio;
        }
        if (filters.fecha_fin) {
          query.fecha_inicio.$lte = filters.fecha_fin;
        }
      }

      const skip = (pagination.page - 1) * pagination.limit;
      
      const [sesiones, total] = await Promise.all([
        GeneralChat.find(query)
          .sort({ fecha_inicio: -1 })
          .skip(skip)
          .limit(pagination.limit)
          .lean(),
        GeneralChat.countDocuments(query)
      ]);

      return {
        success: true,
        data: {
          data: sesiones,
          total,
          page: pagination.page,
          limit: pagination.limit,
          totalPages: Math.ceil(total / pagination.limit)
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  }

  /**
   * Obtiene la última sesión activa de un estudiante
   */
  async getLastActiveSession(estudianteId: number, tipo: 'tutoria' | 'general' = 'general'): Promise<ApiResponse<any>> {
    try {
      const Model = tipo === 'tutoria' ? SesionTutoria : GeneralChat;
      const sesion = await Model.findOne({ estudiante_id: estudianteId })
        .sort({ fecha_inicio: -1 })
        .lean();

      if (!sesion) {
        return {
          success: false,
          error: 'No se encontró sesión activa'
        };
      }

      return {
        success: true,
        data: sesion
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  }
}

export const chatDAO = new ChatDAO();


