import { injectable, inject } from 'tsyringe';
import { IWorkerRepository } from '../../../core/workers/domain/IWorkerRepository';
import { WorkerMapper } from '../mappers/WorkerMapper';

@injectable()
export class GetAllWorkersService {
  constructor(@inject('WorkerRepository') private workers: IWorkerRepository) {}

  async execute(userId: number) {
    const workers = await this.workers.findAll(userId);
    return workers.map((w) => WorkerMapper.toDTO(w));
  }
}
