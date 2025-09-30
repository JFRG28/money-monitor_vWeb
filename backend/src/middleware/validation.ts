import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { TIPOS_GASTO, CATEGORIAS } from '../constants';

// Esquema de validación para crear/actualizar gastos
const gastoSchema = Joi.object({
  concepto: Joi.string().min(1).max(255).required().messages({
    'string.empty': 'El concepto es requerido',
    'string.min': 'El concepto debe tener al menos 1 carácter',
    'string.max': 'El concepto no puede tener más de 255 caracteres'
  }),
  monto: Joi.number().positive().precision(2).required().messages({
    'number.positive': 'El monto debe ser positivo',
    'any.required': 'El monto es requerido'
  }),
  tipo_gasto: Joi.string().valid(...TIPOS_GASTO).required().messages({
    'any.only': `El tipo de gasto debe ser uno de: ${TIPOS_GASTO.join(', ')}`,
    'any.required': 'El tipo de gasto es requerido'
  }),
  forma_pago: Joi.string().min(1).max(100).required().messages({
    'string.empty': 'La forma de pago es requerida',
    'string.min': 'La forma de pago debe tener al menos 1 carácter',
    'string.max': 'La forma de pago no puede tener más de 100 caracteres'
  }),
  mes: Joi.string().min(1).max(20).required().messages({
    'string.empty': 'El mes es requerido',
    'string.min': 'El mes debe tener al menos 1 carácter',
    'string.max': 'El mes no puede tener más de 20 caracteres'
  }),
  anio: Joi.number().integer().min(2000).max(2100).required().messages({
    'number.integer': 'El año debe ser un número entero',
    'number.min': 'El año debe ser mayor a 2000',
    'number.max': 'El año debe ser menor a 2100',
    'any.required': 'El año es requerido'
  }),
  fecha_cargo: Joi.date().required().messages({
    'date.base': 'La fecha de cargo debe ser una fecha válida',
    'any.required': 'La fecha de cargo es requerida'
  }),
  fecha_pago: Joi.date().required().messages({
    'date.base': 'La fecha de pago debe ser una fecha válida',
    'any.required': 'La fecha de pago es requerida'
  }),
  categoria: Joi.string().valid(...CATEGORIAS).required().messages({
    'any.only': `La categoría debe ser una de: ${CATEGORIAS.join(', ')}`,
    'any.required': 'La categoría es requerida'
  }),
  a_pagos: Joi.boolean().default(false),
  no_mens: Joi.number().integer().min(0).default(0).messages({
    'number.integer': 'El número de mensualidades debe ser un entero',
    'number.min': 'El número de mensualidades no puede ser negativo'
  }),
  total_meses: Joi.number().integer().min(0).default(0).messages({
    'number.integer': 'El total de meses debe ser un entero',
    'number.min': 'El total de meses no puede ser negativo'
  }),
  tag: Joi.string().max(50).default('NA').messages({
    'string.max': 'El tag no puede tener más de 50 caracteres'
  }),
  se_divide: Joi.boolean().default(false),
  gasto_x_mes: Joi.string().max(20).default('NA').messages({
    'string.max': 'El gasto por mes no puede tener más de 20 caracteres'
  })
});

// Middleware de validación
export const validateGasto = (req: Request, res: Response, next: NextFunction) => {
  const { error, value } = gastoSchema.validate(req.body, { 
    abortEarly: false,
    stripUnknown: true 
  });

  if (error) {
    const errorMessages = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message
    }));

    return res.status(400).json({
      success: false,
      message: 'Datos de entrada inválidos',
      errors: errorMessages
    });
  }

  // Asignar los datos validados al request
  req.body = value;
  return next();
};

// Esquema de validación para filtros
const filtrosSchema = Joi.object({
  tipo_gasto: Joi.alternatives().try(
    Joi.string().valid(...TIPOS_GASTO),
    Joi.array().items(Joi.string().valid(...TIPOS_GASTO))
  ),
  categoria: Joi.alternatives().try(
    Joi.string().valid(...CATEGORIAS),
    Joi.array().items(Joi.string().valid(...CATEGORIAS))
  ),
  forma_pago: Joi.alternatives().try(
    Joi.string(),
    Joi.array().items(Joi.string())
  ),
  mes: Joi.alternatives().try(
    Joi.string(),
    Joi.array().items(Joi.string())
  ),
  anio: Joi.alternatives().try(
    Joi.number().integer(),
    Joi.array().items(Joi.number().integer())
  ),
  fecha_desde: Joi.date(),
  fecha_hasta: Joi.date(),
  a_pagos: Joi.boolean(),
  se_divide: Joi.boolean(),
  tag: Joi.alternatives().try(
    Joi.string(),
    Joi.array().items(Joi.string())
  ),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20)
});

// Middleware de validación para filtros
export const validateFiltros = (req: Request, res: Response, next: NextFunction) => {
  const { error, value } = filtrosSchema.validate(req.query, { 
    abortEarly: false,
    stripUnknown: true 
  });

  if (error) {
    const errorMessages = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message
    }));

    return res.status(400).json({
      success: false,
      message: 'Filtros inválidos',
      errors: errorMessages
    });
  }

  // Asignar los filtros validados al request
  req.query = value;
  return next();
};
