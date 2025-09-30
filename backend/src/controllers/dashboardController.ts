import { Request, Response, NextFunction } from 'express';
import { prisma } from '../index';
import { DashboardData } from '../types';

// GET /api/dashboard - Obtener datos del dashboard
export const getDashboardData = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { año, mes } = req.query;

    // Construir filtros de fecha
    const whereClause: any = {};
    if (año) {
      whereClause.anio = parseInt(año as string);
    }
    if (mes) {
      whereClause.mes = mes as string;
    }

    // Obtener datos agregados
    const [
      totalGastos,
      totalIngresos,
      gastosPorTipo,
      gastosPorCategoria,
      gastosPorMes,
      deudaTotal
    ] = await Promise.all([
      // Total de gastos (egresos)
      prisma.gasto.aggregate({
        where: { ...whereClause, categoria: 'E' },
        _sum: { monto: true }
      }),
      // Total de ingresos
      prisma.gasto.aggregate({
        where: { ...whereClause, categoria: 'I' },
        _sum: { monto: true }
      }),
      // Gastos por tipo
      prisma.gasto.groupBy({
        by: ['tipo_gasto'],
        where: { ...whereClause, categoria: 'E' },
        _sum: { monto: true }
      }),
      // Gastos por categoría
      prisma.gasto.groupBy({
        by: ['categoria'],
        where: whereClause,
        _sum: { monto: true }
      }),
      // Gastos por mes
      prisma.gasto.groupBy({
        by: ['mes', 'anio'],
        where: { ...whereClause, categoria: 'E' },
        _sum: { monto: true },
        orderBy: [{ anio: 'asc' }, { mes: 'asc' }]
      }),
      // Total de deudas
      prisma.deuda.aggregate({
        _sum: { monto: true }
      })
    ]);

    // Calcular balance mensual
    const balanceMensual = Number(totalIngresos._sum.monto || 0) - Number(totalGastos._sum.monto || 0);

    // Formatear gastos por tipo
    const gastosPorTipoFormatted = gastosPorTipo.reduce((acc, item) => {
      acc[item.tipo_gasto] = Number(item._sum.monto || 0);
      return acc;
    }, {} as Record<string, number>);

    // Formatear gastos por categoría
    const gastosPorCategoriaFormatted = gastosPorCategoria.reduce((acc, item) => {
      acc[item.categoria] = Number(item._sum.monto || 0);
      return acc;
    }, {} as Record<string, number>);

    // Formatear gastos por mes
    const gastosPorMesFormatted = gastosPorMes.map(item => ({
      mes: item.mes,
      anio: item.anio,
      total: Number(item._sum.monto || 0)
    }));

    // Calcular diferencia con Lulú (esto sería específico de tu lógica de negocio)
    const diferenciaLulu = 0; // Aquí implementarías la lógica específica

    const dashboardData: DashboardData = {
      total_gastos: Number(totalGastos._sum.monto || 0),
      total_ingresos: Number(totalIngresos._sum.monto || 0),
      balance_mensual: balanceMensual,
      gastos_por_tipo: gastosPorTipoFormatted as any,
      gastos_por_categoria: gastosPorCategoriaFormatted as any,
      gastos_por_mes: gastosPorMesFormatted,
      deuda_total: Number(deudaTotal._sum.monto || 0),
      diferencia_lulu: diferenciaLulu
    };

    res.json({
      success: true,
      data: dashboardData
    });
  } catch (error) {
    return next(error);
  }
};
