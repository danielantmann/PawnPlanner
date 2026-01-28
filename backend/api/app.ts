import 'reflect-metadata';
import express from 'express';

import petsRoutes from './routes/pets';
import breedsRoutes from './routes/breeds';
import animalsRoutes from './routes/animals';
import ownersRoutes from './routes/owners';
import appointmentsRoutes from './routes/appointments';
import authRoutes from './routes/auth';
import usersRoutes from './routes/users';
import servicesRoutes from './routes/services';

import { errorHandler } from './middlewares/errorHandler';
import { setupSwagger } from './swagger'; // <-- AÑADIDO

const app = express();

app.use(express.json());

// Swagger
setupSwagger(app);

app.use('/pets', petsRoutes);
app.use('/breeds', breedsRoutes);
app.use('/animals', animalsRoutes);
app.use('/owners', ownersRoutes);
app.use('/appointments', appointmentsRoutes);
app.use('/auth', authRoutes);
app.use('/users', usersRoutes);
app.use('/services', servicesRoutes);

app.get('/ping', (_req, res) => {
  res.send('pong 🏓');
});

app.use(errorHandler);

export default app;
