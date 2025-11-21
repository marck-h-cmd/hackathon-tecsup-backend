import { Op } from 'sequelize';
import { Tema, Seccion, Curso } from '../models';
import { ITemaCreationAttributes, ITemaUpdateData, ITemaFilters } from '../interfaces/mysql/Tema';
import { ApiResponse, PaginationParams, PaginatedResponse } from '../interfaces/shared/types';

export class TemaDAO {

    // ============================================
    // CRUD BÁSICO
    // ============================================

    async createTema(temaData: ITemaCreationAttributes): Promise<ApiResponse<any>> {
        try {
            // Verificar que la sección existe
            const seccion = await Seccion.findByPk(temaData.seccion_id);
            if (!seccion) {
                return {
                    success: false,
                    error: 'Sección no encontrada'
                };
            }

            // Si no se proporciona orden, asignar el siguiente
            if (!temaData.orden) {
                const maxOrden = await Tema.max('orden', {
                    where: { seccion_id: temaData.seccion_id }
                });
                temaData.orden = (Number(maxOrden) || 0) + 1;
            }

            const tema = await Tema.create(temaData);
            return {
                success: true,
                data: tema.toJSON()
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Error creando tema'
            };
        }
    }

    async getTemaById(id: number): Promise<ApiResponse<any>> {
        try {
            const tema = await Tema.findByPk(id, {
                include: [{
                    association: 'seccion',
                    attributes: ['id', 'titulo', 'curso_id'],
                    include: [{
                        association: 'curso',
                        attributes: ['id', 'codigo', 'nombre']
                    }]
                }]
            });

            if (!tema) {
                return {
                    success: false,
                    error: 'Tema no encontrado'
                };
            }

            return {
                success: true,
                data: tema.toJSON()
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Error obteniendo tema'
            };
        }
    }

    async getTemasBySeccion(seccionId: number): Promise<ApiResponse<any[]>> {
        try {
            const temas = await Tema.findAll({
                where: {
                    seccion_id: seccionId,
                    activo: true
                },
                order: [['orden', 'ASC']]
            });

            return {
                success: true,
                data: temas.map(t => t.toJSON())
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Error obteniendo temas'
            };
        }
    }

    async getTemasByCurso(cursoId: number): Promise<ApiResponse<any[]>> {
        try {
            const temas = await Tema.findAll({
                include: [{
                    association: 'seccion',
                    where: { curso_id: cursoId },
                    attributes: ['id', 'titulo', 'orden']
                }],
                where: { activo: true },
                order: [
                    [{ model: Seccion, as: 'seccion' }, 'orden', 'ASC'],
                    ['orden', 'ASC']
                ]
            });

            return {
                success: true,
                data: temas.map(t => t.toJSON())
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Error obteniendo temas del curso'
            };
        }
    }

    async getAllTemas(pagination: PaginationParams): Promise<ApiResponse<PaginatedResponse<any>>> {
        try {
            const { count, rows } = await Tema.findAndCountAll({
                where: { activo: true },
                include: [{
                    association: 'seccion',
                    attributes: ['id', 'titulo', 'curso_id']
                }],
                limit: pagination.limit,
                offset: (pagination.page - 1) * pagination.limit,
                order: [['seccion_id', 'ASC'], ['orden', 'ASC']]
            });

            return {
                success: true,
                data: {
                    data: rows.map(t => t.toJSON()),
                    total: count,
                    page: pagination.page,
                    limit: pagination.limit,
                    totalPages: Math.ceil(count / pagination.limit)
                }
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Error obteniendo temas'
            };
        }
    }

    async getTemasWithFilters(
        filters: ITemaFilters,
        pagination: PaginationParams
    ): Promise<ApiResponse<PaginatedResponse<any>>> {
        try {
            const whereClause: any = {};
            const includeClause: any = {
                association: 'seccion',
                attributes: ['id', 'titulo', 'curso_id']
            };

            if (filters.seccion_id) {
                whereClause.seccion_id = filters.seccion_id;
            }
            if (filters.titulo) {
                whereClause.titulo = { [Op.like]: `%${filters.titulo}%` };
            }
            if (filters.tipo_contenido) {
                whereClause.tipo_contenido = filters.tipo_contenido;
            }
            if (filters.activo !== undefined) {
                whereClause.activo = filters.activo;
            }
            if (filters.curso_id) {
                includeClause.where = { curso_id: filters.curso_id };
            }

            const { count, rows } = await Tema.findAndCountAll({
                where: whereClause,
                include: [includeClause],
                limit: pagination.limit,
                offset: (pagination.page - 1) * pagination.limit,
                order: [['seccion_id', 'ASC'], ['orden', 'ASC']]
            });

            return {
                success: true,
                data: {
                    data: rows.map(t => t.toJSON()),
                    total: count,
                    page: pagination.page,
                    limit: pagination.limit,
                    totalPages: Math.ceil(count / pagination.limit)
                }
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Error obteniendo temas'
            };
        }
    }

    async updateTema(id: number, updateData: ITemaUpdateData): Promise<ApiResponse<any>> {
        try {
            const tema = await Tema.findByPk(id);
            if (!tema) {
                return {
                    success: false,
                    error: 'Tema no encontrado'
                };
            }

            await tema.update(updateData);
            return {
                success: true,
                data: tema.toJSON()
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Error actualizando tema'
            };
        }
    }

    async deleteTema(id: number): Promise<ApiResponse<boolean>> {
        try {
            const tema = await Tema.findByPk(id);
            if (!tema) {
                return {
                    success: false,
                    error: 'Tema no encontrado'
                };
            }

            await tema.destroy();
            return {
                success: true,
                data: true
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Error eliminando tema'
            };
        }
    }

    async deactivateTema(id: number): Promise<ApiResponse<any>> {
        try {
            const tema = await Tema.findByPk(id);
            if (!tema) {
                return {
                    success: false,
                    error: 'Tema no encontrado'
                };
            }

            await tema.update({ activo: false });
            return {
                success: true,
                data: tema.toJSON()
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Error desactivando tema'
            };
        }
    }

    // ============================================
    // CONSULTAS AVANZADAS
    // ============================================

    async reordenarTemas(seccionId: number, ordenNuevo: number[]): Promise<ApiResponse<any[]>> {
        try {
            // Verificar que todos los temas pertenecen a la sección
            const temas = await Tema.findAll({
                where: {
                    id: { [Op.in]: ordenNuevo },
                    seccion_id: seccionId
                }
            });

            if (temas.length !== ordenNuevo.length) {
                return {
                    success: false,
                    error: 'Algunos temas no pertenecen a la sección o no existen'
                };
            }

            // Actualizar el orden
            const promises = ordenNuevo.map((temaId, index) => {
                return Tema.update(
                    { orden: index + 1 },
                    { where: { id: temaId } }
                );
            });

            await Promise.all(promises);

            // Obtener temas actualizados
            const temasActualizados = await Tema.findAll({
                where: { seccion_id: seccionId },
                order: [['orden', 'ASC']]
            });

            return {
                success: true,
                data: temasActualizados.map(t => t.toJSON())
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Error reordenando temas'
            };
        }
    }

    async getTemasByTipo(tipoContenido: string): Promise<ApiResponse<any[]>> {
        try {
            const temas = await Tema.findAll({
                where: {
                    tipo_contenido: tipoContenido,
                    activo: true
                },
                include: [{
                    association: 'seccion',
                    attributes: ['id', 'titulo', 'curso_id']
                }],
                order: [['seccion_id', 'ASC'], ['orden', 'ASC']]
            });

            return {
                success: true,
                data: temas.map(t => t.toJSON())
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Error obteniendo temas por tipo'
            };
        }
    }

    async duplicarTema(id: number, nuevaSeccionId?: number): Promise<ApiResponse<any>> {
        try {
            const temaOriginal = await Tema.findByPk(id);
            if (!temaOriginal) {
                return {
                    success: false,
                    error: 'Tema no encontrado'
                };
            }

            const seccionId = nuevaSeccionId || temaOriginal.seccion_id;

            // Verificar que la nueva sección existe
            const seccion = await Seccion.findByPk(seccionId);
            if (!seccion) {
                return {
                    success: false,
                    error: 'Sección destino no encontrada'
                };
            }

            // Obtener el siguiente orden
            const maxOrden = await Tema.max('orden', {
                where: { seccion_id: seccionId }
            });

            const orden = (Number(maxOrden) || 0) + 1;
            const temaDuplicado = await Tema.create({
                seccion_id: seccionId,
                titulo: `${temaOriginal.titulo} (Copia)`,
                contenido: temaOriginal.contenido,
                orden: orden,
                tipo_contenido: temaOriginal.tipo_contenido,
                duracion_estimada_minutos: temaOriginal.duracion_estimada_minutos,
                puntos_requeridos: temaOriginal.puntos_requeridos,
                activo: true
            });

            return {
                success: true,
                data: temaDuplicado.toJSON()
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Error duplicando tema'
            };
        }
    }

    async moverTema(id: number, nuevaSeccionId: number, nuevoOrden?: number): Promise<ApiResponse<any>> {
        try {
            const tema = await Tema.findByPk(id);
            if (!tema) {
                return {
                    success: false,
                    error: 'Tema no encontrado'
                };
            }

            // Verificar que la nueva sección existe
            const seccion = await Seccion.findByPk(nuevaSeccionId);
            if (!seccion) {
                return {
                    success: false,
                    error: 'Sección destino no encontrada'
                };
            }

            // Determinar el orden
            let orden = nuevoOrden;
            if (!orden) {
                const maxOrden = await Tema.max('orden', {
                    where: { seccion_id: nuevaSeccionId }
                });
                orden = (Number(maxOrden) || 0) + 1;
            }

            await tema.update({
                seccion_id: nuevaSeccionId,
                orden: orden
            });

            return {
                success: true,
                data: tema.toJSON()
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Error moviendo tema'
            };
        }
    }

    // ============================================
    // ESTADÍSTICAS
    // ============================================

    async getEstadisticasTema(id: number): Promise<ApiResponse<any>> {
        try {
            const tema = await Tema.findByPk(id, {
                include: [{
                    association: 'seccion',
                    attributes: ['id', 'titulo', 'curso_id']
                }]
            });

            if (!tema) {
                return {
                    success: false,
                    error: 'Tema no encontrado'
                };
            }

            return {
                success: true,
                data: {
                    tema_id: id,
                    titulo: tema.titulo,
                    seccion_id: tema.seccion_id,
                    tipo_contenido: tema.tipo_contenido,
                    duracion_estimada_minutos: tema.duracion_estimada_minutos,
                    puntos_requeridos: tema.puntos_requeridos,
                    orden: tema.orden,
                    activo: tema.activo
                }
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Error obteniendo estadísticas del tema'
            };
        }
    }

    async getEstadisticasPorTipo(): Promise<ApiResponse<any>> {
        try {
            const estadisticas = await Tema.findAll({
                attributes: [
                    'tipo_contenido',
                    [Tema.sequelize!.fn('COUNT', Tema.sequelize!.col('id')), 'total'],
                    [Tema.sequelize!.fn('AVG', Tema.sequelize!.col('duracion_estimada_minutos')), 'duracion_promedio'],
                    [Tema.sequelize!.fn('SUM', Tema.sequelize!.col('puntos_requeridos')), 'puntos_totales']
                ],
                where: { activo: true },
                group: ['tipo_contenido'],
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

export const temaDAO = new TemaDAO();