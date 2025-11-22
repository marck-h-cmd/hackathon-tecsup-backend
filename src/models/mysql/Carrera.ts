import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../config/database';
import { ICarreraAttributes, ICarreraCreationAttributes } from '../../interfaces/mysql/Carrera';

class Carrera extends Model<ICarreraAttributes, ICarreraCreationAttributes> implements ICarreraAttributes {
  public id!: number;
  public nombre!: string;
  public codigo?: string;
  public descripcion?: string;
  public activo!: boolean;
  public fecha_creacion!: Date;
  public area_id?: number;
}

Carrera.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nombre: { type: DataTypes.STRING(200), allowNull: false },
    codigo: { type: DataTypes.STRING(50), allowNull: true },
    descripcion: { type: DataTypes.TEXT, allowNull: true },
    activo: { type: DataTypes.BOOLEAN, defaultValue: true },
    area_id: { type: DataTypes.INTEGER, allowNull: true }, // <-- nuevo campo
    fecha_creacion: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  },
  {
    sequelize,
    tableName: 'carreras',
    timestamps: true,
    createdAt: 'fecha_creacion',
    updatedAt: false
  }
);

// Asociación a Area: usar require perezoso para evitar import cycles
setImmediate(() => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const Area = require('./Area').default;
    if (Area && typeof Area === 'function') {
      Carrera.belongsTo(Area, { foreignKey: 'area_id', as: 'area' });
    }
  } catch (err) {
    // ignore
  }
});

export default Carrera;
