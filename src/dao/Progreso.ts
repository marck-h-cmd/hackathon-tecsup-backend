import { Op } from 'sequelize';

import { TemaCompletado, SeccionCompletada, CursoCompletado,  Seccion, Curso, User ,Tema} from '../models/index';

import { 
  ITemaCompletadoCreationAttributes,
  ISeccionCompletadaCreationAttributes,
  ICursoCompletadoCreationAttributes
} from '../interfaces/mysql/Progreso';
import { ApiResponse } from '../interfaces/shared/types';

export class ProgresoDAO {
  
  // ============================================
  // TEMAS COMPLETADOS
  // ============================================

  async marcarTemaCompletado(data: ITemaCompletadoCreationAttributes): Promise<ApiResponse<any>> {
    try {
      // Verificar si ya existe
      const existente = await TemaCompletado.findOne({
        where: {
          usuario_id: data.usuario_id,
          tema_id: data.tema_id
        }
      });

      if (existente) {
        return {
          success: false,
          error: 'El tema ya ha sido completado anteriormente'
        };
      }

      const temaCompletado = await TemaCompletado.create(data);
      
      // Obtener información del tema
      const tema = await Tema.findByPk(data.tema_id);
      
      return {
        success: true,
        data: {
          ...temaCompletado.toJSON(),
          tema: tema?.toJSON()
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error marcando tema como completado'
      };
    }
  }

  async getTemasCompletadosByUsuario(usuarioId: number): Promise<ApiResponse<any[]>> {
    try {
      const temasCompletados = await TemaCompletado.findAll({
        where: { usuario_id: usuarioId },
        include: [{
          association: 'tema',
          attributes: ['id', 'titulo', 'seccion_id', 'tipo_contenido', 'duracion_estimada_minutos']
        }],
        order: [['fecha_completado', 'DESC']]
      });

      return {
        success: true,
        data: temasCompletados.map(tc => tc.toJSON())
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error obteniendo temas completados'
      };
    }
  }

  async verificarTemaCompletado(usuarioId: number, temaId: number): Promise<ApiResponse<boolean>> {
    try {
      const existe = await TemaCompletado.findOne({
        where: {
          usuario_id: usuarioId,
          tema_id: temaId
        }
      });

      return {
        success: true,
        data: existe !== null
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error verificando tema completado'
      };
    }
  }

  async eliminarTemaCompletado(usuarioId: number, temaId: number): Promise<ApiResponse<boolean>> {
    try {
      const deleted = await TemaCompletado.destroy({
        where: {
          usuario_id: usuarioId,
          tema_id: temaId
        }
      });

      if (deleted === 0) {
        return {
          success: false,
          error: 'Tema completado no encontrado'
        };
      }

      return {
        success: true,
        data: true
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error eliminando tema completado'
      };
    }
  }

  // ============================================
  // SECCIONES COMPLETADAS
  // ============================================

  async marcarSeccionCompletada(data: ISeccionCompletadaCreationAttributes): Promise<ApiResponse<any>> {
    try {
      // Verificar si ya existe
      const existente = await SeccionCompletada.findOne({
        where: {
          usuario_id: data.usuario_id,
          seccion_id: data.seccion_id
        }
      });

      if (existente) {
        // Actualizar si ya existe
        await existente.update(data);
        return {
          success: true,
          data: existente.toJSON()
        };
      }

      const seccionCompletada = await SeccionCompletada.create(data);
      
      return {
        success: true,
        data: seccionCompletada.toJSON()
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error marcando sección como completada'
      };
    }
  }

  async getSeccionesCompletadasByUsuario(usuarioId: number): Promise<ApiResponse<any[]>> {
    try {
      const seccionesCompletadas = await SeccionCompletada.findAll({
        where: { usuario_id: usuarioId },
        include: [{
          association: 'seccion',
          attributes: ['id', 'titulo', 'curso_id', 'orden', 'duracion_estimada_minutos']
        }],
        order: [['fecha_completado', 'DESC']]
      });

      return {
        success: true,
        data: seccionesCompletadas.map(sc => sc.toJSON())
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error obteniendo secciones completadas'
      };
    }
  }

  async calcularProgresoSeccion(usuarioId: number, seccionId: number): Promise<ApiResponse<any>> {
    try {
      // Obtener todos los temas de la sección
      const temasTotales = await Tema.count({
        where: { 
          seccion_id: seccionId,
          activo: true
        }
      });

      // Obtener temas completados
      const temasCompletados = await TemaCompletado.count({
        where: { usuario_id: usuarioId },
        include: [{
          model: Tema,
          as: 'tema',
          where: { seccion_id: seccionId },
          attributes: []
        }]
      });

      const porcentaje = temasTotales > 0 ? (temasCompletados / temasTotales) * 100 : 0;

      return {
        success: true,
        data: {
          seccion_id: seccionId,
          temas_totales: temasTotales,
          temas_completados: temasCompletados,
          porcentaje_completado: Math.round(porcentaje * 100) / 100
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error calculando progreso de sección'
      };
    }
  }

  async actualizarProgresoSeccion(usuarioId: number, seccionId: number): Promise<ApiResponse<any>> {
    try {
      const progresoResult = await this.calcularProgresoSeccion(usuarioId, seccionId);
      
      if (!progresoResult.success || !progresoResult.data) {
        return progresoResult;
      }

      const progreso = progresoResult.data;

      // Si está al 100%, marcar como completada
      if (progreso.porcentaje_completado === 100) {
        // Calcular tiempo y puntos totales
        const temasCompletados = await TemaCompletado.findAll({
          where: { usuario_id: usuarioId },
          include: [{
            model: Tema,
            as: 'tema',
            where: { seccion_id: seccionId },
            attributes: ['id']
          }]
        });

        const tiempoTotal = temasCompletados.reduce((sum, tc) => sum + (tc.tiempo_dedicado_minutos || 0), 0);
        const puntosTotal = temasCompletados.reduce((sum, tc) => sum + tc.puntos_obtenidos, 0);

        await this.marcarSeccionCompletada({
          usuario_id: usuarioId,
          seccion_id: seccionId,
          tiempo_total_minutos: tiempoTotal,
          puntos_totales: puntosTotal,
          porcentaje_completado: 100
        });
      }

      return {
        success: true,
        data: progreso
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error actualizando progreso de sección'
      };
    }
  }

  // ============================================
  // CURSOS COMPLETADOS (INSCRIPCIONES)
  // ============================================

  async inscribirEnCurso(usuarioId: number, cursoId: number): Promise<ApiResponse<any>> {
    try {
      // Verificar si ya está inscrito
      const existente = await CursoCompletado.findOne({
        where: {
          usuario_id: usuarioId,
          curso_id: cursoId
        }
      });

      if (existente) {
        return {
          success: false,
          error: 'El usuario ya está inscrito en este curso'
        };
      }

      const inscripcion = await CursoCompletado.create({
        usuario_id: usuarioId,
        curso_id: cursoId,
        porcentaje_completado: 0,
        puntos_totales: 0,
        certificado_emitido: false
      });

      return {
        success: true,
        data: inscripcion.toJSON()
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error inscribiendo en curso'
      };
    }
  }

  async getCursosDelUsuario(usuarioId: number): Promise<ApiResponse<any[]>> {
    try {
      const cursos = await CursoCompletado.findAll({
        where: { usuario_id: usuarioId },
        include: [{
          association: 'curso',
          attributes: ['id', 'codigo', 'nombre', 'descripcion', 'imagen_url', 'color_hex']
        }],
        order: [['fecha_inicio', 'DESC']]
      });

      return {
        success: true,
        data: cursos.map(c => c.toJSON())
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error obteniendo cursos del usuario'
      };
    }
  }

  async calcularProgresoCurso(usuarioId: number, cursoId: number): Promise<ApiResponse<any>> {
    try {
      // Obtener todas las secciones del curso
      const seccionesTotales = await Seccion.count({
        where: { 
          curso_id: cursoId,
          activa: true
        }
      });

      // Obtener secciones completadas
      const seccionesCompletadas = await SeccionCompletada.count({
        where: { 
          usuario_id: usuarioId,
          porcentaje_completado: 100
        },
        include: [{
          model: Seccion,
          as: 'seccion',
          where: { curso_id: cursoId },
          attributes: []
        }]
      });

      const porcentaje = seccionesTotales > 0 ? (seccionesCompletadas / seccionesTotales) * 100 : 0;

      return {
        success: true,
        data: {
          curso_id: cursoId,
          secciones_totales: seccionesTotales,
          secciones_completadas: seccionesCompletadas,
          porcentaje_completado: Math.round(porcentaje * 100) / 100
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error calculando progreso del curso'
      };
    }
  }

  async actualizarProgresoCurso(usuarioId: number, cursoId: number): Promise<ApiResponse<any>> {
    try {
      const progresoResult = await this.calcularProgresoCurso(usuarioId, cursoId);
      
      if (!progresoResult.success || !progresoResult.data) {
        return progresoResult;
      }

      const progreso = progresoResult.data;

      // Actualizar registro de curso completado
      const cursoCompletado = await CursoCompletado.findOne({
        where: {
          usuario_id: usuarioId,
          curso_id: cursoId
        }
      });

      if (!cursoCompletado) {
        return {
          success: false,
          error: 'No se encontró la inscripción del curso'
        };
      }

      // Calcular puntos totales
      const seccionesCompletadas = await SeccionCompletada.findAll({
        where: { usuario_id: usuarioId },
        include: [{
          model: Seccion,
          as: 'seccion',
          where: { curso_id: cursoId },
          attributes: ['id']
        }]
      });

      const puntosTotal = seccionesCompletadas.reduce((sum, sc) => sum + sc.puntos_totales, 0);
      const tiempoTotal = seccionesCompletadas.reduce((sum, sc) => sum + (sc.tiempo_total_minutos || 0), 0) / 60;

      const updateData: any = {
        porcentaje_completado: progreso.porcentaje_completado,
        puntos_totales: puntosTotal,
        tiempo_total_horas: tiempoTotal
      };

      // Si completó al 100%, marcar fecha de completado
      if (progreso.porcentaje_completado === 100 && !cursoCompletado.fecha_completado) {
        updateData.fecha_completado = new Date();
      }

      await cursoCompletado.update(updateData);

      return {
        success: true,
        data: {
          ...progreso,
          puntos_totales: puntosTotal,
          tiempo_total_horas: tiempoTotal,
          completado: progreso.porcentaje_completado === 100
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error actualizando progreso del curso'
      };
    }
  }

  async emitirCertificado(usuarioId: number, cursoId: number): Promise<ApiResponse<any>> {
    try {
      const cursoCompletado = await CursoCompletado.findOne({
        where: {
          usuario_id: usuarioId,
          curso_id: cursoId,
          porcentaje_completado: 100
        }
      });

      if (!cursoCompletado) {
        return {
          success: false,
          error: 'El curso no está completado al 100%'
        };
      }

      if (cursoCompletado.certificado_emitido) {
        return {
          success: false,
          error: 'El certificado ya ha sido emitido'
        };
      }

      await cursoCompletado.update({
        certificado_emitido: true
      });

      return {
        success: true,
        data: {
          certificado_emitido: true,
          fecha_emision: new Date()
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error emitiendo certificado'
      };
    }
  }

  // ============================================
  // ESTADÍSTICAS DE PROGRESO
  // ============================================

  async getEstadisticasProgreso(usuarioId: number): Promise<ApiResponse<any>> {
    try {
      const [
        totalTemasCompletados,
        totalSeccionesCompletadas,
        totalCursosInscritos,
        totalCursosCompletados,
        totalPuntos
      ] = await Promise.all([
        TemaCompletado.count({ where: { usuario_id: usuarioId } }),
        SeccionCompletada.count({ where: { usuario_id: usuarioId, porcentaje_completado: 100 } }),
        CursoCompletado.count({ where: { usuario_id: usuarioId } }),
        CursoCompletado.count({ where: { usuario_id: usuarioId, porcentaje_completado: 100 } }),
        TemaCompletado.sum('puntos_obtenidos', { where: { usuario_id: usuarioId } })
      ]);

      const tiempoTotal = await TemaCompletado.sum('tiempo_dedicado_minutos', { 
        where: { usuario_id: usuarioId } 
      });

      return {
        success: true,
        data: {
          temas_completados: totalTemasCompletados,
          secciones_completadas: totalSeccionesCompletadas,
          cursos_inscritos: totalCursosInscritos,
          cursos_completados: totalCursosCompletados,
          puntos_totales: totalPuntos || 0,
          tiempo_total_horas: Math.round((tiempoTotal || 0) / 60 * 100) / 100,
          tasa_completacion: totalCursosInscritos > 0 
            ? Math.round((totalCursosCompletados / totalCursosInscritos) * 100) 
            : 0
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error obteniendo estadísticas de progreso'
      };
    }
  }

  async getProgresoPorCurso(usuarioId: number, cursoId: number): Promise<ApiResponse<any>> {
    try {
      const curso = await Curso.findByPk(cursoId, {
        include: [{
          model: Seccion,
          as: 'secciones',
          where: { activa: true },
          required: false,
          include: [{
            model: Tema,
            as: 'temas',
            where: { activo: true },
            required: false
          }]
        }]
      });

      if (!curso) {
        return {
          success: false,
          error: 'Curso no encontrado'
        };
      }

      const cursoData = curso.toJSON() as any;
      
      // Calcular progreso por sección
      const seccionesConProgreso = await Promise.all(
        (cursoData.secciones || []).map(async (seccion: any) => {
          const progreso = await this.calcularProgresoSeccion(usuarioId, seccion.id);
          return {
            ...seccion,
            progreso: progreso.data
          };
        })
      );

      const progresoGeneral = await this.calcularProgresoCurso(usuarioId, cursoId);

      return {
        success: true,
        data: {
          curso: {
            id: curso.id,
            nombre: curso.nombre,
            codigo: curso.codigo
          },
          progreso_general: progresoGeneral.data,
          secciones: seccionesConProgreso
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error obteniendo progreso del curso'
      };
    }
  }
}

export const progresoDAO = new ProgresoDAO();