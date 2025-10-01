import { Request, Response, NextFunction } from 'express';
import { prisma } from '../index';
import { GastoCreateInput, GastoUpdateInput, GastoFilters } from '../types';

// GET /api/gastos - Obtener todos los gastos con filtros
export const getGastosByFilters = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      tipo_gasto,
      categoria,
      forma_pago,
      mes,
      año,
      fecha_desde,
      fecha_hasta,
      a_pagos,
      se_divide,
      tag,
      page = 1,
      limit = 20
    } = req.query;

    // Construir filtros
    const where: any = {};

    if (tipo_gasto) {
      where.tipo_gasto = Array.isArray(tipo_gasto) ? { in: tipo_gasto } : tipo_gasto;
    }

    if (categoria) {
      where.categoria = Array.isArray(categoria) ? { in: categoria } : categoria;
    }

    if (forma_pago) {
      where.forma_pago = Array.isArray(forma_pago) ? { in: forma_pago } : forma_pago;
    }

    if (mes) {
      where.mes = Array.isArray(mes) ? { in: mes } : mes;
    }

    if (año) {
      where.anio = Array.isArray(año) ? { in: año } : parseInt(año as string);
    }

    if (fecha_desde || fecha_hasta) {
      where.fecha_cargo = {};
      if (fecha_desde) where.fecha_cargo.gte = new Date(fecha_desde as string);
      if (fecha_hasta) where.fecha_cargo.lte = new Date(fecha_hasta as string);
    }

    if (a_pagos !== undefined) {
      where.a_pagos = a_pagos === 'true';
    }

    if (se_divide !== undefined) {
      where.se_divide = se_divide === 'true';
    }

    if (tag) {
      where.tag = Array.isArray(tag) ? { in: tag } : tag;
    }

    // Paginación
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    const take = parseInt(limit as string);

    // Obtener gastos
    const [gastos, total] = await Promise.all([
      prisma.gasto.findMany({
        where,
        skip,
        take,
        orderBy: { fecha_cargo: 'desc' }
      }),
      prisma.gasto.count({ where })
    ]);

    res.json({
      success: true,
      data: gastos,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total,
        pages: Math.ceil(total / parseInt(limit as string))
      }
    });
  } catch (error) {
    return next(error);
  }
};

// GET /api/gastos/msi-mci - Obtener gastos MSI/MCI
export const getGastosMSIMCI = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const gastos = await prisma.gasto.findMany({
      where: {
        tipo_gasto: { in: ['MSI', 'Variable'] } // MSI y Variable son los que tienen MSI/MCI
      },
      select: {
        id: true,
        concepto: true,
        monto: true,
        forma_pago: true,
        fecha_cargo: true,
        total_meses: true,
        no_mens: true,
        gasto_x_mes: true,
        tipo_gasto: true
      },
      orderBy: { fecha_cargo: 'desc' }
    });

    res.json({
      success: true,
      data: gastos
    });
  } catch (error) {
    return next(error);
  }
};

// GET /api/gastos/:id - Obtener gasto por ID
export const getGastoById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const gasto = await prisma.gasto.findUnique({
      where: { id: parseInt(id) }
    });

    if (!gasto) {
    res.status(404).json({
      success: false,
      message: 'Gasto no encontrado'
    });
    return;
  }

    res.json({
      success: true,
      data: gasto
    });
  } catch (error) {
    return next(error);
  }
};

// POST /api/gastos - Crear nuevo gasto
export const createGasto = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const gastoData: GastoCreateInput = req.body;
    
    const gasto = await prisma.gasto.create({
      data: gastoData
    });

    res.status(201).json({
      success: true,
      data: gasto,
      message: 'Gasto creado exitosamente'
    });
  } catch (error) {
    return next(error);
  }
};

// PUT /api/gastos/:id - Actualizar gasto
export const updateGasto = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const gastoData: Partial<GastoCreateInput> = req.body;

    // Verificar que el gasto existe
    const existingGasto = await prisma.gasto.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingGasto) {
      res.status(404).json({
        success: false,
        message: 'Gasto no encontrado'
      });
      return;
    }

    const gasto = await prisma.gasto.update({
      where: { id: parseInt(id) },
      data: gastoData
    });

    res.json({
      success: true,
      data: gasto,
      message: 'Gasto actualizado exitosamente'
    });
  } catch (error) {
    return next(error);
  }
};

// DELETE /api/gastos/:id - Eliminar gasto
export const deleteGasto = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    // Verificar que el gasto existe
    const existingGasto = await prisma.gasto.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingGasto) {
      res.status(404).json({
        success: false,
        message: 'Gasto no encontrado'
      });
      return;
    }

    await prisma.gasto.delete({
      where: { id: parseInt(id) }
    });

    res.json({
      success: true,
      message: 'Gasto eliminado exitosamente'
    });
  } catch (error) {
    return next(error);
  }
};
