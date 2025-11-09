import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../config/database';
import Seccion from './Seccion';
import { TipoContenido } from '../../interfaces/shared/enums';
import { ITemaAttributes,ITemaCreationAttributes } from '../../interfaces/mysql/Tema';
class Tema extends Model<ITemaAttributes, ITemaCreationAttributes>
  implements ITemaAttributes {
  
  public id!: number;
  public seccion_id!: number;
  public titulo!: string;
  public contenido!: string;
  public orden!: number;
  public tipo_contenido!: TipoContenido;
  public duracion_estimada_minutos!: number;
  public puntos_requeridos!: number;
  public activo!: boolean;
}

Tema.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    seccion_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    titulo: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    contenido: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    orden: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    tipo_contenido: {
      type: DataTypes.ENUM('teoria', 'ejemplo', 'video', 'interactivo'),
      defaultValue: 'teoria'
    },
    duracion_estimada_minutos: {
      type: DataTypes.INTEGER,
      defaultValue: 15
    },
    puntos_requeridos: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  },
  {
    sequelize,
    tableName: 'temas',
    timestamps: false
  }
);

// Relaciones
Seccion.hasMany(Tema, { foreignKey: 'seccion_id', as: 'temas' });
Tema.belongsTo(Seccion, { foreignKey: 'seccion_id', as: 'seccion' });

export default Tema;