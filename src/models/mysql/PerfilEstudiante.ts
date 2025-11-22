import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../config/database';
import { IPerfilEstudianteAttributes, IPerfilEstudianteCreationAttributes } from '../../interfaces/mysql/PerfilEstudiante';
import User from './User';
import { TipoInstitucion,HorarioPreferido , EstiloAprendizaje} from '../../interfaces/shared/enums';

class PerfilEstudiante extends Model<IPerfilEstudianteAttributes, IPerfilEstudianteCreationAttributes>
  implements IPerfilEstudianteAttributes {
  
  public id!: number;
  public usuario_id!: number;
  public nombre_completo!: string;
  public nombre_institucion!: string;
  public tipo_institucion!: TipoInstitucion;
  public carrera_id?: number;
  public ciclo_actual!: number;
  public estilo_aprendizaje!: EstiloAprendizaje;
  public horario_preferido!: HorarioPreferido;
  public streak_actual!: number;
  public streak_maximo!:number;
  public nivel_experiencia!: number;
  public puntos_experiencia!: number;
  public fecha_actualizacion!: Date;
}

PerfilEstudiante.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true
    },
    nombre_completo: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    nombre_institucion: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    tipo_institucion: {
      type: DataTypes.ENUM('universidad', 'instituto'),
      allowNull: false
    },
    carrera_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    ciclo_actual: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 12
      }
    },
    estilo_aprendizaje: {
      type: DataTypes.ENUM('visual', 'auditivo', 'kinestesico', 'lectura'),
      defaultValue: 'visual'
    },
    horario_preferido: {
      type: DataTypes.ENUM('mañana', 'tarde', 'noche'),
      defaultValue: 'tarde'
    },
    streak_actual: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    streak_maximo: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
    nivel_experiencia: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    },
    puntos_experiencia: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    fecha_actualizacion: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  },
  {
    sequelize,
    tableName: 'perfiles_estudiantes',
    timestamps: false
  }
);

// Relaciones
User.hasOne(PerfilEstudiante, { 
  foreignKey: 'usuario_id', 
  as: 'perfil_estudiante' 
});

PerfilEstudiante.belongsTo(User, { 
  foreignKey: 'usuario_id', 
  as: 'usuario' 
});

// Asociación a Carrera: require perezoso para evitar circular imports
setImmediate(() => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const Carrera = require('./Carrera').default;
    if (Carrera && typeof Carrera === 'function') {
      PerfilEstudiante.belongsTo(Carrera, { foreignKey: 'carrera_id', as: 'carrera' });
    }
  } catch (err) {
    // ignore
  }
});

export default PerfilEstudiante;