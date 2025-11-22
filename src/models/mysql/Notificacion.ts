import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../config/database';
import { INotificacionAttributes, INotificacionCreationAttributes } from '../../interfaces/mysql/Notificacion';

class Notificacion extends Model<INotificacionAttributes, INotificacionCreationAttributes>
    implements INotificacionAttributes {

    public id!: number;
    public tipo!: INotificacionAttributes['tipo'];
    public titulo!: string;
    public descripcion!: string;
    public usuario_id!: number;
    public fecha_vencimiento?: Date | null;
    public horario_inicio?: Date | null;
    public horario_fin?: Date | null;
    public leida!: boolean;
    public prioridad?: INotificacionAttributes['prioridad'];
    public recomendaciones_estudio?: any;
    public metadata?: any;
    public activo!: boolean;
    public fecha_creacion!: Date;
}

Notificacion.init(
    {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        tipo: { type: DataTypes.ENUM('tarea', 'vencimiento', 'horario', 'recomendacion', 'general'), allowNull: false, defaultValue: 'general' },
        titulo: { type: DataTypes.STRING(255), allowNull: false },
        descripcion: { type: DataTypes.TEXT, allowNull: false },
        usuario_id: { type: DataTypes.INTEGER, allowNull: false },
        fecha_vencimiento: { type: DataTypes.DATE, allowNull: true },
        horario_inicio: { type: DataTypes.DATE, allowNull: true },
        horario_fin: { type: DataTypes.DATE, allowNull: true },
        leida: { type: DataTypes.BOOLEAN, defaultValue: false },
        prioridad: { type: DataTypes.ENUM('baja', 'media', 'alta'), defaultValue: 'media' },
        recomendaciones_estudio: { type: DataTypes.JSON, allowNull: true },
        metadata: { type: DataTypes.JSON, allowNull: true },
        activo: { type: DataTypes.BOOLEAN, defaultValue: true },
        fecha_creacion: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
    },
    {
        sequelize,
        tableName: 'notificaciones',
        timestamps: true,
        createdAt: 'fecha_creacion',
        updatedAt: false
    }
);

export default Notificacion;
