import { Optional } from "sequelize";


export type TTipoNotificacion = 'tarea' | 'vencimiento' | 'horario' | 'recomendacion' | 'general';
export type TPrioridad = 'baja' | 'media' | 'alta';

export interface INotificacionAttributes {
  id: number;
  tipo: TTipoNotificacion;
  titulo: string;
  descripcion: string;
  usuario_id: number;
  fecha_vencimiento?: Date | null;    // para tareas/fechas de entrega
  horario_inicio?: Date | null;       // para notificaciones de horario
  horario_fin?: Date | null;
  leida: boolean;
  prioridad?: TPrioridad;
  recomendaciones_estudio?: any;     // JSON con recomendaciones personalizadas según desempeño
  metadata?: any;                     // campo libre para datos adicionales (p. ej. relacion con tarea/curso)
  activo: boolean;
  fecha_creacion: Date;
}

export interface INotificacionCreationAttributes extends Optional<INotificacionAttributes, 'id' | 'fecha_creacion' | 'leida' | 'recomendaciones_estudio' | 'metadata' | 'fecha_vencimiento' | 'horario_inicio' | 'horario_fin' | 'prioridad'> {}

export interface INotificacionFilters {
  usuario_id?: number;
  tipo?: TTipoNotificacion;
  leida?: boolean;
  prioridad?: TPrioridad;
  activo?: boolean;
  fechaDesde?: Date;
  fechaHasta?: Date;
}

export interface INotificacionUpdateData {
  tipo?: TTipoNotificacion;
  titulo?: string;
  descripcion?: string;
  fecha_vencimiento?: Date | null;
  horario_inicio?: Date | null;
  horario_fin?: Date | null;
  leida?: boolean;
  prioridad?: TPrioridad;
  recomendaciones_estudio?: any;
  metadata?: any;
  activo?: boolean;
}
