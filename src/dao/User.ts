import { pool } from '../config/database';

export const verifyExistUser = async (userId: string): Promise<boolean> => {
    try {
        const [rows] = await pool.query('SELECT 1 FROM users WHERE userId = ? LIMIT 1', [userId]);
        return Array.isArray(rows) && rows.length > 0;
    } catch (error) {
        throw new Error('Error al verificar la existencia del usuario');
    }
};
export const createAdminUser = async ( idRol, correo, contrasenia) => {
    try {
        const query = 'INSERT INTO usuario (Rol_idRol, Correo, Contrasenia) VALUES (?,?,?,?)';
        const [result] = await pool.execute(query, [ idRol, correo, contrasenia]);
        return { id: result.insertId, correo };
    }catch (error) {
            throw error.status? error : new Error('Error al crear el usuario ADMIN');
        }
    }