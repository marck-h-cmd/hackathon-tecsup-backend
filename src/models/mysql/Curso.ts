
import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../config/database';

import { ICursoAttributes, ICursoCreationAttributes } from '../../interfaces/mysql/Curso';

class Curso extends Model<ICursoAttributes, ICursoCreationAttributes>
  implements ICursoAttributes {
  
  public id!: number;
  public codigo!: string;
  public nombre!: string;
  public descripcion!: string;
  public imagen_url?: string;
  public color_hex!: string;
  public duracion_estimada_horas!: number;
  public es_publico!: boolean;
  public activo!: boolean;
  public fecha_creacion!: Date;
}

Curso.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    codigo: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true
    },
    nombre: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    imagen_url: {
      type: DataTypes.STRING(500)
    },
    color_hex: {
      type: DataTypes.STRING(7),
      defaultValue: '#3B82F6'
    },
    duracion_estimada_horas: {
      type: DataTypes.INTEGER,
      defaultValue: 40
    },
    es_publico: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    fecha_creacion: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  },
  {
    sequelize,
    tableName: 'cursos',
    timestamps: true,
    createdAt: 'fecha_creacion',
    updatedAt: false
  }
);

export default Curso;