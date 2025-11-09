import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../config/database';
import Tema from './Tema';
import { TipoEjercicio } from '../../interfaces/shared/enums';
import {   IEjercicioAttributes,IEjercicioCreationAttributes } from '../../interfaces/mysql/Ejercicio';



class Ejercicio extends Model<IEjercicioAttributes, IEjercicioCreationAttributes>
  implements IEjercicioAttributes {
  
  public id!: number;
  public tema_id!: number;
  public titulo!: string;
  public enunciado!: string;
  public tipo!: TipoEjercicio;
  public opciones?: string[];
  public respuesta_correcta!: string;
  public explicacion!: string;
  public puntos!: number;
  public orden!: number;
  public activo!: boolean;
}

Ejercicio.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    tema_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    titulo: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    enunciado: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    tipo: {
      type: DataTypes.ENUM('multiple_choice', 'codigo', 'texto'),
      allowNull: false
    },
    opciones: {
      type: DataTypes.JSON
    },
    respuesta_correcta: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    explicacion: {
      type: DataTypes.TEXT
    },
    puntos: {
      type: DataTypes.INTEGER,
      defaultValue: 10
    },
    orden: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  },
  {
    sequelize,
    tableName: 'ejercicios',
    timestamps: false
  }
);

// Relaciones
Tema.hasMany(Ejercicio, { foreignKey: 'tema_id', as: 'ejercicios' });
Ejercicio.belongsTo(Tema, { foreignKey: 'tema_id', as: 'tema' });

export default Ejercicio;