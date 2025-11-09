import { Optional } from "sequelize";

export interface ICursoAttributes {
    id: number;
    codigo: string;
    nombre: string;
    descripcion: string;
    imagen_url?: string;
    color_hex: string;
    duracion_estimada_horas: number;
    es_publico: boolean;
    activo: boolean;
    fecha_creacion: Date;
  }
  
  export interface ICursoCreationAttributes 
    extends Optional<ICursoAttributes, 'id' | 'fecha_creacion'> {}
  