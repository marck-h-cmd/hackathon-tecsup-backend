export interface ICarreraAttributes {
  id: number;
  nombre: string;
  codigo?: string;
  descripcion?: string;
  activo: boolean;
  fecha_creacion: Date;
  area_id?: number; // relación a Area
}

export interface ICarreraCreationAttributes extends Partial<Omit<ICarreraAttributes, 'id' | 'fecha_creacion'>> {}
