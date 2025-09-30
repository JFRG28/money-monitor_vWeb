import { Request, Response, NextFunction } from 'express';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let error = { ...err };
  error.message = err.message;

  // Log del error
  console.error('Error:', err);

  // Error de Prisma
  if (err.name === 'PrismaClientKnownRequestError') {
    const message = 'Error en la base de datos';
    error = { message, statusCode: 400 } as AppError;
  }

  // Error de validación de Prisma
  if (err.name === 'PrismaClientValidationError') {
    const message = 'Datos de entrada inválidos';
    error = { message, statusCode: 400 } as AppError;
  }

  // Error de JWT
  if (err.name === 'JsonWebTokenError') {
    const message = 'Token inválido';
    error = { message, statusCode: 401 } as AppError;
  }

  // Error de JWT expirado
  if (err.name === 'TokenExpiredError') {
    const message = 'Token expirado';
    error = { message, statusCode: 401 } as AppError;
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};
