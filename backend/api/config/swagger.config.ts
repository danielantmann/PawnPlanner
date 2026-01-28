import swaggerJsdoc from 'swagger-jsdoc';
import path from 'path';

export const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'PawnPlanner API',
      version: '1.0.0',
      description: 'API documentation for PawnPlanner backend',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },

  apis: [
    path.resolve(__dirname, '../routes/**/*.ts'), // tus rutas reales
    path.resolve(__dirname, '../controllers/**/*.ts'), // si quieres documentar aquí también
  ],
});
