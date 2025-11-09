import { DataTypes , Model} from "sequelize";
import { sequelize } from '../../config/database';
import { IRewardAttributes,IRewardCreationAttributes } from "../../interfaces/mysql/Reward";
import { CategoriaReward, TipoReward } from "../../interfaces/shared/enums";

class Reward extends Model<IRewardAttributes, IRewardCreationAttributes>
  implements IRewardAttributes {
  
  public id!: number;
  public estudiante_id!: number;
  public tipo!: TipoReward;
  public nombre!: string;
  public descripcion!: string;
  public icono!: string;
  public puntos!: number;
  public categoria!: CategoriaReward;
  public fecha_obtencion!: Date;
}

Reward.init(
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
      type: DataTypes.ENUM('badge', 'puntos', 'insignia'),
      allowNull: false
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    icono: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    puntos: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    categoria: {
      type: DataTypes.ENUM('estudio', 'ejercicios', 'streak'),
      allowNull: false
    },
    fecha_obtencion: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  },
  {
    sequelize,
    tableName: 'rewards',
    timestamps: false
  }
);

export default Reward;