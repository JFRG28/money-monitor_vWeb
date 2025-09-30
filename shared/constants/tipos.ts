import { TipoGasto, Categoria } from '../types/gasto';

// Constantes basadas en el análisis del Excel
export const TIPOS_GASTO: TipoGasto[] = ['MSI', 'Variable', 'Fijo'];

export const CATEGORIAS: Categoria[] = ['E', 'I'];

export const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

export const FORMAS_PAGO = [
  'BBVA Oro',
  'Klar Platino', 
  'Mercado Pago',
  'Nu débito',
  'Efectivo',
  'TDC Free'
];

export const TAGS = [
  'NA', // No aplica
  'MD', // Medio día
  'F',  // Fijo
  'V',  // Variable
  'MSI', // Meses sin intereses
  'MCI'  // Meses con intereses
];

// Configuración de la aplicación
export const APP_CONFIG = {
  name: 'Money Monitor',
  version: '1.0.0',
  description: 'Sistema de gestión de gastos personales',
  author: 'Paco'
};

// Configuración de la API
export const API_CONFIG = {
  baseUrl: process.env.NODE_ENV === 'production' 
    ? 'https://api.money-monitor.com' 
    : 'http://localhost:3001',
  timeout: 10000,
  retries: 3
};

// Configuración de paginación
export const PAGINATION = {
  defaultPage: 1,
  defaultLimit: 20,
  maxLimit: 100
};

// Configuración de validación
export const VALIDATION = {
  monto: {
    min: 0.01,
    max: 999999.99
  },
  concepto: {
    minLength: 1,
    maxLength: 255
  },
  tag: {
    maxLength: 50
  }
};
