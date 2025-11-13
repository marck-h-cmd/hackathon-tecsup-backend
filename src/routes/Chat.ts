import express from "express";
import {
  createChatSession,
  getChatSession,
  sendMessage,
  getChatSessions,
  updateChatSession,
  getLastActiveSession,
  getOrCreateSession,
  chatWithBot
} from "../controllers/Chat";

const authenticateClerkToken = require('../middleware/auth');

const router = express.Router();

// ============================================
// RUTAS DE CHAT
// ============================================

/**
 * POST /chat/session
 * Crea una nueva sesión de chat
 */
router.post('/session', authenticateClerkToken, createChatSession);

/**
 * GET /chat/session/:sesionId
 * Obtiene una sesión de chat por ID
 * Query params: ?tipo=tutoria|general
 */
router.get('/session/:sesionId', authenticateClerkToken, getChatSession);

/**
 * POST /chat/message
 * Envía un mensaje a una sesión existente
 * Body: { sesion_id, contenido, tipo?, tipo_sesion?, ai_config? }
 */
router.post('/message', authenticateClerkToken, sendMessage);

/**
 * POST /chat/session/:sesionId/message
 * Envía un mensaje a una sesión específica
 */
router.post('/session/:sesionId/message', authenticateClerkToken, sendMessage);

/**
 * GET /chat/sessions
 * Obtiene sesiones de chat con filtros
 * Query params: estudiante_id, curso_id, tema_id, fecha_inicio, fecha_fin, tipo, page, limit
 */
router.get('/sessions', authenticateClerkToken, getChatSessions);

/**
 * PUT /chat/session/:sesionId
 * Actualiza una sesión de chat
 * Query params: ?tipo=tutoria|general
 */
router.put('/session/:sesionId', authenticateClerkToken, updateChatSession);

/**
 * GET /chat/student/:estudianteId/last-session
 * Obtiene la última sesión activa de un estudiante
 * Query params: ?tipo=tutoria|general
 */
router.get('/student/:estudianteId/last-session', authenticateClerkToken, getLastActiveSession);

/**
 * POST /chat/student/:estudianteId/session
 * Obtiene o crea una sesión de chat para un estudiante
 * Body: { tipo?, curso_id?, tema_id? }
 */
router.post('/student/:estudianteId/session', authenticateClerkToken, getOrCreateSession);

/**
 * POST /chat
 * Endpoint principal para chatear con el bot
 * Obtiene o crea sesión y envía mensaje en una sola llamada
 * Body: { estudiante_id, contenido, tipo?, curso_id?, tema_id?, ai_config? }
 */
router.post('/', authenticateClerkToken, chatWithBot);

export default router;


