import 'reflect-metadata';
import { beforeEach, afterAll, vi } from 'vitest';
import { TestDataSource } from '../../infrastructure/orm/data-source.helper';

beforeEach(async () => {
  if (TestDataSource.isInitialized) {
    await TestDataSource.destroy();
  }
  await TestDataSource.initialize();

  vi.clearAllMocks();
  vi.resetAllMocks();
});

afterAll(async () => {
  if (TestDataSource.isInitialized) {
    await TestDataSource.destroy();
  }
});
