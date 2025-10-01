import express from 'express';
import { 
  getAllBalance, 
  createBalanceItem, 
  updateBalanceItem, 
  deleteBalanceItem 
} from '../controllers/balanceController';

const router = express.Router();

// GET /api/balance - Obtener todos los items de balance
router.get('/', getAllBalance);

// POST /api/balance - Crear nuevo item de balance
router.post('/', createBalanceItem);

// PUT /api/balance/:id - Actualizar item de balance
router.put('/:id', updateBalanceItem);

// DELETE /api/balance/:id - Eliminar item de balance
router.delete('/:id', deleteBalanceItem);

export default router;
