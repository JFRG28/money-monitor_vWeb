// Tipos principales basados en la hoja "unificado_v4" del Excel

export interface Gasto {
  id: number;
  concepto: string;
  monto: number;
  tipo_gasto: TipoGasto;
  forma_pago: string;
  mes: string;
  anio: number;
  fecha_cargo: Date;
  fecha_pago: Date;
  categoria: Categoria;
  a_pagos: boolean;
  no_mens: number;
  total_meses: number;
  tag: string;
  se_divide: boolean;
  gasto_x_mes: string;
  created_at?: Date;
  updated_at?: Date;
}

export type TipoGasto = 'MSI' | 'Variable' | 'Fijo';

export type Categoria = 'E' | 'I'; // E = Egreso, I = Ingreso

export interface GastoCreateInput {
  concepto: string;
  monto: number;
  tipo_gasto: TipoGasto;
  forma_pago: string;
  mes: string;
  anio: number;
  fecha_cargo: Date;
  fecha_pago: Date;
  categoria: Categoria;
  a_pagos: boolean;
  no_mens: number;
  total_meses: number;
  tag: string;
  se_divide: boolean;
  gasto_x_mes: string;
}

export interface GastoUpdateInput extends Partial<GastoCreateInput> {
  id: number;
}

export interface GastoFilters {
  tipo_gasto?: TipoGasto[];
  categoria?: Categoria[];
  forma_pago?: string[];
  mes?: string[];
  año?: number[];
  fecha_desde?: Date;
  fecha_hasta?: Date;
  a_pagos?: boolean;
  se_divide?: boolean;
  tag?: string[];
}

// Tipos para las tablas filtradas
export interface GastoMSIMCI extends Pick<Gasto, 
  'id' | 'concepto' | 'monto' | 'forma_pago' | 'fecha_cargo' | 
  'total_meses' | 'no_mens' | 'gasto_x_mes' | 'tipo_gasto'
> {}

// Tipos para el dashboard
export interface DashboardData {
  total_gastos: number;
  total_ingresos: number;
  balance_mensual: number;
  gastos_por_tipo: Record<TipoGasto, number>;
  gastos_por_categoria: Record<Categoria, number>;
  gastos_por_mes: Array<{
    mes: string;
    anio: number;
    total: number;
  }>;
  deuda_total: number;
  diferencia_lulu: number;
}

// Tipos para balance
export interface BalanceItem {
  id: number;
  tipo: 'D' | 'C'; // D = Debe, C = Crédito
  concepto: string;
  monto: number;
  deben_ser: number;
  created_at?: Date;
  updated_at?: Date;
}

// Tipos para deudas
export interface DeudaItem {
  id: number;
  tipo: 'T' | 'O'; // T = Tarjeta, O = Otro
  item: string;
  monto: number;
  fecha: Date;
  created_at?: Date;
  updated_at?: Date;
}

// Tipos para listas/catálogos
export interface TipoGastoItem {
  id: string;
  nombre: TipoGasto;
  descripcion?: string;
}

export interface FormaPagoItem {
  id: string;
  nombre: string;
  descripcion?: string;
}

export interface CategoriaItem {
  id: string;
  codigo: Categoria;
  descripcion: string;
}
