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
 * @openapi
 * /chat/session:
 *   post:
 *     tags:
 *       - Chat
 *     summary: Crea una nueva sesión de chat
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Sesión creada
 */
router.post('/session', authenticateClerkToken, createChatSession);

/**
 * @openapi
 * /chat/session/{sesionId}:
 *   get:
 *     tags:
 *       - Chat
 *     summary: Obtiene una sesión de chat por ID
 *     parameters:
 *       - in: path
 *         name: sesionId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: tipo
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Sesión
 */
router.get('/session/:sesionId', authenticateClerkToken, getChatSession);

/**
 * @openapi
 * /chat/message:
 *   post:
 *     tags:
 *       - Chat
 *     summary: Envía un mensaje a una sesión existente
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Mensaje enviado
 */
router.post('/message', authenticateClerkToken, sendMessage);

/**
 * @openapi
 * /chat/session/{sesionId}/message:
 *   post:
 *     tags:
 *       - Chat
 *     summary: Envía un mensaje a una sesión específica
 *     parameters:
 *       - in: path
 *         name: sesionId
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
 *         description: Mensaje enviado
 */
router.post('/session/:sesionId/message', authenticateClerkToken, sendMessage);

/**
 * @openapi
 * /chat/sessions:
 *   get:
 *     tags:
 *       - Chat
 *     summary: Obtiene sesiones de chat con filtros
 *     parameters:
 *       - in: query
 *         name: estudiante_id
 *         schema:
 *           type: string
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
 *         description: Lista de sesiones
 */
router.get('/sessions', authenticateClerkToken, getChatSessions);

/**
 * @openapi
 * /chat/session/{sesionId}:
 *   put:
 *     tags:
 *       - Chat
 *     summary: Actualiza una sesión de chat
 *     parameters:
 *       - in: path
 *         name: sesionId
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
 *         description: Sesión actualizada
 */
router.put('/session/:sesionId', authenticateClerkToken, updateChatSession);

/**
 * @openapi
 * /chat/student/{estudianteId}/last-session:
 *   get:
 *     tags:
 *       - Chat
 *     summary: Obtiene la última sesión activa de un estudiante
 *     parameters:
 *       - in: path
 *         name: estudianteId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Última sesión
 */
router.get('/student/:estudianteId/last-session', authenticateClerkToken, getLastActiveSession);

/**
 * @openapi
 * /chat/student/{estudianteId}/session:
 *   post:
 *     tags:
 *       - Chat
 *     summary: Obtiene o crea una sesión de chat para un estudiante
 *     parameters:
 *       - in: path
 *         name: estudianteId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Sesión obtenida o creada
 */
router.post('/student/:estudianteId/session', authenticateClerkToken, getOrCreateSession);

/**
 * @openapi
 * /chat:
 *   post:
 *     tags:
 *       - Chat
 *     summary: Endpoint principal para chatear con el bot
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Respuesta del bot
 */
router.post('/', authenticateClerkToken, chatWithBot);

export default router;


