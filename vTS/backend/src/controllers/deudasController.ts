import { Request, Response, NextFunction } from 'express';
import { prisma } from '../index';

// GET /api/deudas - Obtener todas las deudas
export const getAllDeudas = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const deudas = await prisma.deuda.findMany({
      orderBy: { fecha: 'desc' }
    });

    res.json({
      success: true,
      data: deudas
    });
  } catch (error) {
    return next(error);
  }
};

// POST /api/deudas - Crear nueva deuda
export const createDeudaItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { tipo, item, monto, fecha } = req.body;

    const deuda = await prisma.deuda.create({
      data: {
        tipo,
        item,
        monto,
        fecha: new Date(fecha)
      }
    });

    res.status(201).json({
      success: true,
      data: deuda,
      message: 'Deuda creada exitosamente'
    });
  } catch (error) {
    return next(error);
  }
};

// PUT /api/deudas/:id - Actualizar deuda
export const updateDeudaItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (updateData.fecha) {
      updateData.fecha = new Date(updateData.fecha);
    }

    const deuda = await prisma.deuda.update({
      where: { id: parseInt(id) },
      data: updateData
    });

    res.json({
      success: true,
      data: deuda,
      message: 'Deuda actualizada exitosamente'
    });
  } catch (error) {
    return next(error);
  }
};

// DELETE /api/deudas/:id - Eliminar deuda
export const deleteDeudaItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    await prisma.deuda.delete({
      where: { id: parseInt(id) }
    });

    res.json({
      success: true,
      message: 'Deuda eliminada exitosamente'
    });
  } catch (error) {
    return next(error);
  }
};
