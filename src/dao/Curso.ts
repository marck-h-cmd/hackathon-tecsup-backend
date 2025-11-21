import { Op } from 'sequelize';
import { Curso, Seccion, Tema } from '../models';
import { ICursoCreationAttributes, ICursoUpdateData, ICursoFilters } from '../interfaces/mysql/Curso';
import { ApiResponse, PaginationParams, PaginatedResponse } from '../interfaces/shared/types';

export class CursoDAO {
  
  // ============================================
  // CRUD BÁSICO
  // ============================================

  async createCurso(cursoData: ICursoCreationAttributes): Promise<ApiResponse<any>> {
    try {
      // Verificar si el código ya existe
      const existingCurso = await Curso.findOne({ where: { codigo: cursoData.codigo } });
      if (existingCurso) {
        return {
          success: false,
          error: 'El código del curso ya existe'
        };
      }

      const curso = await Curso.create(cursoData);
      return {
        success: true,
        data: curso.toJSON()
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error creando curso'
      };
    }
  }

  async getCursoById(id: number): Promise<ApiResponse<any>> {
    try {
      const curso = await Curso.findByPk(id);
      if (!curso) {
        return {
          success: false,
          error: 'Curso no encontrado'
        };
      }
      return {
        success: true,
        data: curso.toJSON()
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error obteniendo curso'
      };
    }
  }

  async getCursoByCodigo(codigo: string): Promise<ApiResponse<any>> {
    try {
      const curso = await Curso.findOne({ where: { codigo } });
      if (!curso) {
        return {
          success: false,
          error: 'Curso no encontrado'
        };
      }
      return {
        success: true,
        data: curso.toJSON()
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error obteniendo curso'
      };
    }
  }

  async getAllCursos(pagination: PaginationParams): Promise<ApiResponse<PaginatedResponse<any>>> {
    try {
      const { count, rows } = await Curso.findAndCountAll({
        where: { activo: true },
        limit: pagination.limit,
        offset: (pagination.page - 1) * pagination.limit,
        order: [['fecha_creacion', 'DESC']]
      });

      return {
        success: true,
        data: {
          data: rows.map(curso => curso.toJSON()),
          total: count,
          page: pagination.page,
          limit: pagination.limit,
          totalPages: Math.ceil(count / pagination.limit)
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error obteniendo cursos'
      };
    }
  }

  async getCursosWithFilters(
    filters: ICursoFilters,
    pagination: PaginationParams
  ): Promise<ApiResponse<PaginatedResponse<any>>> {
    try {
      const whereClause: any = {};
      
      if (filters.nombre) {
        whereClause.nombre = { [Op.like]: `%${filters.nombre}%` };
      }
      if (filters.codigo) {
        whereClause.codigo = { [Op.like]: `%${filters.codigo}%` };
      }
      if (filters.es_publico !== undefined) {
        whereClause.es_publico = filters.es_publico;
      }
      if (filters.activo !== undefined) {
        whereClause.activo = filters.activo;
      }

      const { count, rows } = await Curso.findAndCountAll({
        where: whereClause,
        limit: pagination.limit,
        offset: (pagination.page - 1) * pagination.limit,
        order: [['nombre', 'ASC']]
      });

      return {
        success: true,
        data: {
          data: rows.map(curso => curso.toJSON()),
          total: count,
          page: pagination.page,
          limit: pagination.limit,
          totalPages: Math.ceil(count / pagination.limit)
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error obteniendo cursos'
      };
    }
  }

  async updateCurso(id: number, updateData: ICursoUpdateData): Promise<ApiResponse<any>> {
    try {
      const curso = await Curso.findByPk(id);
      if (!curso) {
        return {
          success: false,
          error: 'Curso no encontrado'
        };
      }

      // Si se actualiza el código, verificar que no exista
      if (updateData.codigo && updateData.codigo !== curso.codigo) {
        const existingCurso = await Curso.findOne({ where: { codigo: updateData.codigo } });
        if (existingCurso) {
          return {
            success: false,
            error: 'El código del curso ya existe'
          };
        }
      }

      await curso.update(updateData);
      return {
        success: true,
        data: curso.toJSON()
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error actualizando curso'
      };
    }
  }

  async deleteCurso(id: number): Promise<ApiResponse<boolean>> {
    try {
      const curso = await Curso.findByPk(id);
      if (!curso) {
        return {
          success: false,
          error: 'Curso no encontrado'
        };
      }

      await curso.destroy();
      return {
        success: true,
        data: true
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error eliminando curso'
      };
    }
  }

  async deactivateCurso(id: number): Promise<ApiResponse<any>> {
    try {
      const curso = await Curso.findByPk(id);
      if (!curso) {
        return {
          success: false,
          error: 'Curso no encontrado'
        };
      }

      await curso.update({ activo: false });
      return {
        success: true,
        data: curso.toJSON()
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desactivando curso'
      };
    }
  }

  // ============================================
  // CONSULTAS AVANZADAS
  // ============================================

  async getCursoWithSecciones(id: number): Promise<ApiResponse<any>> {
    try {
      const curso = await Curso.findByPk(id, {
        include: [{
          association: 'secciones',
          where: { activa: true },
          required: false,
          order: [['orden', 'ASC']]
        }]
      });

      if (!curso) {
        return {
          success: false,
          error: 'Curso no encontrado'
        };
      }

      return {
        success: true,
        data: curso.toJSON()
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error obteniendo curso con secciones'
      };
    }
  }

  async getCursoCompleto(id: number): Promise<ApiResponse<any>> {
    try {
      const curso = await Curso.findByPk(id, {
        include: [{
          association: 'secciones',
          where: { activa: true },
          required: false,
          include: [{
            association: 'temas',
            where: { activo: true },
            required: false,
            order: [['orden', 'ASC']]
          }],
          order: [['orden', 'ASC']]
        }]
      });

      if (!curso) {
        return {
          success: false,
          error: 'Curso no encontrado'
        };
      }

      return {
        success: true,
        data: curso.toJSON()
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error obteniendo curso completo'
      };
    }
  }

  async getCursosPublicos(pagination: PaginationParams): Promise<ApiResponse<PaginatedResponse<any>>> {
    try {
      const { count, rows } = await Curso.findAndCountAll({
        where: { 
          es_publico: true,
          activo: true
        },
        limit: pagination.limit,
        offset: (pagination.page - 1) * pagination.limit,
        order: [['nombre', 'ASC']]
      });

      return {
        success: true,
        data: {
          data: rows.map(curso => curso.toJSON()),
          total: count,
          page: pagination.page,
          limit: pagination.limit,
          totalPages: Math.ceil(count / pagination.limit)
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error obteniendo cursos públicos'
      };
    }
  }

  // ============================================
  // ESTADÍSTICAS
  // ============================================

  async getEstadisticasCurso(id: number): Promise<ApiResponse<any>> {
    try {
      const curso = await Curso.findByPk(id);
      if (!curso) {
        return {
          success: false,
          error: 'Curso no encontrado'
        };
      }

      const [totalSecciones, totalTemas] = await Promise.all([
        Seccion.count({ where: { curso_id: id, activa: true } }),
        Tema.count({
          include: [{
            model: Seccion,
            as: 'seccion',
            where: { curso_id: id },
            attributes: []
          }],
          where: { activo: true }
        })
      ]);

      // Calcular duración total estimada
      const secciones = await Seccion.findAll({
        where: { curso_id: id, activa: true },
        attributes: ['duracion_estimada_minutos']
      });

      const duracionTotalMinutos = secciones.reduce((sum, s) => sum + s.duracion_estimada_minutos, 0);
      const duracionTotalHoras = Math.round(duracionTotalMinutos / 60 * 100) / 100;

      return {
        success: true,
        data: {
          curso_id: id,
          nombre: curso.nombre,
          codigo: curso.codigo,
          total_secciones: totalSecciones,
          total_temas: totalTemas,
          duracion_estimada_horas: duracionTotalHoras,
          es_publico: curso.es_publico,
          activo: curso.activo
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error obteniendo estadísticas del curso'
      };
    }
  }

  async getEstadisticasGenerales(): Promise<ApiResponse<any>> {
    try {
      const [totalCursos, cursosActivos, cursosPublicos, totalSecciones, totalTemas] = await Promise.all([
        Curso.count(),
        Curso.count({ where: { activo: true } }),
        Curso.count({ where: { es_publico: true, activo: true } }),
        Seccion.count({ where: { activa: true } }),
        Tema.count({ where: { activo: true } })
      ]);

      return {
        success: true,
        data: {
          total_cursos: totalCursos,
          cursos_activos: cursosActivos,
          cursos_publicos: cursosPublicos,
          total_secciones: totalSecciones,
          total_temas: totalTemas,
          promedio_secciones_por_curso: cursosActivos > 0 
            ? Math.round((totalSecciones / cursosActivos) * 100) / 100 
            : 0,
          promedio_temas_por_curso: cursosActivos > 0 
            ? Math.round((totalTemas / cursosActivos) * 100) / 100 
            : 0
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error obteniendo estadísticas generales'
      };
    }
  }
}

export const cursoDAO = new CursoDAO();