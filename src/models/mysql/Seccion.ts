import { ICursoCreationAttributes } from './../../interfaces/mysql/Curso';
import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../config/database';
import Curso from './Curso';
import { ISeccionAttributes, ISeccionCreationAttributes } from '../../interfaces/mysql/Seccion';

class Seccion extends Model<ISeccionAttributes, ISeccionCreationAttributes>
  implements ISeccionAttributes {
  
  public id!: number;
  public curso_id!: number;
  public titulo!: string;
  public descripcion!: string;
  public orden!: number;
  public duracion_estimada_minutos!: number;
  public activa!: boolean;
}

Seccion.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    curso_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    titulo: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    descripcion: {
      type: DataTypes.TEXT
    },
    orden: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    duracion_estimada_minutos: {
      type: DataTypes.INTEGER,
      defaultValue: 60
    },
    activa: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  },
  {
    sequelize,
    tableName: 'secciones',
    timestamps: false
  }
);

// Relaciones
Curso.hasMany(Seccion, { foreignKey: 'curso_id', as: 'secciones' });
Seccion.belongsTo(Curso, { foreignKey: 'curso_id', as: 'curso' });

export default Seccion;