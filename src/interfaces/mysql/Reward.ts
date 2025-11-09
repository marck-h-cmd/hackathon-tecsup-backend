import { Optional } from "sequelize";
import { TipoReward } from "../shared/enums";
import { CategoriaReward } from "../shared/enums";
export interface IRewardAttributes {
    id: number;
    estudiante_id: number;
    tipo: TipoReward;
    nombre: string;
    descripcion: string;
    icono: string;
    puntos: number;
    categoria: CategoriaReward;
    fecha_obtencion: Date;
  }
  
  export interface IRewardCreationAttributes 
    extends Optional<IRewardAttributes, 'id'> {}