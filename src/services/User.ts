import { verifyExistUser, createAdminUser } from '../dao/User';
export const verifyUserService = async (userId: string): Promise<{ exists: boolean }> => {
	try {
		const exists = await verifyExistUser(userId);
		return { exists };
	} catch (error) {
		// Puedes personalizar el error según tu necesidad
		throw new Error('Error al verificar el usuario');
	}
};
export const createAdminUserService = async (): Promise<any> => {
    try {
        const password = process.env.ADMIN_PASSWORD || 'admin123';
        const correo = process.env.ADMIN_EMAIL || 'admin@gmail.com';
        const nombre = process.env.ADMIN_USERNAME || 'admin';
        const hashedPassword = await bcrypt.hash(password, 10);
        const dataRol = await RolDAO.createRol('ADMIN');
        return await createAdminUser( dataRol.id, correo, hashedPassword);
    } catch (error) {
        throw error.status? error : { status: 500, message: 'Error en el servicio al crear usuario Admin' };
    }
};