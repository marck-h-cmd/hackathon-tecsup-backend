import { Optional } from "sequelize";

export interface ISeccionAttributes {
    id: number;
    curso_id: number;
    titulo: string;
    descripcion: string;
    orden: number;
    duracion_estimada_minutos: number;
    activa: boolean;
  }
  
  export interface ISeccionCreationAttributes 
    extends Optional<ISeccionAttributes, 'id'> {}