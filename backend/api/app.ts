import 'reflect-metadata';
import express from 'express';
import '../container';

import petsRoutes from './routes/pets';
import breedsRoutes from './routes/breeds';
import animalsRoutes from './routes/animals';
import ownersRoutes from './routes/owners';
import authRoutes from './routes/auth';
import usersRoutes from './routes/users';

import { errorHandler } from './middlewares/errorHandler';

const app = express();

app.use(express.json());

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
app.use(errorHandler);

export default app;
