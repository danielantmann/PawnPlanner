import 'reflect-metadata';
import app from './app';
import { AppDataSource } from '../infrastructure/orm/data-source';

async function startServer(port: number = 3000) {
  try {
    await AppDataSource.initialize();
    console.log('📦 Database connected');

    // Cargar contenedor DESPUÉS de inicializar el DataSource
    await import('../container');

    app.listen(port, () => {
      console.log(`🚀 Server running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error('❌ Error starting server:', error);
  }
}

startServer();
