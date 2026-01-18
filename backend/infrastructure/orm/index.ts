import { AppDataSource } from './data-source';
import { TestDataSource } from './data-source.helper';

export const dataSource = process.env.NODE_ENV === 'test' ? TestDataSource : AppDataSource;
