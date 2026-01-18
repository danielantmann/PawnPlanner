import 'reflect-metadata';
import express from 'express';
import '../container';

import petsRoutes from './routes/pets';
import breedsRoutes from './routes/breeds';
import animalsRoutes from './routes/animals';
import ownersRoutes from './routes/owners';
import authRoutes from './routes/auth';
import usersRoutes from './routes/users';

import { ConflictError } from '../shared/errors/ConflictError';
import { NotFoundError } from '../shared/errors/NotFoundError';
import { UnauthorizedError } from '../shared/errors/UnauthorizedError';
import { BadRequestError } from '../shared/errors/BadRequestError';
import { ValidationError } from 'class-validator';

const app = express();

// Middlewares
app.use(express.json());

// Rutas
app.use('/pets', petsRoutes);
app.use('/breeds', breedsRoutes);
app.use('/animals', animalsRoutes);
app.use('/owners', ownersRoutes);
app.use('/auth', authRoutes);
app.use('/users', usersRoutes);

app.get('/ping', (_req, res) => {
  res.send('pong 🏓');
});

// ------------------------------
// 🔥 Middleware global de errores
// ------------------------------
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('🔥 Error capturado en middleware:', err);

  // 👉 Helper para aplanar errores anidados de class-validator
  function flattenValidationErrors(errors: any[]) {
    const result: any[] = [];

    const recurse = (error: any, parentPath = '') => {
      const field = parentPath ? `${parentPath}.${error.property}` : error.property;

      if (error.constraints) {
        result.push({
          field,
          constraints: error.constraints,
        });
      }

      if (error.children && error.children.length > 0) {
        error.children.forEach((child: any) => recurse(child, field));
      }
    };

    errors.forEach((e) => recurse(e));
    return result;
  }

  // 1. Errores de class-validator
  if (Array.isArray(err) && err.every((e) => e instanceof ValidationError)) {
    const flatErrors = flattenValidationErrors(err);

    return res.status(400).json({
      status: 400,
      message: 'Validation failed',
      errors: flatErrors,
    });
  }

  // 2. Errores de dominio personalizados
  if (
    err instanceof BadRequestError ||
    err instanceof ConflictError ||
    err instanceof NotFoundError ||
    err instanceof UnauthorizedError
  ) {
    return res.status(err.statusCode).json({
      status: err.statusCode,
      message: err.message,
    });
  }

  // 3. Errores de SQLite (unique constraint)
  if (
    err?.code === 'SQLITE_CONSTRAINT' ||
    err?.driverError?.code === 'SQLITE_CONSTRAINT' ||
    (typeof err.message === 'string' && err.message.includes('SQLITE_CONSTRAINT'))
  ) {
    return res.status(409).json({
      status: 409,
      message: 'Duplicate entry violates unique constraint',
    });
  }

  // 4. Errores inesperados
  return res.status(500).json({
    status: 500,
    message: 'Internal server error',
  });
});

export default app;
