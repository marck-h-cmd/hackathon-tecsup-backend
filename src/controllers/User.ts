import { Request, Response } from "express";
import {
	verifyUserService,
	createUserService,
	getUserByIdService,
	getUserByEmailService,
	getUsersWithFiltersService,
	updateUserService,
	deactivateUserService,
	getUserWithProfileService,
	createPerfilEstudianteService,
	getPerfilEstudianteByUserIdService,
	updatePerfilEstudianteService,
	updateStreakEstudianteService,
	addExperienciaEstudianteService,
	verifyAdminCredentialsService,
	getEstadisticasUsuariosService,
	getTopEstudiantesPorExperienciaService
} from "../services/User";
import { IUserCreationAttributes, IUserUpdateData, IUserFilters } from "../interfaces/mysql/User";
import { IPerfilEstudianteCreationAttributes, IPerfilEstudianteUpdateData } from "../interfaces/mysql/PerfilEstudiante";

// ============================================
// USER CONTROLLERS
// ============================================

export const verifyUser = async (req: Request, res: Response): Promise<void> => {
	try {
		const userId = req.params.userId;
		if (!userId) {
			res.status(400).json({ message: 'El id del usuario es obligatorio' });
			return;
		}
		const result = await verifyUserService(userId);
		res.status(200).json(result);
	} catch (error: any) {
		res.status(500).json({ message: error.message || 'Error interno del servidor' });
	}
};

export const createUser = async (req: Request, res: Response): Promise<void> => {
	try {
		const userData: IUserCreationAttributes = req.body;
		const result = await createUserService(userData);
		res.status(201).json({ success: true, data: result });
	} catch (error: any) {
		res.status(400).json({ success: false, message: error.message || 'Error al crear el usuario' });
	}
};

export const getUserById = async (req: Request, res: Response): Promise<void> => {
	try {
		const id = parseInt(req.params.id);
		if (isNaN(id)) {
			res.status(400).json({ success: false, message: 'ID de usuario inválido' });
			return;
		}
		const result = await getUserByIdService(id);
		res.status(200).json({ success: true, data: result });
	} catch (error: any) {
		res.status(404).json({ success: false, message: error.message || 'Usuario no encontrado' });
	}
};

export const getUserByEmail = async (req: Request, res: Response): Promise<void> => {
	try {
		const email = req.params.email;
		if (!email) {
			res.status(400).json({ success: false, message: 'Email es obligatorio' });
			return;
		}
		const result = await getUserByEmailService(email);
		res.status(200).json({ success: true, data: result });
	} catch (error: any) {
		res.status(404).json({ success: false, message: error.message || 'Usuario no encontrado' });
	}
};

export const getUsersWithFilters = async (req: Request, res: Response): Promise<void> => {
	try {
		const filters: IUserFilters = {
			email: req.query.email as string,
			tipo_usuario: req.query.tipo_usuario as any,
			activo: req.query.activo === 'true' ? true : req.query.activo === 'false' ? false : undefined
		};

		const page = parseInt(req.query.page as string) || 1;
		const limit = parseInt(req.query.limit as string) || 10;

		const pagination = { page, limit };

		const result = await getUsersWithFiltersService(filters, pagination);
		res.status(200).json({ success: true, data: result });
	} catch (error: any) {
		res.status(500).json({ success: false, message: error.message || 'Error al obtener usuarios' });
	}
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
	try {
		const id = parseInt(req.params.id);
		if (isNaN(id)) {
			res.status(400).json({ success: false, message: 'ID de usuario inválido' });
			return;
		}
		const updateData: IUserUpdateData = req.body;
		const result = await updateUserService(id, updateData);
		res.status(200).json({ success: true, data: result });
	} catch (error: any) {
		res.status(400).json({ success: false, message: error.message || 'Error al actualizar el usuario' });
	}
};

export const deactivateUser = async (req: Request, res: Response): Promise<void> => {
	try {
		const id = parseInt(req.params.id);
		if (isNaN(id)) {
			res.status(400).json({ success: false, message: 'ID de usuario inválido' });
			return;
		}
		const result = await deactivateUserService(id);
		res.status(200).json({ success: true, data: result, message: 'Usuario desactivado correctamente' });
	} catch (error: any) {
		res.status(400).json({ success: false, message: error.message || 'Error al desactivar el usuario' });
	}
};

export const getUserWithProfile = async (req: Request, res: Response): Promise<void> => {
	try {
		const userId = parseInt(req.params.userId);
		if (isNaN(userId)) {
			res.status(400).json({ success: false, message: 'ID de usuario inválido' });
			return;
		}
		const result = await getUserWithProfileService(userId);
		res.status(200).json({ success: true, data: result });
	} catch (error: any) {
		res.status(404).json({ success: false, message: error.message || 'Usuario no encontrado' });
	}
};

// ============================================
// PERFIL ESTUDIANTE CONTROLLERS
// ============================================

export const createPerfilEstudiante = async (req: Request, res: Response): Promise<void> => {
	try {
		const perfilData: IPerfilEstudianteCreationAttributes = req.body;
		const result = await createPerfilEstudianteService(perfilData);
		res.status(201).json({ success: true, data: result });
	} catch (error: any) {
		res.status(400).json({ success: false, message: error.message || 'Error al crear el perfil de estudiante' });
	}
};

export const getPerfilEstudianteByUserId = async (req: Request, res: Response): Promise<void> => {
	try {
		const usuarioId = parseInt(req.params.usuarioId);
		if (isNaN(usuarioId)) {
			res.status(400).json({ success: false, message: 'ID de usuario inválido' });
			return;
		}
		const result = await getPerfilEstudianteByUserIdService(usuarioId);
		res.status(200).json({ success: true, data: result });
	} catch (error: any) {
		res.status(404).json({ success: false, message: error.message || 'Perfil de estudiante no encontrado' });
	}
};

export const updatePerfilEstudiante = async (req: Request, res: Response): Promise<void> => {
	try {
		const usuarioId = parseInt(req.params.usuarioId);
		if (isNaN(usuarioId)) {
			res.status(400).json({ success: false, message: 'ID de usuario inválido' });
			return;
		}
		const updateData: IPerfilEstudianteUpdateData = req.body;
		const result = await updatePerfilEstudianteService(usuarioId, updateData);
		res.status(200).json({ success: true, data: result });
	} catch (error: any) {
		res.status(400).json({ success: false, message: error.message || 'Error al actualizar el perfil de estudiante' });
	}
};

export const updateStreakEstudiante = async (req: Request, res: Response): Promise<void> => {
	try {
		const usuarioId = parseInt(req.params.usuarioId);
		if (isNaN(usuarioId)) {
			res.status(400).json({ success: false, message: 'ID de usuario inválido' });
			return;
		}
		const { nuevoStreak } = req.body;
		if (typeof nuevoStreak !== 'number' || nuevoStreak < 0) {
			res.status(400).json({ success: false, message: 'El streak debe ser un número positivo' });
			return;
		}
		const result = await updateStreakEstudianteService(usuarioId, nuevoStreak);
		res.status(200).json({ success: true, data: result });
	} catch (error: any) {
		res.status(400).json({ success: false, message: error.message || 'Error al actualizar el streak' });
	}
};

export const addExperienciaEstudiante = async (req: Request, res: Response): Promise<void> => {
	try {
		const usuarioId = parseInt(req.params.usuarioId);
		if (isNaN(usuarioId)) {
			res.status(400).json({ success: false, message: 'ID de usuario inválido' });
			return;
		}
		const { puntos } = req.body;
		if (typeof puntos !== 'number' || puntos <= 0) {
			res.status(400).json({ success: false, message: 'Los puntos deben ser un número positivo' });
			return;
		}
		const result = await addExperienciaEstudianteService(usuarioId, puntos);
		res.status(200).json({ success: true, data: result });
	} catch (error: any) {
		res.status(400).json({ success: false, message: error.message || 'Error al agregar experiencia' });
	}
};

// ============================================
// ADMIN CONTROLLERS
// ============================================

export const verifyAdminCredentials = async (req: Request, res: Response): Promise<void> => {
	try {
		const { email, password } = req.body;
		if (!email || !password) {
			res.status(400).json({ success: false, message: 'Email y contraseña son obligatorios' });
			return;
		}
		const result = await verifyAdminCredentialsService(email, password);
		res.status(200).json({ success: true, data: result });
	} catch (error: any) {
		res.status(401).json({ success: false, message: error.message || 'Credenciales inválidas' });
	}
};

// ============================================
// STATISTICS CONTROLLERS
// ============================================

export const getEstadisticasUsuarios = async (req: Request, res: Response): Promise<void> => {
	try {
		const result = await getEstadisticasUsuariosService();
		res.status(200).json({ success: true, data: result });
	} catch (error: any) {
		res.status(500).json({ success: false, message: error.message || 'Error al obtener estadísticas' });
	}
};

export const getTopEstudiantesPorExperiencia = async (req: Request, res: Response): Promise<void> => {
	try {
		const limit = parseInt(req.query.limit as string) || 10;
		const result = await getTopEstudiantesPorExperienciaService(limit);
		res.status(200).json({ success: true, data: result });
	} catch (error: any) {
		res.status(500).json({ success: false, message: error.message || 'Error al obtener top estudiantes' });
	}
};
