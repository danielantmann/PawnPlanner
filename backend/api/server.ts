import 'reflect-metadata';
import express from 'express';
import { AppDataSource } from '../infrastructure/orm/data-source';

// Import your routes here
import petsRoutes from './routes/pets';
import breedsRouter from './routes/breeds';
export async function startServer(port: number = 3000) {
  try {
    // Initialize database connection
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

    // Routes
    app.use('/pets', petsRoutes);
    app.use('/breed', breedsRouter);

    app.get('/ping', (req, res) => {
      res.send('pong 🏓');
    });

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
