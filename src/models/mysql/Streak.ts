import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../config/database';
import { IStreakAttributes, IStreakCreationAttributes } from '../../interfaces/mysql/Streak';
import { TipoActividad } from '../../interfaces/shared/enums';


class Streak extends Model<IStreakAttributes, IStreakCreationAttributes>
  implements IStreakAttributes {
  
  public id!: number;
  public estudiante_id!: number;
  public tipo!: TipoActividad;
  public dias_consecutivos!: number;
  public ultima_actividad!: Date;
  public completado_hoy!: boolean;
  public fecha_creacion!: Date;
}

Streak.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    estudiante_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    tipo: {
      type: DataTypes.ENUM('estudio', 'ejercicios'),
      allowNull: false
    },
    dias_consecutivos: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    ultima_actividad: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    completado_hoy: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    fecha_creacion: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  },
  {
    sequelize,
    tableName: 'streaks',
    timestamps: true,
    createdAt: 'fecha_creacion',
    updatedAt: 'ultima_actividad'
  }
);

export default Streak;