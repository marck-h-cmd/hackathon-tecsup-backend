import { Optional } from "sequelize";
import { TipoEjercicio } from "../shared/enums";

export interface IEjercicioAttributes {
    id: number;
    tema_id: number;
    titulo: string;
    enunciado: string;
    tipo: TipoEjercicio;
    opciones?: string[]; 
    respuesta_correcta: string;
    explicacion: string;
    puntos: number;
    orden: number;
    activo: boolean;
  }
  
  export interface IEjercicioCreationAttributes 
    extends Optional<IEjercicioAttributes, 'id'> {}
  
  

export interface IEjercicioFilters {
  tema_id?: number;
  titulo?: string;
  tipo?: TipoEjercicio;
  activo?: boolean;
}

export interface IEjercicioUpdateData {
  titulo?: string;
  enunciado?: string;
  tipo?: TipoEjercicio;
  opciones?: string[];
  respuesta_correcta?: string;
  explicacion?: string;
  puntos?: number;
  orden?: number;
  activo?: boolean;
}