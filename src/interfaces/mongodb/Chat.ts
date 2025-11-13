import { IMensajeTutoria, ISesionTutoria } from './SesionTutoria';

/**
 * Interfaz para crear una nueva sesión de chat
 */
export interface ICreateChatSession {
  estudiante_id: number;
  curso_id?: number;
  tema_id?: number;
  tipo?: 'tutoria' | 'general';
}

/**
 * Interfaz para agregar un mensaje a una sesión
 */
export interface IAddMessage {
  sesion_id: string;
  contenido: string;
  tipo?: 'pregunta' | 'respuesta' | 'ejemplo';
}

/**
 * Interfaz para obtener sesiones con filtros
 */
export interface IChatFilters {
  estudiante_id?: number;
  curso_id?: number;
  tema_id?: number;
  fecha_inicio?: Date;
  fecha_fin?: Date;
  tipo?: 'tutoria' | 'general';
}

/**
 * Interfaz para respuesta de chat
 */
export interface IChatResponse {
  sesion_id: string;
  mensaje: IMensajeTutoria;
  respuesta_ia: IMensajeTutoria;
  sesion: ISesionTutoria | any;
}

/**
 * Interfaz para actualizar una sesión
 */
export interface IUpdateSession {
  fecha_fin?: Date;
  duracion_minutos?: number;
}


