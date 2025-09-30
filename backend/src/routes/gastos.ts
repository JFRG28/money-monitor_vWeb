import express from 'express';
import { 
  getGastoById, 
  createGasto, 
  updateGasto, 
  deleteGasto,
  getGastosMSIMCI,
  getGastosByFilters
} from '../controllers/gastosController';
import { validateGasto } from '../middleware/validation';

const router = express.Router();

// GET /api/gastos - Obtener todos los gastos con filtros
router.get('/', getGastosByFilters);

// GET /api/gastos/msi-mci - Obtener gastos MSI/MCI
router.get('/msi-mci', getGastosMSIMCI);

// GET /api/gastos/:id - Obtener gasto por ID
router.get('/:id', getGastoById);

// POST /api/gastos - Crear nuevo gasto
router.post('/', validateGasto, createGasto);

// PUT /api/gastos/:id - Actualizar gasto
router.put('/:id', validateGasto, updateGasto);

// DELETE /api/gastos/:id - Eliminar gasto
router.delete('/:id', deleteGasto);

export default router;
