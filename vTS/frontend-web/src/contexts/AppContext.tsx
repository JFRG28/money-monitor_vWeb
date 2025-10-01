import React, { createContext, useContext, useReducer, useEffect, useCallback, useRef, ReactNode } from 'react';
import apiService from '../services/api';

// Tipos locales para evitar problemas de importación
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

// Estado inicial
interface AppState {
  gastos: Gasto[];
  balance: BalanceItem[];
  deudas: DeudaItem[];
  dashboard: DashboardData | null;
  loading: boolean;
  error: string | null;
  filters: GastoFilters;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  // Estados de carga individuales para evitar bucles
  loadingStates: {
    gastos: boolean;
    balance: boolean;
    deudas: boolean;
    dashboard: boolean;
  };
  // Cache para evitar recargas innecesarias
  lastFetch: {
    gastos: number;
    balance: number;
    deudas: number;
    dashboard: number;
  };
}

const initialState: AppState = {
  gastos: [],
  balance: [],
  deudas: [],
  dashboard: null,
  loading: false,
  error: null,
  filters: {},
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  },
  loadingStates: {
    gastos: false,
    balance: false,
    deudas: false,
    dashboard: false,
  },
  lastFetch: {
    gastos: 0,
    balance: 0,
    deudas: 0,
    dashboard: 0,
  }
};

// Tipos de acciones
type AppAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_GASTOS'; payload: Gasto[] }
  | { type: 'ADD_GASTO'; payload: Gasto }
  | { type: 'UPDATE_GASTO'; payload: Gasto }
  | { type: 'DELETE_GASTO'; payload: number }
  | { type: 'SET_BALANCE'; payload: BalanceItem[] }
  | { type: 'SET_DEUDAS'; payload: DeudaItem[] }
  | { type: 'SET_DASHBOARD'; payload: DashboardData }
  | { type: 'SET_FILTERS'; payload: GastoFilters }
  | { type: 'SET_PAGINATION'; payload: any }
  | { type: 'SET_LOADING_STATE'; payload: { key: keyof AppState['loadingStates']; value: boolean } }
  | { type: 'SET_LAST_FETCH'; payload: { key: keyof AppState['lastFetch']; value: number } };

// Reducer
const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_GASTOS':
      return { ...state, gastos: action.payload };
    case 'ADD_GASTO':
      return { ...state, gastos: [...state.gastos, action.payload] };
    case 'UPDATE_GASTO':
      return {
        ...state,
        gastos: state.gastos.map(gasto =>
          gasto.id === action.payload.id ? action.payload : gasto
        )
      };
    case 'DELETE_GASTO':
      return {
        ...state,
        gastos: state.gastos.filter(gasto => gasto.id !== action.payload)
      };
    case 'SET_BALANCE':
      return { ...state, balance: action.payload };
    case 'SET_DEUDAS':
      return { ...state, deudas: action.payload };
    case 'SET_DASHBOARD':
      return { ...state, dashboard: action.payload };
    case 'SET_FILTERS':
      return { ...state, filters: action.payload };
    case 'SET_PAGINATION':
      return { ...state, pagination: action.payload };
    case 'SET_LOADING_STATE':
      return {
        ...state,
        loadingStates: {
          ...state.loadingStates,
          [action.payload.key]: action.payload.value
        }
      };
    case 'SET_LAST_FETCH':
      return {
        ...state,
        lastFetch: {
          ...state.lastFetch,
          [action.payload.key]: action.payload.value
        }
      };
    default:
      return state;
  }
};

// Contexto
interface AppContextType {
  state: AppState;
  loadGastos: () => Promise<void>;
  loadBalance: () => Promise<void>;
  loadDeudas: () => Promise<void>;
  loadDashboard: () => Promise<void>;
  createGasto: (gasto: any) => Promise<void>;
  updateGasto: (id: number, gasto: any) => Promise<void>;
  deleteGasto: (id: number) => Promise<void>;
  setFilters: (filters: GastoFilters) => void;
  applyFilters: (filters: GastoFilters) => Promise<void>;
  clearError: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const hasLoadedInitialData = useRef(false);

  const loadGastos = useCallback(async () => {
    // Evitar solicitudes duplicadas
    if (state.loadingStates.gastos) {
      console.log('Gastos ya se están cargando, saltando...');
      return;
    }

    // Cache de 60 segundos
    const now = Date.now();
    if (state.lastFetch.gastos > 0 && (now - state.lastFetch.gastos) < 60000) {
      console.log('Gastos en cache, saltando...');
      return;
    }

    console.log('Cargando gastos...');
    try {
      dispatch({ type: 'SET_LOADING_STATE', payload: { key: 'gastos', value: true } });
      dispatch({ type: 'SET_ERROR', payload: null });
      
      const response = await apiService.getGastos(state.filters);
      
      if (response.success) {
        dispatch({ type: 'SET_GASTOS', payload: response.data });
        dispatch({ type: 'SET_PAGINATION', payload: response.pagination });
        dispatch({ type: 'SET_LAST_FETCH', payload: { key: 'gastos', value: now } });
        console.log('Gastos cargados exitosamente');
      } else {
        dispatch({ type: 'SET_ERROR', payload: 'Error al cargar gastos' });
      }
    } catch (error) {
      console.error('Error cargando gastos:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Error al cargar gastos' });
    } finally {
      dispatch({ type: 'SET_LOADING_STATE', payload: { key: 'gastos', value: false } });
    }
  }, []);

  const loadBalance = useCallback(async () => {
    // Evitar solicitudes duplicadas
    if (state.loadingStates.balance) {
      console.log('Balance ya se está cargando, saltando...');
      return;
    }

    // Cache de 60 segundos
    const now = Date.now();
    if (state.lastFetch.balance > 0 && (now - state.lastFetch.balance) < 60000) {
      console.log('Balance en cache, saltando...');
      return;
    }

    console.log('Cargando balance...');
    try {
      dispatch({ type: 'SET_LOADING_STATE', payload: { key: 'balance', value: true } });
      const response = await apiService.getBalance();
      
      if (response.success) {
        dispatch({ type: 'SET_BALANCE', payload: response.data || [] });
        dispatch({ type: 'SET_LAST_FETCH', payload: { key: 'balance', value: now } });
        console.log('Balance cargado exitosamente');
      }
    } catch (error) {
      console.error('Error loading balance:', error);
    } finally {
      dispatch({ type: 'SET_LOADING_STATE', payload: { key: 'balance', value: false } });
    }
  }, []);

  const loadDeudas = useCallback(async () => {
    // Evitar solicitudes duplicadas
    if (state.loadingStates.deudas) {
      console.log('Deudas ya se están cargando, saltando...');
      return;
    }

    // Cache de 60 segundos
    const now = Date.now();
    if (state.lastFetch.deudas > 0 && (now - state.lastFetch.deudas) < 60000) {
      console.log('Deudas en cache, saltando...');
      return;
    }

    console.log('Cargando deudas...');
    try {
      dispatch({ type: 'SET_LOADING_STATE', payload: { key: 'deudas', value: true } });
      const response = await apiService.getDeudas();
      
      if (response.success) {
        dispatch({ type: 'SET_DEUDAS', payload: response.data || [] });
        dispatch({ type: 'SET_LAST_FETCH', payload: { key: 'deudas', value: now } });
        console.log('Deudas cargadas exitosamente');
      }
    } catch (error) {
      console.error('Error loading deudas:', error);
    } finally {
      dispatch({ type: 'SET_LOADING_STATE', payload: { key: 'deudas', value: false } });
    }
  }, []);

  const loadDashboard = useCallback(async () => {
    // Evitar solicitudes duplicadas
    if (state.loadingStates.dashboard) {
      console.log('Dashboard ya se está cargando, saltando...');
      return;
    }

    // Cache de 60 segundos
    const now = Date.now();
    if (state.lastFetch.dashboard > 0 && (now - state.lastFetch.dashboard) < 60000) {
      console.log('Dashboard en cache, saltando...');
      return;
    }

    console.log('Cargando dashboard...');
    try {
      dispatch({ type: 'SET_LOADING_STATE', payload: { key: 'dashboard', value: true } });
      const response = await apiService.getDashboardData();
      
      if (response.success) {
        dispatch({ type: 'SET_DASHBOARD', payload: response.data! });
        dispatch({ type: 'SET_LAST_FETCH', payload: { key: 'dashboard', value: now } });
        console.log('Dashboard cargado exitosamente');
      }
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      dispatch({ type: 'SET_LOADING_STATE', payload: { key: 'dashboard', value: false } });
    }
  }, []);

  const createGasto = async (gasto: any) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await apiService.createGasto(gasto);
      
      if (response.success) {
        dispatch({ type: 'ADD_GASTO', payload: response.data! });
        await loadDashboard(); // Actualizar dashboard
      } else {
        dispatch({ type: 'SET_ERROR', payload: 'Error al crear gasto' });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Error al crear gasto' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const updateGasto = async (id: number, gasto: any) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await apiService.updateGasto(id, gasto);
      
      if (response.success) {
        dispatch({ type: 'UPDATE_GASTO', payload: response.data! });
        await loadDashboard(); // Actualizar dashboard
      } else {
        dispatch({ type: 'SET_ERROR', payload: 'Error al actualizar gasto' });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Error al actualizar gasto' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const deleteGasto = async (id: number) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await apiService.deleteGasto(id);
      
      if (response.success) {
        dispatch({ type: 'DELETE_GASTO', payload: id });
        await loadDashboard(); // Actualizar dashboard
      } else {
        dispatch({ type: 'SET_ERROR', payload: 'Error al eliminar gasto' });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Error al eliminar gasto' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const setFilters = (filters: GastoFilters) => {
    dispatch({ type: 'SET_FILTERS', payload: filters });
  };

  const applyFilters = async (filters: GastoFilters) => {
    dispatch({ type: 'SET_FILTERS', payload: filters });
    // Recargar gastos con los nuevos filtros
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
      
      const response = await apiService.getGastos(filters);
      
      if (response.success) {
        dispatch({ type: 'SET_GASTOS', payload: response.data });
        dispatch({ type: 'SET_PAGINATION', payload: response.pagination });
      } else {
        dispatch({ type: 'SET_ERROR', payload: 'Error al cargar gastos' });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Error al cargar gastos' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const clearError = () => {
    dispatch({ type: 'SET_ERROR', payload: null });
  };

  // Cargar datos iniciales - solo gastos primero
  useEffect(() => {
    // Solo cargar gastos al inicio, sin dependencias
    console.log('useEffect ejecutándose, hasLoadedInitialData:', hasLoadedInitialData.current);
    
    if (!hasLoadedInitialData.current) {
      console.log('Cargando gastos desde useEffect...');
      hasLoadedInitialData.current = true;
      loadGastos();
    }
  }, []); // Sin dependencias para evitar bucles

  // Recargar gastos cuando cambien los filtros - manejado manualmente

  const value: AppContextType = {
    state,
    loadGastos,
    loadBalance,
    loadDeudas,
    loadDashboard,
    createGasto,
    updateGasto,
    deleteGasto,
    setFilters,
    applyFilters,
    clearError
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

// Hook personalizado
export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
