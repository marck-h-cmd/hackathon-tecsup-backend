import { Optional } from "sequelize";


export interface IStreakAttributes {
    id: number;
    estudiante_id: number;
    tipo: 'estudio' | 'ejercicios';
    dias_consecutivos: number;
    ultima_actividad: Date;
    completado_hoy: boolean;
    fecha_creacion: Date;
  }

  export interface IStreakCreationAttributes 
  extends Optional<IStreakAttributes, 'id' | 'fecha_creacion'> {}