/**
 * Catálogos de la aplicación Money Monitor
 * Valores estables que no requieren tabla en BD
 */

export const TIPOS_GASTO = ['Fijo', 'Variable', 'MSI', 'MCI'] as const;
export const CATEGORIAS = ['E', 'I'] as const; // Egreso, Ingreso
export const FORMAS_PAGO = [
  'BBVA Oro',
  'Klar Platino',
  'Mercado Pago',
  'Santander Free',
  'No aplica',
  'Efectivo',
  'Transferencia',
  'TDD NU',
  'TDC NU'
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

export const TAGS = [
  'D',   // Debo
  'MD',  // Me deben
  'NA'   // No aplica
] as const;

// Descripciones de tags (para mostrar en UI)
export const TAG_LABELS: Record<string, string> = {
  'D': 'Debo',
  'MD': 'Me deben',
  'NA': 'No aplica'
};

// Types derivados de las constantes
export type TipoGasto = typeof TIPOS_GASTO[number];
export type Categoria = typeof CATEGORIAS[number];
export type FormaPago = typeof FORMAS_PAGO[number];
export type Mes = typeof MESES[number];
export type Tag = typeof TAGS[number];

// Helpers para validación
export const isTipoGastoValido = (tipo: string): tipo is TipoGasto => {
  return TIPOS_GASTO.includes(tipo as TipoGasto);
};

export const isCategoriaValida = (categoria: string): categoria is Categoria => {
  return CATEGORIAS.includes(categoria as Categoria);
};

export const isFormaPagoValida = (formaPago: string): formaPago is FormaPago => {
  return FORMAS_PAGO.includes(formaPago as FormaPago);
};

export const isMesValido = (mes: string): mes is Mes => {
  return MESES.includes(mes as Mes);
};
