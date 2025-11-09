import { Optional } from 'sequelize';
import { TipoUsuario, EstiloAprendizaje } from '../shared/enums';

export interface IUserAttributes {
  id: number;
  email: string;
  password_hash: string;
  tipo_usuario: TipoUsuario;
  activo: boolean;
  idioma_preferido: string;
  fecha_registro: Date;
}

export interface IUserCreationAttributes extends Optional<IUserAttributes, 'id' | 'fecha_registro'> {}


export interface IUserFilters {
  email?: string;
  tipo_usuario?: TipoUsuario;
  activo?: boolean;
  institucion_id?: number;
  carrera_principal?: string;
}

export interface IUserUpdateData {
  email?: string;
  password_hash?: string;
  activo?: boolean;
  idioma_preferido?: string;
}