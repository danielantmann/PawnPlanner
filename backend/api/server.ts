import 'reflect-metadata';
import express from 'express';
import { AppDataSource } from '../infrastructure/orm/data-source';
// import petRoutes from './routes/pet.routes'

export async function startServer(port: 3000) {
  try {
    await AppDataSource.initialize();
    console.log('📦 Database connected');

    const app = express();

    //Routes

    //  app.use("/pets", petsRoutes);
    app.get('/ping', (req, res) => {
      res.send('pong 🏓');
    });

    app.listen(port, () => {
      console.log(`🚀 Server running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error('❌ Error starting server:', error);
  }
}

startServer(3000);
