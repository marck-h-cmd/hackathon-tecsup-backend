import { Op } from 'sequelize';
import { Ejercicio, Tema } from '../models/index';
import { IEjercicioCreationAttributes, IEjercicioUpdateData, IEjercicioFilters } from '../interfaces/mysql/Ejercicio';
import { ApiResponse, PaginationParams, PaginatedResponse } from '../interfaces/shared/types';

export class EjercicioDAO {
  
  // ============================================
  // CRUD BÁSICO
  // ============================================

  async createEjercicio(ejercicioData: IEjercicioCreationAttributes): Promise<ApiResponse<any>> {
    try {
      // Verificar que el tema existe
      const tema = await Tema.findByPk(ejercicioData.tema_id);
      if (!tema) {
        return {
          success: false,
          error: 'Tema no encontrado'
        };
      }

      // Si no se proporciona orden, asignar el siguiente
      if (!ejercicioData.orden) {
        const maxOrden = await Ejercicio.max('orden', {
          where: { tema_id: ejercicioData.tema_id }
        });
        ejercicioData.orden = (maxOrden || 0) + 1;
      }

      const ejercicio = await Ejercicio.create(ejercicioData);
      return {
        success: true,
        data: ejercicio.toJSON()
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error creando ejercicio'
      };
    }
  }

  async getEjercicioById(id: number): Promise<ApiResponse<any>> {
    try {
      const ejercicio = await Ejercicio.findByPk(id, {
        include: [{
          association: 'tema',
          attributes: ['id', 'titulo', 'seccion_id']
        }]
      });

      if (!ejercicio) {
        return {
          success: false,
          error: 'Ejercicio no encontrado'
        };
      }

      return {
        success: true,
        data: ejercicio.toJSON()
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error obteniendo ejercicio'
      };
    }
  }

  async getEjerciciosByTema(temaId: number): Promise<ApiResponse<any[]>> {
    try {
      const ejercicios = await Ejercicio.findAll({
        where: { 
          tema_id: temaId,
          activo: true
        },
        order: [['orden', 'ASC']]
      });

      return {
        success: true,
        data: ejercicios.map(e => e.toJSON())
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error obteniendo ejercicios'
      };
    }
  }

  async getAllEjercicios(pagination: PaginationParams): Promise<ApiResponse<PaginatedResponse<any>>> {
    try {
      const { count, rows } = await Ejercicio.findAndCountAll({
        where: { activo: true },
        include: [{
          association: 'tema',
          attributes: ['id', 'titulo', 'seccion_id']
        }],
        limit: pagination.limit,
        offset: (pagination.page - 1) * pagination.limit,
        order: [['tema_id', 'ASC'], ['orden', 'ASC']]
      });

      return {
        success: true,
        data: {
          data: rows.map(e => e.toJSON()),
          total: count,
          page: pagination.page,
          limit: pagination.limit,
          totalPages: Math.ceil(count / pagination.limit)
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error obteniendo ejercicios'
      };
    }
  }

  async getEjerciciosWithFilters(
    filters: IEjercicioFilters,
    pagination: PaginationParams
  ): Promise<ApiResponse<PaginatedResponse<any>>> {
    try {
      const whereClause: any = {};
      
      if (filters.tema_id) {
        whereClause.tema_id = filters.tema_id;
      }
      if (filters.titulo) {
        whereClause.titulo = { [Op.like]: `%${filters.titulo}%` };
      }
      if (filters.tipo) {
        whereClause.tipo = filters.tipo;
      }
      if (filters.activo !== undefined) {
        whereClause.activo = filters.activo;
      }

      const { count, rows } = await Ejercicio.findAndCountAll({
        where: whereClause,
        include: [{
          association: 'tema',
          attributes: ['id', 'titulo', 'seccion_id']
        }],
        limit: pagination.limit,
        offset: (pagination.page - 1) * pagination.limit,
        order: [['tema_id', 'ASC'], ['orden', 'ASC']]
      });

      return {
        success: true,
        data: {
          data: rows.map(e => e.toJSON()),
          total: count,
          page: pagination.page,
          limit: pagination.limit,
          totalPages: Math.ceil(count / pagination.limit)
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error obteniendo ejercicios'
      };
    }
  }

  async updateEjercicio(id: number, updateData: IEjercicioUpdateData): Promise<ApiResponse<any>> {
    try {
      const ejercicio = await Ejercicio.findByPk(id);
      if (!ejercicio) {
        return {
          success: false,
          error: 'Ejercicio no encontrado'
        };
      }

      await ejercicio.update(updateData);
      return {
        success: true,
        data: ejercicio.toJSON()
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error actualizando ejercicio'
      };
    }
  }

  async deleteEjercicio(id: number): Promise<ApiResponse<boolean>> {
    try {
      const ejercicio = await Ejercicio.findByPk(id);
      if (!ejercicio) {
        return {
          success: false,
          error: 'Ejercicio no encontrado'
        };
      }

      await ejercicio.destroy();
      return {
        success: true,
        data: true
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error eliminando ejercicio'
      };
    }
  }

  async deactivateEjercicio(id: number): Promise<ApiResponse<any>> {
    try {
      const ejercicio = await Ejercicio.findByPk(id);
      if (!ejercicio) {
        return {
          success: false,
          error: 'Ejercicio no encontrado'
        };
      }

      await ejercicio.update({ activo: false });
      return {
        success: true,
        data: ejercicio.toJSON()
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desactivando ejercicio'
      };
    }
  }

  // ============================================
  // CONSULTAS AVANZADAS
  // ============================================

  async getEjerciciosByTipo(tipo: string): Promise<ApiResponse<any[]>> {
    try {
      const ejercicios = await Ejercicio.findAll({
        where: { 
          tipo: tipo,
          activo: true
        },
        include: [{
          association: 'tema',
          attributes: ['id', 'titulo', 'seccion_id']
        }],
        order: [['tema_id', 'ASC'], ['orden', 'ASC']]
      });

      return {
        success: true,
        data: ejercicios.map(e => e.toJSON())
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error obteniendo ejercicios por tipo'
      };
    }
  }

  async reordenarEjercicios(temaId: number, ordenNuevo: number[]): Promise<ApiResponse<any[]>> {
    try {
      // Verificar que todos los ejercicios pertenecen al tema
      const ejercicios = await Ejercicio.findAll({
        where: {
          id: { [Op.in]: ordenNuevo },
          tema_id: temaId
        }
      });

      if (ejercicios.length !== ordenNuevo.length) {
        return {
          success: false,
          error: 'Algunos ejercicios no pertenecen al tema o no existen'
        };
      }

      // Actualizar el orden
      const promises = ordenNuevo.map((ejercicioId, index) => {
        return Ejercicio.update(
          { orden: index + 1 },
          { where: { id: ejercicioId } }
        );
      });

      await Promise.all(promises);

      // Obtener ejercicios actualizados
      const ejerciciosActualizados = await Ejercicio.findAll({
        where: { tema_id: temaId },
        order: [['orden', 'ASC']]
      });

      return {
        success: true,
        data: ejerciciosActualizados.map(e => e.toJSON())
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error reordenando ejercicios'
      };
    }
  }

  async duplicarEjercicio(id: number, nuevoTemaId?: number): Promise<ApiResponse<any>> {
    try {
      const ejercicioOriginal = await Ejercicio.findByPk(id);
      if (!ejercicioOriginal) {
        return {
          success: false,
          error: 'Ejercicio no encontrado'
        };
      }

      const temaId = nuevoTemaId || ejercicioOriginal.tema_id;

      // Verificar que el nuevo tema existe
      const tema = await Tema.findByPk(temaId);
      if (!tema) {
        return {
          success: false,
          error: 'Tema destino no encontrado'
        };
      }

      // Obtener el siguiente orden
      const maxOrden = await Ejercicio.max('orden', {
        where: { tema_id: temaId }
      });

      const ejercicioDuplicado = await Ejercicio.create({
        tema_id: temaId,
        titulo: `${ejercicioOriginal.titulo} (Copia)`,
        enunciado: ejercicioOriginal.enunciado,
        tipo: ejercicioOriginal.tipo,
        opciones: ejercicioOriginal.opciones,
        respuesta_correcta: ejercicioOriginal.respuesta_correcta,
        explicacion: ejercicioOriginal.explicacion,
        puntos: ejercicioOriginal.puntos,
        orden: (maxOrden || 0) + 1,
        activo: true
      });

      return {
        success: true,
        data: ejercicioDuplicado.toJSON()
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error duplicando ejercicio'
      };
    }
  }

  async verificarRespuesta(id: number, respuestaUsuario: string): Promise<ApiResponse<any>> {
    try {
      const ejercicio = await Ejercicio.findByPk(id);
      if (!ejercicio) {
        return {
          success: false,
          error: 'Ejercicio no encontrado'
        };
      }

      const esCorrecto = ejercicio.respuesta_correcta.trim().toLowerCase() === respuestaUsuario.trim().toLowerCase();

      return {
        success: true,
        data: {
          correcto: esCorrecto,
          puntos_obtenidos: esCorrecto ? ejercicio.puntos : 0,
          explicacion: ejercicio.explicacion,
          respuesta_correcta: esCorrecto ? undefined : ejercicio.respuesta_correcta // Solo mostrar si es incorrecto
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error verificando respuesta'
      };
    }
  }

  // ============================================
  // ESTADÍSTICAS
  // ============================================

  async getEstadisticasEjercicio(id: number): Promise<ApiResponse<any>> {
    try {
      const ejercicio = await Ejercicio.findByPk(id, {
        include: [{
          association: 'tema',
          attributes: ['id', 'titulo', 'seccion_id']
        }]
      });

      if (!ejercicio) {
        return {
          success: false,
          error: 'Ejercicio no encontrado'
        };
      }

      return {
        success: true,
        data: {
          ejercicio_id: id,
          titulo: ejercicio.titulo,
          tema_id: ejercicio.tema_id,
          tipo: ejercicio.tipo,
          puntos: ejercicio.puntos,
          orden: ejercicio.orden,
          activo: ejercicio.activo
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error obteniendo estadísticas del ejercicio'
      };
    }
  }

  async getEstadisticasPorTipo(): Promise<ApiResponse<any>> {
    try {
      const estadisticas = await Ejercicio.findAll({
        attributes: [
          'tipo',
          [Ejercicio.sequelize!.fn('COUNT', Ejercicio.sequelize!.col('id')), 'total'],
          [Ejercicio.sequelize!.fn('AVG', Ejercicio.sequelize!.col('puntos')), 'puntos_promedio'],
          [Ejercicio.sequelize!.fn('SUM', Ejercicio.sequelize!.col('puntos')), 'puntos_totales']
        ],
        where: { activo: true },
        group: ['tipo'],
        raw: true
      });

      return {
        success: true,
        data: estadisticas
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error obteniendo estadísticas por tipo'
      };
    }
  }
}

export const ejercicioDAO = new EjercicioDAO();