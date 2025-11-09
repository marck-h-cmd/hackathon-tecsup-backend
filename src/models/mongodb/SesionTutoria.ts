import { Schema, model } from 'mongoose';
import { ISesionTutoria } from '../../interfaces/mongodb/SesionTutoria';

const MensajeSchema = new Schema({
  id: { type: String, required: true },
  rol: { type: String, enum: ['estudiante', 'sistema'], required: true },
  contenido: { type: String, required: true },
  timestamp: { type: Date, required: true },
  tipo: { type: String, enum: ['pregunta', 'respuesta', 'ejemplo'], required: true }
}, { _id: false });

const SesionTutoriaSchema = new Schema(
  {
    _id: { type: String, required: true },
    estudiante_id: { type: Number, required: true, index: true },
    curso_id: { type: Number, index: true },
    tema_id: { type: Number, index: true },
    mensajes: { type: [MensajeSchema], default: [] },
    duracion_minutos: { type: Number, default: 0 },
    fecha_inicio: { type: Date, required: true },
    fecha_fin: { type: Date, required: true }
  },
  {
    timestamps: true,
    collection: 'sesiones_tutoria'
  }
);

// Índices
SesionTutoriaSchema.index({ estudiante_id: 1, fecha_inicio: -1 });
SesionTutoriaSchema.index({ curso_id: 1 });
SesionTutoriaSchema.index({ tema_id: 1 });

export const SesionTutoria = model<ISesionTutoria>(
  'SesionTutoria', 
  SesionTutoriaSchema
);