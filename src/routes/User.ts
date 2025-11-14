import express from "express";
import {
  verifyUser,
  createUser,
  getUserById,
  getUserByEmail,
  getUsersWithFilters,
  updateUser,
  deactivateUser,
  getUserWithProfile,
  createPerfilEstudiante,
  getPerfilEstudianteByUserId,
  updatePerfilEstudiante,
  updateStreakEstudiante,
  addExperienciaEstudiante,
  verifyAdminCredentials,
  getEstadisticasUsuarios,
  getTopEstudiantesPorExperiencia
} from "../controllers/User";

const authenticateClerkToken = require('../middleware/auth');

const router = express.Router();

// ============================================
// USER ROUTES
// ============================================

/**
 * @openapi
 * /user/verifyUser/{userId}:
 *   get:
 *     tags:
 *       - User
 *     summary: Verificar usuario
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuario verificado
 */
router.get('/verifyUser/:userId', authenticateClerkToken, verifyUser);

/**
 * @openapi
 * /user/users:
 *   post:
 *     tags:
 *       - User
 *     summary: Crear usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Usuario creado
 */
router.post('/users', authenticateClerkToken, createUser);

/**
 * @openapi
 * /user/users/{id}:
 *   get:
 *     tags:
 *       - User
 *     summary: Obtener usuario por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuario
 */
router.get('/users/:id', authenticateClerkToken, getUserById);

/**
 * @openapi
 * /user/users/email/{email}:
 *   get:
 *     tags:
 *       - User
 *     summary: Obtener usuario por email
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuario
 */
router.get('/users/email/:email', authenticateClerkToken, getUserByEmail);

/**
 * @openapi
 * /user/users:
 *   get:
 *     tags:
 *       - User
 *     summary: Obtener usuarios con filtros (paginado)
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de usuarios
 */
router.get('/users', authenticateClerkToken, getUsersWithFilters);

/**
 * @openapi
 * /user/users/{id}:
 *   put:
 *     tags:
 *       - User
 *     summary: Actualizar usuario
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Usuario actualizado
 */
router.put('/users/:id', authenticateClerkToken, updateUser);

/**
 * @openapi
 * /user/users/{id}:
 *   delete:
 *     tags:
 *       - User
 *     summary: Desactivar usuario
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Usuario desactivado
 */
router.delete('/users/:id', authenticateClerkToken, deactivateUser);

/**
 * @openapi
 * /user/users/{userId}/profile:
 *   get:
 *     tags:
 *       - User
 *     summary: Obtener usuario con perfil
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuario con perfil
 */
router.get('/users/:userId/profile', authenticateClerkToken, getUserWithProfile);

// ============================================
// PERFIL ESTUDIANTE ROUTES
// ============================================

/**
 * @openapi
 * /user/perfil-estudiante:
 *   post:
 *     tags:
 *       - PerfilEstudiante
 *     summary: Crear perfil de estudiante
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Perfil creado
 */
router.post('/perfil-estudiante', authenticateClerkToken, createPerfilEstudiante);

/**
 * @openapi
 * /user/perfil-estudiante/{usuarioId}:
 *   get:
 *     tags:
 *       - PerfilEstudiante
 *     summary: Obtener perfil de estudiante por usuario ID
 *     parameters:
 *       - in: path
 *         name: usuarioId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Perfil estudiante
 */
router.get('/perfil-estudiante/:usuarioId', authenticateClerkToken, getPerfilEstudianteByUserId);

/**
 * @openapi
 * /user/perfil-estudiante/{usuarioId}:
 *   put:
 *     tags:
 *       - PerfilEstudiante
 *     summary: Actualizar perfil de estudiante
 *     parameters:
 *       - in: path
 *         name: usuarioId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Perfil actualizado
 */
router.put('/perfil-estudiante/:usuarioId', authenticateClerkToken, updatePerfilEstudiante);

/**
 * @openapi
 * /user/perfil-estudiante/{usuarioId}/streak:
 *   patch:
 *     tags:
 *       - PerfilEstudiante
 *     summary: Actualizar streak de estudiante
 *     parameters:
 *       - in: path
 *         name: usuarioId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Streak actualizado
 */
router.patch('/perfil-estudiante/:usuarioId/streak', authenticateClerkToken, updateStreakEstudiante);

/**
 * @openapi
 * /user/perfil-estudiante/{usuarioId}/experiencia:
 *   patch:
 *     tags:
 *       - PerfilEstudiante
 *     summary: Agregar experiencia a estudiante
 *     parameters:
 *       - in: path
 *         name: usuarioId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Experiencia añadida
 */
router.patch('/perfil-estudiante/:usuarioId/experiencia', authenticateClerkToken, addExperienciaEstudiante);

// ============================================
// ADMIN ROUTES
// ============================================

/**
 * @openapi
 * /user/admin/verify:
 *   post:
 *     tags:
 *       - Admin
 *     summary: Verificar credenciales de administrador
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Credenciales válidas
 */
router.post('/admin/verify', verifyAdminCredentials);

// ============================================
// STATISTICS ROUTES
// ============================================

/**
 * @openapi
 * /user/estadisticas/usuarios:
 *   get:
 *     tags:
 *       - Statistics
 *     summary: Obtener estadísticas de usuarios
 *     responses:
 *       200:
 *         description: Estadísticas
 */
router.get('/estadisticas/usuarios', authenticateClerkToken, getEstadisticasUsuarios);

/**
 * @openapi
 * /user/estadisticas/top-estudiantes:
 *   get:
 *     tags:
 *       - Statistics
 *     summary: Obtener top estudiantes por experiencia
 *     responses:
 *       200:
 *         description: Top estudiantes
 */
router.get('/estadisticas/top-estudiantes', authenticateClerkToken, getTopEstudiantesPorExperiencia);

export default router;