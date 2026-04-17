import express from 'express';
import { runChat } from '../controllers/aiController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Allow authenticated students/staff to use the AI
router.post('/chat', protect, runChat);

export default router;
