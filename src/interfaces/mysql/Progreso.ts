// interfaces/mysql/TemaCompletado.ts
import { Optional } from 'sequelize';

export interface ITemaCompletadoAttributes {
  id: number;
  usuario_id: number;
  tema_id: number;
  fecha_completado: Date;
  tiempo_dedicado_minutos?: number;
  puntos_obtenidos: number;
}

export interface ITemaCompletadoCreationAttributes 
  extends Optional<ITemaCompletadoAttributes, 'id' | 'fecha_completado' | 'tiempo_dedicado_minutos' | 'puntos_obtenidos'> {}

// interfaces/mysql/SeccionCompletada.ts
export interface ISeccionCompletadaAttributes {
  id: number;
  usuario_id: number;
  seccion_id: number;
  fecha_completado: Date;
  tiempo_total_minutos?: number;
  puntos_totales: number;
  porcentaje_completado: number;
}

export interface ISeccionCompletadaCreationAttributes 
  extends Optional<ISeccionCompletadaAttributes, 'id' | 'fecha_completado' | 'tiempo_total_minutos' | 'puntos_totales' | 'porcentaje_completado'> {}

// interfaces/mysql/CursoCompletado.ts
export interface ICursoCompletadoAttributes {
  id: number;
  usuario_id: number;
  curso_id: number;
  fecha_inicio: Date;
  fecha_completado?: Date;
  tiempo_total_horas?: number;
  puntos_totales: number;
  porcentaje_completado: number;
  certificado_emitido: boolean;
}

export interface ICursoCompletadoCreationAttributes 
  extends Optional<ICursoCompletadoAttributes, 'id' | 'fecha_inicio' | 'fecha_completado' | 'tiempo_total_horas' | 'puntos_totales' | 'porcentaje_completado' | 'certificado_emitido'> {}