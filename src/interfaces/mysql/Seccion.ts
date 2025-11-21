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

export interface ISeccionFilters {
  curso_id?: number;
  titulo?: string;
  activa?: boolean;
}

export interface ISeccionUpdateData {
  titulo?: string;
  descripcion?: string;
  orden?: number;
  duracion_estimada_minutos?: number;
  activa?: boolean;
}