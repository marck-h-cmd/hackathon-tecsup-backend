export interface IAreaAttributes {
  id: number;
  nombre: string;
  codigo?: string;
  descripcion?: string;
  activo: boolean;
  fecha_creacion: Date;
}

export interface IAreaCreationAttributes extends Partial<Omit<IAreaAttributes, 'id' | 'fecha_creacion'>> {}
