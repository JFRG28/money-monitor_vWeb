import express from 'express';
import { 
  getTiposGasto, 
  getFormasPago, 
  getCategorias,
  createTipoGasto,
  createFormaPago,
  createCategoria
} from '../controllers/catalogosController';

const router = express.Router();

// GET /api/catalogos/tipos-gasto - Obtener tipos de gasto
router.get('/tipos-gasto', getTiposGasto);

// GET /api/catalogos/formas-pago - Obtener formas de pago
router.get('/formas-pago', getFormasPago);

// GET /api/catalogos/categorias - Obtener categorías
router.get('/categorias', getCategorias);

// POST /api/catalogos/tipos-gasto - Crear tipo de gasto
router.post('/tipos-gasto', createTipoGasto);

// POST /api/catalogos/formas-pago - Crear forma de pago
router.post('/formas-pago', createFormaPago);

// POST /api/catalogos/categorias - Crear categoría
router.post('/categorias', createCategoria);

export default router;
