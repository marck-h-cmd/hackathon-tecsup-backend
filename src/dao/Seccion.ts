import { Op } from 'sequelize';
import { Seccion, Tema, Curso } from '../models';
import { ISeccionCreationAttributes, ISeccionUpdateData, ISeccionFilters } from '../interfaces/mysql/Seccion';
import { ApiResponse, PaginationParams, PaginatedResponse } from '../interfaces/shared/types';

export class SeccionDAO {
  
  // ============================================
  // CRUD BÁSICO
  // ============================================

  async createSeccion(seccionData: ISeccionCreationAttributes): Promise<ApiResponse<any>> {
    try {
      // Verificar que el curso existe
      const curso = await Curso.findByPk(seccionData.curso_id);
      if (!curso) {
        return {
          success: false,
          error: 'Curso no encontrado'
        };
      }

      // Si no se proporciona orden, asignar el siguiente
      if (!seccionData.orden) {
        const maxOrden = await Seccion.max('orden', {
          where: { curso_id: seccionData.curso_id }
        }) as number | null;
        seccionData.orden = (maxOrden ?? 0) + 1;
      }

      const seccion = await Seccion.create(seccionData);
      return {
        success: true,
        data: seccion.toJSON()
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error creando sección'
      };
    }
  }

  async getSeccionById(id: number): Promise<ApiResponse<any>> {
    try {
      const seccion = await Seccion.findByPk(id, {
        include: [{
          association: 'curso',
          attributes: ['id', 'codigo', 'nombre']
        }]
      });

      if (!seccion) {
        return {
          success: false,
          error: 'Sección no encontrada'
        };
      }

      return {
        success: true,
        data: seccion.toJSON()
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error obteniendo sección'
      };
    }
  }

  async getSeccionesByCurso(cursoId: number): Promise<ApiResponse<any[]>> {
    try {
      const secciones = await Seccion.findAll({
        where: { 
          curso_id: cursoId,
          activa: true
        },
        order: [['orden', 'ASC']]
      });

      return {
        success: true,
        data: secciones.map(s => s.toJSON())
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error obteniendo secciones'
      };
    }
  }

  async getAllSecciones(pagination: PaginationParams): Promise<ApiResponse<PaginatedResponse<any>>> {
    try {
      const { count, rows } = await Seccion.findAndCountAll({
        where: { activa: true },
        include: [{
          association: 'curso',
          attributes: ['id', 'codigo', 'nombre']
        }],
        limit: pagination.limit,
        offset: (pagination.page - 1) * pagination.limit,
        order: [['curso_id', 'ASC'], ['orden', 'ASC']]
      });

      return {
        success: true,
        data: {
          data: rows.map(s => s.toJSON()),
          total: count,
          page: pagination.page,
          limit: pagination.limit,
          totalPages: Math.ceil(count / pagination.limit)
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error obteniendo secciones'
      };
    }
  }

  async getSeccionesWithFilters(
    filters: ISeccionFilters,
    pagination: PaginationParams
  ): Promise<ApiResponse<PaginatedResponse<any>>> {
    try {
      const whereClause: any = {};
      
      if (filters.curso_id) {
        whereClause.curso_id = filters.curso_id;
      }
      if (filters.titulo) {
        whereClause.titulo = { [Op.like]: `%${filters.titulo}%` };
      }
      if (filters.activa !== undefined) {
        whereClause.activa = filters.activa;
      }

      const { count, rows } = await Seccion.findAndCountAll({
        where: whereClause,
        include: [{
          association: 'curso',
          attributes: ['id', 'codigo', 'nombre']
        }],
        limit: pagination.limit,
        offset: (pagination.page - 1) * pagination.limit,
        order: [['curso_id', 'ASC'], ['orden', 'ASC']]
      });

      return {
        success: true,
        data: {
          data: rows.map(s => s.toJSON()),
          total: count,
          page: pagination.page,
          limit: pagination.limit,
          totalPages: Math.ceil(count / pagination.limit)
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error obteniendo secciones'
      };
    }
  }

  async updateSeccion(id: number, updateData: ISeccionUpdateData): Promise<ApiResponse<any>> {
    try {
      const seccion = await Seccion.findByPk(id);
      if (!seccion) {
        return {
          success: false,
          error: 'Sección no encontrada'
        };
      }

      await seccion.update(updateData);
      return {
        success: true,
        data: seccion.toJSON()
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error actualizando sección'
      };
    }
  }

  async deleteSeccion(id: number): Promise<ApiResponse<boolean>> {
    try {
      const seccion = await Seccion.findByPk(id);
      if (!seccion) {
        return {
          success: false,
          error: 'Sección no encontrada'
        };
      }

      await seccion.destroy();
      return {
        success: true,
        data: true
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error eliminando sección'
      };
    }
  }

  async deactivateSeccion(id: number): Promise<ApiResponse<any>> {
    try {
      const seccion = await Seccion.findByPk(id);
      if (!seccion) {
        return {
          success: false,
          error: 'Sección no encontrada'
        };
      }

      await seccion.update({ activa: false });
      return {
        success: true,
        data: seccion.toJSON()
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desactivando sección'
      };
    }
  }

  // ============================================
  // CONSULTAS AVANZADAS
  // ============================================

  async getSeccionWithTemas(id: number): Promise<ApiResponse<any>> {
    try {
      const seccion = await Seccion.findByPk(id, {
        include: [
          {
            association: 'curso',
            attributes: ['id', 'codigo', 'nombre']
          },
          {
            association: 'temas',
            where: { activo: true },
            required: false,
            order: [['orden', 'ASC']]
          }
        ]
      });

      if (!seccion) {
        return {
          success: false,
          error: 'Sección no encontrada'
        };
      }

      return {
        success: true,
        data: seccion.toJSON()
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error obteniendo sección con temas'
      };
    }
  }

  async reordenarSecciones(cursoId: number, ordenNuevo: number[]): Promise<ApiResponse<any[]>> {
    try {
      // Verificar que todas las secciones pertenecen al curso
      const secciones = await Seccion.findAll({
        where: {
          id: { [Op.in]: ordenNuevo },
          curso_id: cursoId
        }
      });

      if (secciones.length !== ordenNuevo.length) {
        return {
          success: false,
          error: 'Algunas secciones no pertenecen al curso o no existen'
        };
      }

      // Actualizar el orden
      const promises = ordenNuevo.map((seccionId, index) => {
        return Seccion.update(
          { orden: index + 1 },
          { where: { id: seccionId } }
        );
      });

      await Promise.all(promises);

      // Obtener secciones actualizadas
      const seccionesActualizadas = await Seccion.findAll({
        where: { curso_id: cursoId },
        order: [['orden', 'ASC']]
      });

      return {
        success: true,
        data: seccionesActualizadas.map(s => s.toJSON())
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error reordenando secciones'
      };
    }
  }

  // ============================================
  // ESTADÍSTICAS
  // ============================================

  async getEstadisticasSeccion(id: number): Promise<ApiResponse<any>> {
    try {
      const seccion = await Seccion.findByPk(id);
      if (!seccion) {
        return {
          success: false,
          error: 'Sección no encontrada'
        };
      }

      const totalTemas = await Tema.count({
        where: { 
          seccion_id: id,
          activo: true
        }
      });

      const temas = await Tema.findAll({
        where: { 
          seccion_id: id,
          activo: true
        },
        attributes: ['duracion_estimada_minutos', 'puntos_requeridos']
      });

      const duracionTotalMinutos = temas.reduce((sum, t) => sum + t.duracion_estimada_minutos, 0);
      const puntosRequeridos = temas.reduce((sum, t) => sum + t.puntos_requeridos, 0);

      return {
        success: true,
        data: {
          seccion_id: id,
          titulo: seccion.titulo,
          curso_id: seccion.curso_id,
          total_temas: totalTemas,
          duracion_total_minutos: duracionTotalMinutos,
          puntos_requeridos_totales: puntosRequeridos,
          orden: seccion.orden,
          activa: seccion.activa
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error obteniendo estadísticas de la sección'
      };
    }
  }
}

export const seccionDAO = new SeccionDAO();