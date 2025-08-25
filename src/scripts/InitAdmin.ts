import { createAdminUserService } from '../services/User';
import { pool } from '../config/database';

export const ensureAdminUserExists = async () => {
    try {
        const connection = await pool.getConnection(); // usamos db.promise() si exportas solo promesas
        const [rows] = await connection.query(
            'SELECT * FROM usuario WHERE Rol_idRol = ?',
            ['1']
        );

        if (rows.length === 0) {
            const result = await createAdminUserService();
            console.log('🛡️ Usuario ADMIN creado con éxito.', result);
        } else {
            console.log('ℹ️ El usuario ADMIN ya existe.');
        }

        connection.release();
    } catch (error) {
        console.error('❌ Error al verificar o crear el usuario ADMIN:', error);
    }
}
