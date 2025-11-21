import { Optional } from "sequelize";
import { TipoContenido } from "../shared/enums";
export interface ITemaAttributes {
    id: number;
    seccion_id: number;
    titulo: string;
    contenido: string;
    orden: number;
    tipo_contenido: TipoContenido;
    duracion_estimada_minutos: number;
    puntos_requeridos: number; // Puntos necesarios para desbloquear
    activo: boolean;
  }
  
  export interface ITemaCreationAttributes 
    extends Optional<ITemaAttributes, 'id'> {}

export interface ITemaFilters {
  seccion_id?: number;
  curso_id?: number;
  titulo?: string;
  tipo_contenido?: TipoContenido;
  activo?: boolean;
}

export interface ITemaUpdateData {
  titulo?: string;
  contenido?: string;
  orden?: number;
  tipo_contenido?: TipoContenido;
  duracion_estimada_minutos?: number;
  puntos_requeridos?: number;
  activo?: boolean;
}
