import { Worker } from './Worker';

export interface IWorkerRepository {
  create(worker: Worker): Promise<Worker>;
  update(worker: Worker): Promise<Worker | null>;
  delete(id: number, userId: number): Promise<void>;
  findById(id: number, userId: number): Promise<Worker | null>;
  findAll(userId: number): Promise<Worker[]>;
}
