import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../config/database';
import { IUserAttributes, IUserCreationAttributes } from '../../interfaces/mysql/User';
import { TipoUsuario } from '../../interfaces/shared/enums';


class User extends Model<IUserAttributes, IUserCreationAttributes> 
  implements IUserAttributes {
  
  public id!: number;
  public email!: string;
  public password_hash!: string;
  public tipo_usuario!: TipoUsuario;
  public activo!: boolean;
  public idioma_preferido!: string;
  public fecha_registro!: Date;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
        notEmpty: true
      }
    },
    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    tipo_usuario: {
      type: DataTypes.ENUM('estudiante', 'admin'),
      defaultValue: 'estudiante'
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    idioma_preferido: {
      type: DataTypes.STRING(10),
      defaultValue: 'es'
    },
    fecha_registro: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  },
  {
    sequelize,
    tableName: 'usuarios',
    timestamps: true,
    createdAt: 'fecha_registro',
    updatedAt: false
  }
);

export default User;