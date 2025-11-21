import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../config/database';
import User from './User';
import Seccion from './Seccion';
import { ISeccionCompletadaAttributes, ISeccionCompletadaCreationAttributes } from '../../interfaces/mysql/Progreso';

class SeccionCompletada extends Model<ISeccionCompletadaAttributes, ISeccionCompletadaCreationAttributes>
  implements ISeccionCompletadaAttributes {
  
  public id!: number;
  public usuario_id!: number;
  public seccion_id!: number;
  public fecha_completado!: Date;
  public tiempo_total_minutos?: number;
  public puntos_totales!: number;
  public porcentaje_completado!: number;
}

SeccionCompletada.init(
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
    seccion_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'secciones',
        key: 'id'
      }
    },
    fecha_completado: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    tiempo_total_minutos: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    puntos_totales: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    porcentaje_completado: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 0,
      validate: {
        min: 0,
        max: 100
      }
    }
  },
  {
    sequelize,
    tableName: 'secciones_completadas',
    timestamps: true,
    createdAt: 'fecha_completado',
    updatedAt: false,
    indexes: [
      {
        unique: true,
        fields: ['usuario_id', 'seccion_id']
      }
    ]
  }
);

// Relaciones
User.hasMany(SeccionCompletada, { foreignKey: 'usuario_id', as: 'seccionesCompletadas' });
SeccionCompletada.belongsTo(User, { foreignKey: 'usuario_id', as: 'usuario' });

Seccion.hasMany(SeccionCompletada, { foreignKey: 'seccion_id', as: 'completados' });
SeccionCompletada.belongsTo(Seccion, { foreignKey: 'seccion_id', as: 'seccion' });

export default SeccionCompletada;