// Tipos locales
export interface Gasto {
  id: number;
  concepto: string;
  monto: number;
  tipo_gasto: 'MSI' | 'Variable' | 'Fijo';
  forma_pago: string;
  mes: string;
  anio: number;
  fecha_cargo: Date;
  fecha_pago: Date;
  categoria: 'E' | 'I';
  a_pagos: boolean;
  no_mens: number;
  total_meses: number;
  tag: string;
  se_divide: boolean;
  gasto_x_mes: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface GastoCreateInput {
  concepto: string;
  monto: number;
  tipo_gasto: 'MSI' | 'Variable' | 'Fijo';
  forma_pago: string;
  mes: string;
  anio: number;
  fecha_cargo: Date;
  fecha_pago: Date;
  categoria: 'E' | 'I';
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
  tipo_gasto?: string[];
  categoria?: string[];
  forma_pago?: string[];
  mes?: string[];
  anio?: number[];
  fecha_desde?: Date;
  fecha_hasta?: Date;
  a_pagos?: boolean;
  se_divide?: boolean;
  tag?: string[];
}

export interface DashboardData {
  total_gastos: number;
  total_ingresos: number;
  balance_mensual: number;
  gastos_por_tipo: Record<string, number>;
  gastos_por_categoria: Record<string, number>;
  gastos_por_mes: Array<{
    mes: string;
    anio: number;
    total: number;
  }>;
  deuda_total: number;
  diferencia_lulu: number;
}

export interface BalanceItem {
  id: number;
  tipo: 'D' | 'C';
  concepto: string;
  monto: number;
  deben_ser: number;
  created_at?: Date;
  updated_at?: Date;
}

export interface DeudaItem {
  id: number;
  tipo: 'T' | 'O';
  item: string;
  monto: number;
  fecha: Date;
  created_at?: Date;
  updated_at?: Date;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: any;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
