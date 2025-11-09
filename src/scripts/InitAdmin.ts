import { createAdminUserService } from '../services/User';
import { User } from '../models';
import { TipoUsuario } from '../interfaces/shared/enums';

export const ensureAdminUserExists = async () => {
    try {
        // Verificar si existe un usuario con tipo_usuario = ADMIN
        const adminUser = await User.findOne({
            where: { tipo_usuario: TipoUsuario.ADMIN }
        });

        if (!adminUser) {
            const result = await createAdminUserService();
            console.log('🛡️ Usuario ADMIN creado con éxito:', result);
        } else {
            console.log('ℹ️ El usuario ADMIN ya existe.');
        }
    } catch (error) {
        console.error('❌ Error al verificar o crear el usuario ADMIN:', error);
        throw error;
    }
}
