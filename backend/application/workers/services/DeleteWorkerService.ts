import { injectable, inject } from 'tsyringe';
import { IWorkerRepository } from '../../../core/workers/domain/IWorkerRepository';
import { NotFoundError } from '../../../shared/errors/NotFoundError';

@injectable()
export class DeleteWorkerService {
  constructor(@inject('WorkerRepository') private workers: IWorkerRepository) {}

  async execute(id: number, userId: number) {
    const existing = await this.workers.findById(id, userId);
    if (!existing) throw new NotFoundError(`Worker with id ${id} not found`);

    await this.workers.delete(id, userId);
  }
}
