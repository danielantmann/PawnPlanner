import { Service } from './Service';

export interface IServiceRepository {
  findById(id: number, userId: number): Promise<Service | null>;
  findAll(userId: number): Promise<Service[]>;
}
