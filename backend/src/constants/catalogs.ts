/**
 * Catálogos de la aplicación Money Monitor
 * Valores estables que no requieren tabla en BD
 */

export const TIPOS_GASTO = ['Fijo', 'Variable', 'MSI', 'MCI'] as const;
export const CATEGORIAS = ['E', 'I'] as const; // Egreso, Ingreso
export const FORMAS_PAGO = [
  'Efectivo',
  'Tarjeta Débito',
  'Tarjeta Crédito',
  'Transferencia',
  'PayPal',
  'Otro'
] as const;

export const MESES = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre'
] as const;

// Types derivados de las constantes
export type TipoGasto = typeof TIPOS_GASTO[number];
export type Categoria = typeof CATEGORIAS[number];
export type FormaPago = typeof FORMAS_PAGO[number];
export type Mes = typeof MESES[number];
