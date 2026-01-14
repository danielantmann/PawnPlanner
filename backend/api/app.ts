import 'reflect-metadata';
import express from 'express';
import { AppDataSource } from '../infrastructure/orm/data-source';
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
import { ValidationError as ClassValidationError } from 'class-validator';
import { BadRequestError } from '../shared/errors/BadRequestError';

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

// Middleware global de errores
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Error capturado en middleware:', err);

  // Errores de class-validator
  if (Array.isArray(err) && err[0] instanceof ClassValidationError) {
    return res.status(400).json({
      errors: err.map((e) => e.constraints),
    });
  }

  if (err instanceof ConflictError) {
    return res.status(409).json({ error: err.message });
  }
  if (err instanceof NotFoundError) {
    return res.status(404).json({ error: err.message });
  }
  if (err instanceof UnauthorizedError) {
    return res.status(401).json({ error: err.message });
  }

  if (err instanceof BadRequestError) {
    return res.status(err.statusCode).json({ error: err.message });
  }
  if (
    (typeof err.message === 'string' && err.message.includes('SQLITE_CONSTRAINT')) ||
    err.code === 'SQLITE_CONSTRAINT' ||
    err.driverError?.code === 'SQLITE_CONSTRAINT'
  ) {
    return res.status(409).json({ error: 'Duplicate entry violates unique constraint' });
  }

  res.status(500).json({ error: 'Internal server error' });
});

export default app;
