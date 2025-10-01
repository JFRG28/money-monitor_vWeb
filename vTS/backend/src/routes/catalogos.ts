import { Router, Request, Response } from 'express';
import { TIPOS_GASTO, CATEGORIAS, FORMAS_PAGO, MESES } from '../constants/catalogs';

const router = Router();

/**
 * GET /api/catalogos
 * Obtiene todos los catálogos disponibles
 */
router.get('/', (req: Request, res: Response) => {
  try {
    res.json({
      success: true,
      data: {
        tipos_gasto: TIPOS_GASTO,
        categorias: CATEGORIAS,
        formas_pago: FORMAS_PAGO,
        meses: MESES
      }
    });
  } catch (error) {
    console.error('Error al obtener catálogos:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener los catálogos',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
});

/**
 * GET /api/catalogos/tipos-gasto
 * Obtiene el catálogo de tipos de gasto
 */
router.get('/tipos-gasto', (req: Request, res: Response) => {
  try {
    res.json({
      success: true,
      data: TIPOS_GASTO
    });
  } catch (error) {
    console.error('Error al obtener tipos de gasto:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener los tipos de gasto',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
});

/**
 * GET /api/catalogos/categorias
 * Obtiene el catálogo de categorías
 */
router.get('/categorias', (req: Request, res: Response) => {
  try {
    res.json({
      success: true,
      data: CATEGORIAS
    });
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener las categorías',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
});

/**
 * GET /api/catalogos/formas-pago
 * Obtiene el catálogo de formas de pago
 */
router.get('/formas-pago', (req: Request, res: Response) => {
  try {
    res.json({
      success: true,
      data: FORMAS_PAGO
    });
  } catch (error) {
    console.error('Error al obtener formas de pago:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener las formas de pago',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
});

/**
 * GET /api/catalogos/meses
 * Obtiene el catálogo de meses
 */
router.get('/meses', (req: Request, res: Response) => {
  try {
    res.json({
      success: true,
      data: MESES
    });
  } catch (error) {
    console.error('Error al obtener meses:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener los meses',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
});

export default router;
