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
import dashboardsRoutes from './routes/dashboards';

import { errorHandler } from './middlewares/errorHandler';
import { setupSwagger } from './swagger';

const app = express();

app.use(express.json());

// Swagger
setupSwagger(app);

// API v1 prefix
const API_PREFIX = '/api/v1';

app.use(`${API_PREFIX}/pets`, petsRoutes);
app.use(`${API_PREFIX}/breeds`, breedsRoutes);
app.use(`${API_PREFIX}/animals`, animalsRoutes);
app.use(`${API_PREFIX}/owners`, ownersRoutes);
app.use(`${API_PREFIX}/appointments`, appointmentsRoutes);
app.use(`${API_PREFIX}/auth`, authRoutes);
app.use(`${API_PREFIX}/users`, usersRoutes);
app.use(`${API_PREFIX}/services`, servicesRoutes);
app.use(`${API_PREFIX}/dashboards`, dashboardsRoutes);

app.get('/ping', (_req, res) => {
  res.send('pong 🏓');
});

app.use(errorHandler);

export default app;
