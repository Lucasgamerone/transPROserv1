import express from 'express';
import { getPlans, subscribeToPlan } from '../controllers/planController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getPlans);
router.post('/subscribe', authMiddleware, subscribeToPlan);

export default router; 