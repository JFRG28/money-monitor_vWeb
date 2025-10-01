import { Request, Response, NextFunction } from 'express';
import { prisma } from '../index';

// GET /api/catalogos/tipos-gasto - Obtener tipos de gasto
export const getTiposGasto = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tipos = await prisma.tipoGastoItem.findMany({
      orderBy: { nombre: 'asc' }
    });

    res.json({
      success: true,
      data: tipos
    });
  } catch (error) {
    return next(error);
  }
};

// GET /api/catalogos/formas-pago - Obtener formas de pago
export const getFormasPago = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const formas = await prisma.formaPagoItem.findMany({
      orderBy: { nombre: 'asc' }
    });

    res.json({
      success: true,
      data: formas
    });
  } catch (error) {
    return next(error);
  }
};

// GET /api/catalogos/categorias - Obtener categorías
export const getCategorias = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categorias = await prisma.categoriaItem.findMany({
      orderBy: { codigo: 'asc' }
    });

    res.json({
      success: true,
      data: categorias
    });
  } catch (error) {
    return next(error);
  }
};

// POST /api/catalogos/tipos-gasto - Crear tipo de gasto
export const createTipoGasto = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id, nombre, descripcion } = req.body;

    const tipo = await prisma.tipoGastoItem.create({
      data: {
        id,
        nombre,
        descripcion
      }
    });

    res.status(201).json({
      success: true,
      data: tipo,
      message: 'Tipo de gasto creado exitosamente'
    });
  } catch (error) {
    return next(error);
  }
};

// POST /api/catalogos/formas-pago - Crear forma de pago
export const createFormaPago = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id, nombre, descripcion } = req.body;

    const forma = await prisma.formaPagoItem.create({
      data: {
        id,
        nombre,
        descripcion
      }
    });

    res.status(201).json({
      success: true,
      data: forma,
      message: 'Forma de pago creada exitosamente'
    });
  } catch (error) {
    return next(error);
  }
};

// POST /api/catalogos/categorias - Crear categoría
export const createCategoria = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id, codigo, descripcion } = req.body;

    const categoria = await prisma.categoriaItem.create({
      data: {
        id,
        codigo,
        descripcion
      }
    });

    res.status(201).json({
      success: true,
      data: categoria,
      message: 'Categoría creada exitosamente'
    });
  } catch (error) {
    return next(error);
  }
};
