import 'reflect-metadata';
import { beforeAll, afterAll, beforeEach, vi } from 'vitest';

// Set NODE_ENV BEFORE any imports that use it
process.env.NODE_ENV = 'test';
process.env.DB_TYPE = 'sqlite';
process.env.DB_PATH = './data/test.sqlite';
process.env.JWT_SECRET = 'test-secret';
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret';
process.env.JWT_RESET_SECRET = 'test-reset-secret';

import { TestDataSource } from '../../infrastructure/orm/data-source.helper';

beforeAll(async () => {
  // Only initialize if not already initialized
  if (!TestDataSource.isInitialized) {
    await TestDataSource.initialize();
  }

  // Cargar contenedor DESPUÉS de inicializar TestDataSource
  await import('../../container');
});

beforeEach(async () => {
  // Only clear if initialized
  if (TestDataSource.isInitialized) {
    const entities = TestDataSource.entityMetadatas;

    for (const entity of entities) {
      const repository = TestDataSource.getRepository(entity.name);
      await repository.clear();
    }
  }

  vi.clearAllMocks();
  vi.resetAllMocks();
});

afterAll(async () => {
  if (TestDataSource.isInitialized) {
    await TestDataSource.destroy();
  }
});
