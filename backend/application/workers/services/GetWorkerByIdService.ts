import { injectable, inject } from 'tsyringe';
import { IWorkerRepository } from '../../../core/workers/domain/IWorkerRepository';
import { WorkerMapper } from '../mappers/WorkerMapper';
import { NotFoundError } from '../../../shared/errors/NotFoundError';

@injectable()
export class GetWorkerByIdService {
  constructor(@inject('WorkerRepository') private workers: IWorkerRepository) {}

  async execute(id: number, userId: number) {
    const worker = await this.workers.findById(id, userId);
    if (!worker) throw new NotFoundError(`Worker with id ${id} not found`);
    return WorkerMapper.toDTO(worker);
  }
}
