import express from "express";
import {
  verifyUser,
} from "../controllers/User";

const authenticateClerkToken = require('../middleware/auth');

const router = express.Router();

// Usuario 
router.get('/verifyUser/:userId', authenticateClerkToken, verifyUser);

export default router;
