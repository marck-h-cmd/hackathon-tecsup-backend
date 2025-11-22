import { DataTypes, Model, Optional } from 'sequelize';


import { TipoInstitucion, EstiloAprendizaje, TipoActividad, HorarioPreferido} from '../shared/enums';


export interface IPerfilEstudianteAttributes {
  id: number;
  usuario_id: number;
  nombre_completo: string;
  
  // Información académica 
  nombre_institucion: string;
  tipo_institucion: TipoInstitucion;
  carrera_id?: number; // ahora referencia a tabla carreras
  ciclo_actual: number;
  
  // Preferencias de aprendizaje
  estilo_aprendizaje: EstiloAprendizaje;
  horario_preferido:    HorarioPreferido;
  
  // Stats de engagement
  streak_actual: number;
  streak_maximo: number;
  nivel_experiencia: number;
  puntos_experiencia: number;
  
  fecha_actualizacion: Date;
}

export interface IPerfilEstudianteCreationAttributes 
  extends Optional<IPerfilEstudianteAttributes, 'id' | 'fecha_actualizacion' | 'carrera_id'> {}

  export interface IPerfilEstudianteUpdateData {
    nombre_completo?: string;
    nombre_institucion?: string;
    tipo_institucion?: TipoInstitucion;
    carrera_id?: number;
    ciclo_actual?: number;
    estilo_aprendizaje?:  EstiloAprendizaje;
    horario_preferido?: HorarioPreferido;
  }