import 'reflect-metadata';
import express from 'express';
import { AppDataSource } from '../infrastructure/orm/data-source';
import '../container';

// Importa tus rutas
import petsRoutes from './routes/pets';
import breedsRoutes from './routes/breeds';
import animalsRoutes from './routes/animals';
import ownersRoutes from './routes/owners';

// Importa tus errores de dominio
import { ValidationError } from '../shared/errors/ValidationError';
import { ConflictError } from '../shared/errors/ConflictError';
import { NotFoundError } from '../shared/errors/NotFoundError';

export async function startServer(port: number = 3000) {
  try {
    // Inicializa la conexión a la DB
    await AppDataSource.initialize();
    console.log('📦 Database connected');

    const queryRunner = AppDataSource.createQueryRunner();
    const tables = await queryRunner.getTables();
    console.log(
      'Tablas en la DB:',
      tables.map((t) => t.name)
    );
    await queryRunner.release();

    const app = express();

    // Middlewares
    app.use(express.json());

    // Rutas
    app.use('/pets', petsRoutes);
    app.use('/breeds', breedsRoutes);
    app.use('/animals', animalsRoutes);
    app.use('/owners', ownersRoutes);

    app.get('/ping', (_req, res) => {
      res.send('pong 🏓');
    });

    // Middleware global de errores
    app.use(
      (err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
        if (err instanceof ValidationError) {
          return res.status(400).json({ error: err.message });
        }
        if (err instanceof ConflictError) {
          return res.status(409).json({ error: err.message });
        }
        if (err instanceof NotFoundError) {
          return res.status(404).json({ error: err.message });
        }

        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
      }
    );

    // Start server
    app.listen(port, () => {
      console.log(`🚀 Server running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error('❌ Error starting server:', error);
  }
}

// Entry point
startServer();
