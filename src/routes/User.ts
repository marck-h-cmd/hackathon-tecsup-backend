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

// Verificar usuario
router.get('/verifyUser/:userId', authenticateClerkToken, verifyUser);

// Crear usuario
router.post('/users', authenticateClerkToken, createUser);

// Obtener usuario por ID
router.get('/users/:id', authenticateClerkToken, getUserById);

// Obtener usuario por email
router.get('/users/email/:email', authenticateClerkToken, getUserByEmail);

// Obtener usuarios con filtros (paginado)
router.get('/users', authenticateClerkToken, getUsersWithFilters);

// Actualizar usuario
router.put('/users/:id', authenticateClerkToken, updateUser);

// Desactivar usuario
router.delete('/users/:id', authenticateClerkToken, deactivateUser);

// Obtener usuario con perfil
router.get('/users/:userId/profile', authenticateClerkToken, getUserWithProfile);

// ============================================
// PERFIL ESTUDIANTE ROUTES
// ============================================

// Crear perfil de estudiante
router.post('/perfil-estudiante', authenticateClerkToken, createPerfilEstudiante);

// Obtener perfil de estudiante por usuario ID
router.get('/perfil-estudiante/:usuarioId', authenticateClerkToken, getPerfilEstudianteByUserId);

// Actualizar perfil de estudiante
router.put('/perfil-estudiante/:usuarioId', authenticateClerkToken, updatePerfilEstudiante);

// Actualizar streak de estudiante
router.patch('/perfil-estudiante/:usuarioId/streak', authenticateClerkToken, updateStreakEstudiante);

// Agregar experiencia a estudiante
router.patch('/perfil-estudiante/:usuarioId/experiencia', authenticateClerkToken, addExperienciaEstudiante);

// ============================================
// ADMIN ROUTES
// ============================================

// Verificar credenciales de administrador
router.post('/admin/verify', verifyAdminCredentials);

// ============================================
// STATISTICS ROUTES
// ============================================

// Obtener estadísticas de usuarios
router.get('/estadisticas/usuarios', authenticateClerkToken, getEstadisticasUsuarios);

// Obtener top estudiantes por experiencia
router.get('/estadisticas/top-estudiantes', authenticateClerkToken, getTopEstudiantesPorExperiencia);

export default router;