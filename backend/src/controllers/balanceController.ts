import { Request, Response, NextFunction } from 'express';
import { prisma } from '../index';

// GET /api/balance - Obtener todos los items de balance
export const getAllBalance = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const balance = await prisma.balance.findMany({
      orderBy: { created_at: 'desc' }
    });

    res.json({
      success: true,
      data: balance
    });
  } catch (error) {
    return next(error);
  }
};

// POST /api/balance - Crear nuevo item de balance
export const createBalanceItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { tipo, concepto, monto, deben_ser } = req.body;

    const balanceItem = await prisma.balance.create({
      data: {
        tipo,
        concepto,
        monto,
        deben_ser: deben_ser || 0
      }
    });

    res.status(201).json({
      success: true,
      data: balanceItem,
      message: 'Item de balance creado exitosamente'
    });
  } catch (error) {
    return next(error);
  }
};

// PUT /api/balance/:id - Actualizar item de balance
export const updateBalanceItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const balanceItem = await prisma.balance.update({
      where: { id: parseInt(id) },
      data: updateData
    });

    res.json({
      success: true,
      data: balanceItem,
      message: 'Item de balance actualizado exitosamente'
    });
  } catch (error) {
    return next(error);
  }
};

// DELETE /api/balance/:id - Eliminar item de balance
export const deleteBalanceItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    await prisma.balance.delete({
      where: { id: parseInt(id) }
    });

    res.json({
      success: true,
      message: 'Item de balance eliminado exitosamente'
    });
  } catch (error) {
    return next(error);
  }
};
