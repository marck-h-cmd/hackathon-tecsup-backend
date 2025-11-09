import { userDAO } from '../dao/User';

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

export const createAdminUserService = async (): Promise<any> => {
    try {
        const password = process.env.ADMIN_PASSWORD || 'admin123';
        const email = process.env.ADMIN_EMAIL || 'admin@gmail.com';
        
        const result = await userDAO.createAdminUser(email, password);
        
        if (!result.success) {
            throw new Error(result.error || 'Error al crear usuario Admin');
        }
        
        return result.data;
    } catch (error: any) {
        throw error instanceof Error ? error : new Error('Error en el servicio al crear usuario Admin');
    }
};