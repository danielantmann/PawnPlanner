import 'reflect-metadata';
import app from './app';
import { AppDataSource } from '../infrastructure/orm/data-source';
import { TestDataSource } from '../infrastructure/orm/data-source.helper';

const dataSource = process.env.NODE_ENV === 'test' ? TestDataSource : AppDataSource;

async function startServer(port: number = 3000) {
  try {
    await dataSource.initialize();
    console.log('📦 Database connected');

    app.listen(port, () => {
      console.log(`🚀 Server running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error('❌ Error starting server:', error);
  }
}

startServer();
