import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../config/database';
import User from './User';
import Tema from './Tema';
import { ITemaCompletadoAttributes, ITemaCompletadoCreationAttributes } from '../../interfaces/mysql/Progreso';

class TemaCompletado extends Model<ITemaCompletadoAttributes, ITemaCompletadoCreationAttributes>
  implements ITemaCompletadoAttributes {
  
  public id!: number;
  public usuario_id!: number;
  public tema_id!: number;
  public fecha_completado!: Date;
  public tiempo_dedicado_minutos?: number;
  public puntos_obtenidos!: number;
}

TemaCompletado.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'usuarios',
        key: 'id'
      }
    },
    tema_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'temas',
        key: 'id'
      }
    },
    fecha_completado: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    tiempo_dedicado_minutos: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    puntos_obtenidos: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  },
  {
    sequelize,
    tableName: 'temas_completados',
    timestamps: true,
    createdAt: 'fecha_completado',
    updatedAt: false,
    indexes: [
      {
        unique: true,
        fields: ['usuario_id', 'tema_id']
      }
    ]
  }
);

// Relaciones
User.hasMany(TemaCompletado, { foreignKey: 'usuario_id', as: 'temasCompletados' });
TemaCompletado.belongsTo(User, { foreignKey: 'usuario_id', as: 'usuario' });

Tema.hasMany(TemaCompletado, { foreignKey: 'tema_id', as: 'completados' });
TemaCompletado.belongsTo(Tema, { foreignKey: 'tema_id', as: 'tema' });

export default TemaCompletado;