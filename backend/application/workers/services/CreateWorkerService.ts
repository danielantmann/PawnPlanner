import { injectable, inject } from 'tsyringe';
import { IWorkerRepository } from '../../../core/workers/domain/IWorkerRepository';
import { CreateWorkerDTO } from '../dto/CreateWorkerDTO';
import { Worker } from '../../../core/workers/domain/Worker';
import { WorkerMapper } from '../mappers/WorkerMapper';
import { BadRequestError } from '../../../shared/errors/BadRequestError';

@injectable()
export class CreateWorkerService {
  constructor(@inject('WorkerRepository') private workers: IWorkerRepository) {}

  async execute(dto: CreateWorkerDTO, userId: number) {
    // Validar nombre
    if (!dto.name || dto.name.trim().length < 2) {
      throw new BadRequestError('Worker name must be at least 2 characters');
    }

    // Crear dominio
    const worker = new Worker(null, userId, dto.name.trim(), dto.phone);

    // Guardar
    const saved = await this.workers.create(worker);

    // Devolver DTO
    return WorkerMapper.toDTO(saved);
  }
}
