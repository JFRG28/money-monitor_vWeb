import axios from 'axios';
import { API_BASE_URL } from '../constants';

// Tipos locales para evitar problemas de importación
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: any;
}

interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface Gasto {
  id: number;
  concepto: string;
  monto: number;
  tipo_gasto: string;
  forma_pago: string;
  mes: string;
  anio: number;
  fecha_cargo: Date;
  fecha_pago: Date;
  categoria: string;
  a_pagos: boolean;
  no_mens: number;
  total_meses: number;
  tag: string;
  se_divide: boolean;
  gasto_x_mes: string;
  created_at?: Date;
  updated_at?: Date;
}

interface GastoCreateInput {
  concepto: string;
  monto: number;
  tipo_gasto: string;
  forma_pago: string;
  mes: string;
  anio: number;
  fecha_cargo: Date;
  fecha_pago: Date;
  categoria: string;
  a_pagos: boolean;
  no_mens: number;
  total_meses: number;
  tag: string;
  se_divide: boolean;
  gasto_x_mes: string;
}

interface GastoUpdateInput extends Partial<GastoCreateInput> {
  id: number;
}

interface GastoFilters {
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

interface DashboardData {
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

interface BalanceItem {
  id: number;
  tipo: 'D' | 'C';
  concepto: string;
  monto: number;
  deben_ser: number;
  diferencia: number;
  comentarios?: string;
  created_at?: Date;
  updated_at?: Date;
}

interface DeudaItem {
  id: number;
  tipo: 'T' | 'O';
  item: string;
  monto: number;
  fecha: Date;
  created_at?: Date;
  updated_at?: Date;
}

class ApiService {
  private api: any;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Interceptor para manejar errores
    this.api.interceptors.response.use(
      (response: any) => response,
      (error: any) => {
        console.error('API Error:', error);
        return Promise.reject(error);
      }
    );
  }

  // Gastos
  async getGastos(filters?: GastoFilters): Promise<PaginatedResponse<Gasto>> {
    const response = await this.api.get('/gastos', { params: filters });
    return response.data;
  }

  async getGastoById(id: number): Promise<ApiResponse<Gasto>> {
    const response = await this.api.get(`/gastos/${id}`);
    return response.data;
  }

  async createGasto(gasto: GastoCreateInput): Promise<ApiResponse<Gasto>> {
    const response = await this.api.post('/gastos', gasto);
    return response.data;
  }

  async updateGasto(id: number, gasto: GastoUpdateInput): Promise<ApiResponse<Gasto>> {
    const response = await this.api.put(`/gastos/${id}`, gasto);
    return response.data;
  }

  async deleteGasto(id: number): Promise<ApiResponse<void>> {
    const response = await this.api.delete(`/gastos/${id}`);
    return response.data;
  }

  async getGastosMSIMCI(): Promise<ApiResponse<Gasto[]>> {
    const response = await this.api.get('/gastos/msi-mci');
    return response.data;
  }

  // Dashboard
  async getDashboardData(filters?: { año?: number; mes?: string }): Promise<ApiResponse<DashboardData>> {
    const response = await this.api.get('/dashboard', { params: filters });
    return response.data;
  }

  // Balance
  async getBalance(): Promise<ApiResponse<BalanceItem[]>> {
    const response = await this.api.get('/balance');
    return response.data;
  }

  async createBalanceItem(item: Omit<BalanceItem, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<BalanceItem>> {
    const response = await this.api.post('/balance', item);
    return response.data;
  }

  async updateBalanceItem(id: number, item: Partial<BalanceItem>): Promise<ApiResponse<BalanceItem>> {
    const response = await this.api.put(`/balance/${id}`, item);
    return response.data;
  }

  async deleteBalanceItem(id: number): Promise<ApiResponse<void>> {
    const response = await this.api.delete(`/balance/${id}`);
    return response.data;
  }

  // Deudas
  async getDeudas(): Promise<ApiResponse<DeudaItem[]>> {
    const response = await this.api.get('/deudas');
    return response.data;
  }

  async createDeudaItem(item: Omit<DeudaItem, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<DeudaItem>> {
    const response = await this.api.post('/deudas', item);
    return response.data;
  }

  async updateDeudaItem(id: number, item: Partial<DeudaItem>): Promise<ApiResponse<DeudaItem>> {
    const response = await this.api.put(`/deudas/${id}`, item);
    return response.data;
  }

  async deleteDeudaItem(id: number): Promise<ApiResponse<void>> {
    const response = await this.api.delete(`/deudas/${id}`);
    return response.data;
  }

  // Catálogos
  async getCatalogos(): Promise<ApiResponse<any>> {
    const response = await this.api.get('/catalogos');
    return response.data;
  }
}

export default new ApiService();