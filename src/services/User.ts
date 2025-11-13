import { userDAO } from '../dao/User';
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
} from '../interfaces/mysql/PerfilEstudiante';
import { PaginationParams, PaginatedResponse } from '../interfaces/shared/types';

// ============================================
// USER SERVICES
// ============================================

export const verifyUserService = async (userId: string): Promise<{ exists: boolean }> => {
	try {
		const result = await userDAO.verifyUserExists(userId);
		if (!result.success || result.data === undefined) {
			throw new Error(result.error || 'Error al verificar el usuario');
		}
		return { exists: result.data };
	} catch (error) {
		throw new Error('Error al verificar el usuario');
	}
};

export const createUserService = async (userData: IUserCreationAttributes): Promise<IUserAttributes> => {
	try {
		const result = await userDAO.createUser(userData);
		if (!result.success || !result.data) {
			throw new Error(result.error || 'Error al crear el usuario');
		}
		return result.data;
	} catch (error: any) {
		throw error instanceof Error ? error : new Error('Error en el servicio al crear usuario');
	}
};

export const getUserByIdService = async (id: number): Promise<IUserAttributes> => {
	try {
		const result = await userDAO.getUserById(id);
		if (!result.success || !result.data) {
			throw new Error(result.error || 'Usuario no encontrado');
		}
		return result.data;
	} catch (error: any) {
		throw error instanceof Error ? error : new Error('Error al obtener el usuario');
	}
};

export const getUserByEmailService = async (email: string): Promise<IUserAttributes> => {
	try {
		const result = await userDAO.getUserByEmail(email);
		if (!result.success || !result.data) {
			throw new Error(result.error || 'Usuario no encontrado');
		}
		return result.data;
	} catch (error: any) {
		throw error instanceof Error ? error : new Error('Error al obtener el usuario');
	}
};

export const getUsersWithFiltersService = async (
	filters: IUserFilters,
	pagination: PaginationParams
): Promise<PaginatedResponse<IUserAttributes>> => {
	try {
		const result = await userDAO.getUsersWithFilters(filters, pagination);
		if (!result.success || !result.data) {
			throw new Error(result.error || 'Error al obtener usuarios');
		}
		return result.data;
	} catch (error: any) {
		throw error instanceof Error ? error : new Error('Error en el servicio al obtener usuarios');
	}
};

export const updateUserService = async (
	id: number,
	updateData: IUserUpdateData
): Promise<IUserAttributes> => {
	try {
		const result = await userDAO.updateUser(id, updateData);
		if (!result.success || !result.data) {
			throw new Error(result.error || 'Error al actualizar el usuario');
		}
		return result.data;
	} catch (error: any) {
		throw error instanceof Error ? error : new Error('Error en el servicio al actualizar usuario');
	}
};

export const deactivateUserService = async (id: number): Promise<IUserAttributes> => {
	try {
		const result = await userDAO.deactivateUser(id);
		if (!result.success || !result.data) {
			throw new Error(result.error || 'Error al desactivar el usuario');
		}
		return result.data;
	} catch (error: any) {
		throw error instanceof Error ? error : new Error('Error en el servicio al desactivar usuario');
	}
};

export const getUserWithProfileService = async (userId: number): Promise<any> => {
	try {
		const result = await userDAO.getUserWithProfile(userId);
		if (!result.success || !result.data) {
			throw new Error(result.error || 'Usuario no encontrado');
		}
		return result.data;
	} catch (error: any) {
		throw error instanceof Error ? error : new Error('Error al obtener usuario con perfil');
	}
};

// ============================================
// PERFIL ESTUDIANTE SERVICES
// ============================================

export const createPerfilEstudianteService = async (
	perfilData: IPerfilEstudianteCreationAttributes
): Promise<IPerfilEstudianteAttributes> => {
	try {
		const result = await userDAO.createPerfilEstudiante(perfilData);
		if (!result.success || !result.data) {
			throw new Error(result.error || 'Error al crear el perfil de estudiante');
		}
		return result.data;
	} catch (error: any) {
		throw error instanceof Error ? error : new Error('Error en el servicio al crear perfil de estudiante');
	}
};

export const getPerfilEstudianteByUserIdService = async (usuarioId: number): Promise<any> => {
	try {
		const result = await userDAO.getPerfilEstudianteByUserId(usuarioId);
		if (!result.success || !result.data) {
			throw new Error(result.error || 'Perfil de estudiante no encontrado');
		}
		return result.data;
	} catch (error: any) {
		throw error instanceof Error ? error : new Error('Error al obtener el perfil de estudiante');
	}
};

export const updatePerfilEstudianteService = async (
	usuarioId: number,
	updateData: IPerfilEstudianteUpdateData
): Promise<any> => {
	try {
		const result = await userDAO.updatePerfilEstudiante(usuarioId, updateData);
		if (!result.success || !result.data) {
			throw new Error(result.error || 'Error al actualizar el perfil de estudiante');
		}
		return result.data;
	} catch (error: any) {
		throw error instanceof Error ? error : new Error('Error en el servicio al actualizar perfil de estudiante');
	}
};

export const updateStreakEstudianteService = async (
	usuarioId: number,
	nuevoStreak: number
): Promise<{ streak_actual: number; streak_maximo: number }> => {
	try {
		const result = await userDAO.updateStreakEstudiante(usuarioId, nuevoStreak);
		if (!result.success || !result.data) {
			throw new Error(result.error || 'Error al actualizar el streak');
		}
		return result.data;
	} catch (error: any) {
		throw error instanceof Error ? error : new Error('Error en el servicio al actualizar streak');
	}
};

export const addExperienciaEstudianteService = async (
	usuarioId: number,
	puntos: number
): Promise<{
	puntos_experiencia: number;
	nivel_experiencia: number;
	nivel_anterior: number;
	subio_nivel: boolean;
}> => {
	try {
		const result = await userDAO.addExperienciaEstudiante(usuarioId, puntos);
		if (!result.success || !result.data) {
			throw new Error(result.error || 'Error al agregar experiencia');
		}
		return result.data;
	} catch (error: any) {
		throw error instanceof Error ? error : new Error('Error en el servicio al agregar experiencia');
	}
};

// ============================================
// ADMIN SERVICES
// ============================================

export const createAdminUserService = async (): Promise<IUserAttributes> => {
	try {
		const password = process.env.ADMIN_PASSWORD || 'admin123';
		const email = process.env.ADMIN_EMAIL || 'admin@gmail.com';
		
		const result = await userDAO.createAdminUser(email, password);
		
		if (!result.success || !result.data) {
			throw new Error(result.error || 'Error al crear usuario Admin');
		}
		
		return result.data;
	} catch (error: any) {
		throw error instanceof Error ? error : new Error('Error en el servicio al crear usuario Admin');
	}
};

export const verifyAdminCredentialsService = async (
	email: string,
	password: string
): Promise<IUserAttributes> => {
	try {
		const result = await userDAO.verifyAdminCredentials(email, password);
		if (!result.success || !result.data) {
			throw new Error(result.error || 'Credenciales inválidas');
		}
		return result.data;
	} catch (error: any) {
		throw error instanceof Error ? error : new Error('Error al verificar credenciales de admin');
	}
};

// ============================================
// STATISTICS SERVICES
// ============================================

export const getEstadisticasUsuariosService = async (): Promise<any> => {
	try {
		const result = await userDAO.getEstadisticasUsuarios();
		if (!result.success || !result.data) {
			throw new Error(result.error || 'Error al obtener estadísticas');
		}
		return result.data;
	} catch (error: any) {
		throw error instanceof Error ? error : new Error('Error en el servicio al obtener estadísticas');
	}
};

export const getTopEstudiantesPorExperienciaService = async (limit: number = 10): Promise<any[]> => {
	try {
		const result = await userDAO.getTopEstudiantesPorExperiencia(limit);
		if (!result.success || !result.data) {
			throw new Error(result.error || 'Error al obtener top estudiantes');
		}
		return result.data;
	} catch (error: any) {
		throw error instanceof Error ? error : new Error('Error en el servicio al obtener top estudiantes');
	}
};