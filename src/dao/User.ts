import { Op } from 'sequelize';
import { User } from '../models';
import { PerfilEstudiante } from '../models';
import { 
  IUserAttributes, 
  IUserCreationAttributes, 
  IUserFilters,
  IUserUpdateData

} from '../interfaces/mysql/User';

import {
  IPerfilEstudianteAttributes,
  IPerfilEstudianteUpdateData,
  IPerfilEstudianteCreationAttributes
} from '../interfaces/mysql/PerfilEstudiante'
import { ApiResponse, PaginationParams, PaginatedResponse } from '../interfaces/shared/types';
import bcrypt from 'bcrypt';
import { TipoUsuario } from '../interfaces/shared/enums';

export class UserDAO {
  
  // ============================================
  // USUARIOS CLERK (Estudiantes)
  // ============================================

  async createUser(userData: IUserCreationAttributes): Promise<ApiResponse<IUserAttributes>> {
    try {
      const user = await User.create(userData);
      return {
        success: true,
        data: user.toJSON()
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  }

  async getUserById(id: number): Promise<ApiResponse<IUserAttributes>> {
    try {
      const user = await User.findByPk(id);
      if (!user) {
        return {
          success: false,
          error: 'Usuario no encontrado'
        };
      }
      return {
        success: true,
        data: user.toJSON()
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  }

  async getUserByEmail(email: string): Promise<ApiResponse<IUserAttributes>> {
    try {
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return {
          success: false,
          error: 'Usuario no encontrado'
        };
      }
      return {
        success: true,
        data: user.toJSON()
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  }

  async verifyUserExists(email: string): Promise<ApiResponse<boolean>> {
    try {
      const user = await User.findOne({ where: { email } });
      return {
        success: true,
        data: user !== null
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error verificando usuario'
      };
    }
  }

  async getUsersWithFilters(
    filters: IUserFilters,
    pagination: PaginationParams
  ): Promise<ApiResponse<PaginatedResponse<IUserAttributes>>> {
    try {
      const whereClause: any = {};
      
      if (filters.email) {
        whereClause.email = { [Op.like]: `%${filters.email}%` };
      }
      if (filters.tipo_usuario) {
        whereClause.tipo_usuario = filters.tipo_usuario;
      }
      if (filters.activo !== undefined) {
        whereClause.activo = filters.activo;
      }

      const { count, rows } = await User.findAndCountAll({
        where: whereClause,
        limit: pagination.limit,
        offset: (pagination.page - 1) * pagination.limit,
        order: [['fecha_registro', 'DESC']]
      });

      return {
        success: true,
        data: {
          data: rows.map(user => user.toJSON()),
          total: count,
          page: pagination.page,
          limit: pagination.limit,
          totalPages: Math.ceil(count / pagination.limit)
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  }

  async updateUser(id: number, updateData: IUserUpdateData): Promise<ApiResponse<IUserAttributes>> {
    try {
      const user = await User.findByPk(id);
      if (!user) {
        return {
          success: false,
          error: 'Usuario no encontrado'
        };
      }

      await user.update(updateData);
      return {
        success: true,
        data: user.toJSON()
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  }

  async deactivateUser(id: number): Promise<ApiResponse<IUserAttributes>> {
    try {
      const user = await User.findByPk(id);
      if (!user) {
        return {
          success: false,
          error: 'Usuario no encontrado'
        };
      }

      await user.update({ activo: false });
      return {
        success: true,
        data: user.toJSON()
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  }

  // ============================================
  // PERFILES DE ESTUDIANTES
  // ============================================

  async createPerfilEstudiante(perfilData: IPerfilEstudianteCreationAttributes): Promise<ApiResponse<any>> {
    try {
      // Verificar que el usuario existe y es estudiante
      const user = await User.findByPk(perfilData.usuario_id);
      if (!user) {
        return {
          success: false,
          error: 'Usuario no encontrado'
        };
      }

      if (user.tipo_usuario !== 'estudiante') {
        return {
          success: false,
          error: 'Solo los usuarios estudiantes pueden tener perfil de estudiante'
        };
      }

      const perfil = await PerfilEstudiante.create(perfilData);
      return {
        success: true,
        data: perfil.toJSON()
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  }

  async getPerfilEstudianteByUserId(usuarioId: number): Promise<ApiResponse<any>> {
    try {
      const perfil = await PerfilEstudiante.findOne({ 
        where: { usuario_id: usuarioId },
        include: [{
          association: 'usuario',
          attributes: ['id', 'email', 'tipo_usuario', 'activo']
        }]
      });

      if (!perfil) {
        return {
          success: false,
          error: 'Perfil de estudiante no encontrado'
        };
      }

      return {
        success: true,
        data: perfil.toJSON()
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  }

  async updatePerfilEstudiante(
    usuarioId: number, 
    updateData: IPerfilEstudianteUpdateData
  ): Promise<ApiResponse<any>> {
    try {
      const perfil = await PerfilEstudiante.findOne({ where: { usuario_id: usuarioId } });
      if (!perfil) {
        return {
          success: false,
          error: 'Perfil de estudiante no encontrado'
        };
      }

      await perfil.update({
        ...updateData,
        fecha_actualizacion: new Date()
      });

      return {
        success: true,
        data: perfil.toJSON()
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  }

  async updateStreakEstudiante(usuarioId: number, nuevoStreak: number): Promise<ApiResponse<any>> {
    try {
      const perfil = await PerfilEstudiante.findOne({ where: { usuario_id: usuarioId } });
      if (!perfil) {
        return {
          success: false,
          error: 'Perfil de estudiante no encontrado'
        };
      }

      const streakMaximo = Math.max(perfil.streak_maximo, nuevoStreak);
      
      await perfil.update({
        streak_actual: nuevoStreak,
        streak_maximo: streakMaximo,
        fecha_actualizacion: new Date()
      });

      return {
        success: true,
        data: {
          streak_actual: nuevoStreak,
          streak_maximo: streakMaximo
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  }

  async addExperienciaEstudiante(usuarioId: number, puntos: number): Promise<ApiResponse<any>> {
    try {
      const perfil = await PerfilEstudiante.findOne({ where: { usuario_id: usuarioId } });
      if (!perfil) {
        return {
          success: false,
          error: 'Perfil de estudiante no encontrado'
        };
      }

      const nuevosPuntos = perfil.puntos_experiencia + puntos;
      const nuevoNivel = Math.floor(nuevosPuntos / 1000) + 1; // 1000 puntos por nivel

      await perfil.update({
        puntos_experiencia: nuevosPuntos,
        nivel_experiencia: nuevoNivel,
        fecha_actualizacion: new Date()
      });

      return {
        success: true,
        data: {
          puntos_experiencia: nuevosPuntos,
          nivel_experiencia: nuevoNivel,
          nivel_anterior: perfil.nivel_experiencia,
          subio_nivel: nuevoNivel > perfil.nivel_experiencia
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  }

  // ============================================
  // USUARIOS ADMINISTRATIVOS
  // ============================================

  async createAdminUser(email: string, password: string): Promise<ApiResponse<IUserAttributes>> {
    try {
      // Verificar si el email ya existe
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return {
          success: false,
          error: 'El email ya está registrado'
        };
      }

      // Hash de la contraseña
      const passwordHash = await bcrypt.hash(password, 12);

      // Crear usuario admin
      const adminUser = await User.create({
        email,
        password_hash: passwordHash,
        tipo_usuario: TipoUsuario.ADMIN,
        activo: true,
        idioma_preferido: 'es'
      });

      return {
        success: true,
        data: {
          id: adminUser.id,
          email: adminUser.email,
          tipo_usuario: adminUser.tipo_usuario,
          activo: adminUser.activo,
          fecha_registro: adminUser.fecha_registro
        } as IUserAttributes
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error creando usuario admin'
      };
    }
  }

  async verifyAdminCredentials(email: string, password: string): Promise<ApiResponse<IUserAttributes>> {
    try {
      const user = await User.findOne({ 
        where: { 
          email, 
          tipo_usuario: 'admin',
          activo: true
        } 
      });

      if (!user) {
        return {
          success: false,
          error: 'Credenciales inválidas'
        };
      }

      const isValidPassword = await bcrypt.compare(password, user.password_hash);
      if (!isValidPassword) {
        return {
          success: false,
          error: 'Credenciales inválidas'
        };
      }

      return {
        success: true,
        data: {
          id: user.id,
          email: user.email,
          tipo_usuario: user.tipo_usuario,
          activo: user.activo,
          fecha_registro: user.fecha_registro
        } as IUserAttributes
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error verificando credenciales'
      };
    }
  }

  async getUserWithProfile(userId: number): Promise<ApiResponse<any>> {
    try {
      const user = await User.findByPk(userId, {
        include: [{
          association: 'perfil_estudiante',
          required: false
        }]
      });

      if (!user) {
        return {
          success: false,
          error: 'Usuario no encontrado'
        };
      }

      const userData = user.toJSON() as any;
      
      // Ocultar password_hash en la respuesta
      const { password_hash, ...userDataWithoutPassword } = userData;

      return {
        success: true,
        data: userDataWithoutPassword
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  }

  // ============================================
  // ESTADÍSTICAS Y REPORTES
  // ============================================

  async getEstadisticasUsuarios(): Promise<ApiResponse<any>> {
    try {
      const [totalUsuarios, totalEstudiantes, totalAdmins, usuariosActivos] = await Promise.all([
        User.count(),
        User.count({ where: { tipo_usuario: 'estudiante' } }),
        User.count({ where: { tipo_usuario: 'admin' } }),
        User.count({ where: { activo: true } })
      ]);

      const estudiantesConPerfil = await PerfilEstudiante.count();
      const estudiantesConStreak = await PerfilEstudiante.count({ 
        where: { streak_actual: { [Op.gt]: 0 } } 
      });

      return {
        success: true,
        data: {
          total_usuarios: totalUsuarios,
          total_estudiantes: totalEstudiantes,
          total_administradores: totalAdmins,
          usuarios_activos: usuariosActivos,
          estudiantes_con_perfil: estudiantesConPerfil,
          estudiantes_con_streak: estudiantesConStreak,
          tasa_completacion_perfiles: (estudiantesConPerfil / totalEstudiantes) * 100
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error obteniendo estadísticas'
      };
    }
  }

  async getTopEstudiantesPorExperiencia(limit: number = 10): Promise<ApiResponse<any[]>> {
    try {
      const topEstudiantes = await PerfilEstudiante.findAll({
        include: [{
          association: 'usuario',
          attributes: ['id', 'email'],
          where: { activo: true }
        }],
        order: [['puntos_experiencia', 'DESC']],
        limit: limit
      });

      return {
        success: true,
        data: topEstudiantes.map(est => {
          const estData = est.toJSON() as any;
          return {
            usuario_id: est.usuario_id,
            nombre_completo: est.nombre_completo,
            puntos_experiencia: est.puntos_experiencia,
            nivel_experiencia: est.nivel_experiencia,
            streak_actual: est.streak_actual,
            email: estData.usuario?.email
          };
        })
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error obteniendo top estudiantes'
      };
    }
  }
}

export const userDAO = new UserDAO();