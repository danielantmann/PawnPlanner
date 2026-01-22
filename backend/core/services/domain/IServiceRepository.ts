import { Service } from './Service';

export interface IServiceRepository {
  findById(id: number, userId: number): Promise<Service | null>;
  findAll(userId: number): Promise<Service[]>;

  create(service: Service): Promise<Service>;
  update(service: Service): Promise<Service | null>;
  delete(id: number, userId: number): Promise<void>;
}
