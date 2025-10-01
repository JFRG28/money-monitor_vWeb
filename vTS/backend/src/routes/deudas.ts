import express from 'express';
import { 
  getAllDeudas, 
  createDeudaItem, 
  updateDeudaItem, 
  deleteDeudaItem 
} from '../controllers/deudasController';

const router = express.Router();

// GET /api/deudas - Obtener todas las deudas
router.get('/', getAllDeudas);

// POST /api/deudas - Crear nueva deuda
router.post('/', createDeudaItem);

// PUT /api/deudas/:id - Actualizar deuda
router.put('/:id', updateDeudaItem);

// DELETE /api/deudas/:id - Eliminar deuda
router.delete('/:id', deleteDeudaItem);

export default router;
