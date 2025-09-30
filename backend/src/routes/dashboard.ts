import express from 'express';
import { getDashboardData } from '../controllers/dashboardController';

const router = express.Router();

// GET /api/dashboard - Obtener datos del dashboard
router.get('/', getDashboardData);

export default router;
