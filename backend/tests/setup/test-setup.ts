import 'reflect-metadata';
import { beforeAll, afterAll, beforeEach, vi } from 'vitest';
import { TestDataSource } from '../../infrastructure/orm/data-source.helper';

process.env.NODE_ENV = 'test';
process.env.DB_TYPE = 'sqlite';
process.env.DB_PATH = './data/test.sqlite';
process.env.JWT_SECRET = 'test-secret';
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret';
process.env.JWT_RESET_SECRET = 'test-reset-secret';

beforeAll(async () => {
  if (!TestDataSource.isInitialized) {
    await TestDataSource.initialize();
  }

  await import('../../container');
});

beforeEach(async () => {
  if (TestDataSource.isInitialized) {
    await TestDataSource.dropDatabase();
    await TestDataSource.synchronize();
  }

  vi.clearAllMocks();
  vi.resetAllMocks();
});

afterAll(async () => {
  if (TestDataSource.isInitialized) {
    await TestDataSource.destroy();
  }
});
