import { injectable, inject } from 'tsyringe';
import { IWorkerRepository } from '../../../core/workers/domain/IWorkerRepository';
import { UpdateWorkerDTO } from '../dto/UpdateWorkerDTO';
import { WorkerMapper } from '../mappers/WorkerMapper';
import { NotFoundError } from '../../../shared/errors/NotFoundError';
import { BadRequestError } from '../../../shared/errors/BadRequestError';

@injectable()
export class UpdateWorkerService {
  constructor(@inject('WorkerRepository') private workers: IWorkerRepository) {}

  async execute(id: number, dto: UpdateWorkerDTO, userId: number) {
    const existing = await this.workers.findById(id, userId);
    if (!existing) throw new NotFoundError(`Worker with id ${id} not found`);

    // Validar nombre si se actualiza
    if (dto.name !== undefined && dto.name.trim().length < 2) {
      throw new BadRequestError('Worker name must be at least 2 characters');
    }

    // Actualizar campos
    if (dto.name !== undefined) existing.name = dto.name.trim();
    if (dto.phone !== undefined) existing.phone = dto.phone;
    if (dto.isActive !== undefined) existing.isActive = dto.isActive;

    const saved = await this.workers.update(existing);
    if (!saved) throw new NotFoundError(`Worker with id ${id} not found`);

    return WorkerMapper.toDTO(saved);
  }
}
