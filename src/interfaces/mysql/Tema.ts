import { Optional } from "sequelize";

export interface ITemaAttributes {
    id: number;
    seccion_id: number;
    titulo: string;
    contenido: string;
    orden: number;
    tipo_contenido: 'teoria' | 'ejemplo' | 'video' | 'interactivo';
    duracion_estimada_minutos: number;
    puntos_requeridos: number; // Puntos necesarios para desbloquear
    activo: boolean;
  }
  
  export interface ITemaCreationAttributes 
    extends Optional<ITemaAttributes, 'id'> {}