// Re-exportar catálogos desde el archivo dedicado
export * from './catalogs';

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const ROUTES = {
  DASHBOARD: '/',
  GASTOS: '/gastos',
  GASTO_FORM: '/gastos/nuevo',
  GASTO_EDIT: '/gastos/editar/:id',
  BALANCE: '/balance',
  DEUDAS: '/deudas',
  CONFIGURACION: '/configuracion'
} as const;

export const STORAGE_KEYS = {
  TOKEN: 'money_monitor_token',
  USER: 'money_monitor_user',
  THEME: 'money_monitor_theme'
} as const;
