import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../config/database';
import User from './User';
import Curso from './Curso';
import { ICursoCompletadoAttributes, ICursoCompletadoCreationAttributes } from '../../interfaces/mysql/Progreso'

class CursoCompletado extends Model<ICursoCompletadoAttributes, ICursoCompletadoCreationAttributes>
  implements ICursoCompletadoAttributes {
  
  public id!: number;
  public usuario_id!: number;
  public curso_id!: number;
  public fecha_inicio!: Date;
  public fecha_completado?: Date;
  public tiempo_total_horas?: number;
  public puntos_totales!: number;
  public porcentaje_completado!: number;
  public certificado_emitido!: boolean;
}

CursoCompletado.init(
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
    curso_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'cursos',
        key: 'id'
      }
    },
    fecha_inicio: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    fecha_completado: {
      type: DataTypes.DATE,
      allowNull: true
    },
    tiempo_total_horas: {
      type: DataTypes.DECIMAL(10, 2),
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
    },
    certificado_emitido: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  },
  {
    sequelize,
    tableName: 'cursos_completados',
    timestamps: true,
    createdAt: 'fecha_inicio',
    updatedAt: 'fecha_completado',
    indexes: [
      {
        unique: true,
        fields: ['usuario_id', 'curso_id']
      }
    ]
  }
);

// Relaciones
User.hasMany(CursoCompletado, { foreignKey: 'usuario_id', as: 'cursosCompletados' });
CursoCompletado.belongsTo(User, { foreignKey: 'usuario_id', as: 'usuario' });

Curso.hasMany(CursoCompletado, { foreignKey: 'curso_id', as: 'completados' });
CursoCompletado.belongsTo(Curso, { foreignKey: 'curso_id', as: 'curso' });

export default CursoCompletado;