export interface IMensajeTutoria {
    id: string;
    rol: 'estudiante' | 'sistema';
    contenido: string;
    timestamp: Date;
    tipo: 'pregunta' | 'respuesta' | 'ejemplo';
  }
  
  export interface ISesionTutoria {
    _id: string;
    estudiante_id: number;
    curso_id?: number;
    tema_id?: number;
    mensajes: IMensajeTutoria[];
    duracion_minutos: number;
    fecha_inicio: Date;
    fecha_fin: Date;
    createdAt: Date;
    updatedAt: Date;
  }