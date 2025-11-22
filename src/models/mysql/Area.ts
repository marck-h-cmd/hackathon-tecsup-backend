import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../config/database';
import { IAreaAttributes, IAreaCreationAttributes } from '../../interfaces/mysql/Area';

class Area extends Model<IAreaAttributes, IAreaCreationAttributes> implements IAreaAttributes {
  public id!: number;
  public nombre!: string;
  public codigo?: string;
  public descripcion?: string;
  public activo!: boolean;
  public fecha_creacion!: Date;
}

Area.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nombre: { type: DataTypes.STRING(200), allowNull: false },
    codigo: { type: DataTypes.STRING(50), allowNull: true },
    descripcion: { type: DataTypes.TEXT, allowNull: true },
    activo: { type: DataTypes.BOOLEAN, defaultValue: true },
    fecha_creacion: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  },
  {
    sequelize,
    tableName: 'areas',
    timestamps: true,
    createdAt: 'fecha_creacion',
    updatedAt: false
  }
);

// Asociación a Carrera: usar require perezoso para evitar import cycles
setImmediate(() => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const Carrera = require('./Carrera').default;
    if (Carrera && typeof Carrera === 'function') {
      Area.hasMany(Carrera, { foreignKey: 'area_id', as: 'carreras' });
    }
  } catch (err) {
    // si falla, se ignora; asociación puede intentarse desde el otro lado
  }
});

export default Area;
