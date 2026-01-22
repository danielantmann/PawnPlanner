import { inject, injectable } from 'tsyringe';
import { IServiceRepository } from '../../../core/services/domain/IServiceRepository';
import { UpdateServiceDTO } from '../dto/UpdateServiceDTO';
import { NotFoundError } from '../../../shared/errors/NotFoundError';
import { BadRequestError } from '../../../shared/errors/BadRequestError';
import { ForbiddenError } from '../../../shared/errors/ForbiddenError';
import { Service } from '../../../core/services/domain/Service';

@injectable()
export class UpdateServiceService {
  constructor(
    @inject('ServiceRepository')
    private readonly services: IServiceRepository
  ) {}

  async execute(id: number, data: UpdateServiceDTO, userId: number): Promise<Service> {
    const existing = await this.services.findById(id, userId);
    if (!existing) {
      throw new NotFoundError('Service not found');
    }

    if (existing.userId === null) {
      throw new ForbiddenError('Global services cannot be updated');
    }

    if (data.name !== undefined && data.name.trim() === '') {
      throw new BadRequestError('Service name cannot be empty');
    }

    if (data.price !== undefined && data.price < 0) {
      throw new BadRequestError('Price must be greater or equal to 0');
    }

    const updated = new Service(
      existing.id,
      data.name ?? existing.name,
      data.price ?? existing.price,
      existing.userId
    );

    const result = await this.services.update(updated);

    if (!result) {
      throw new NotFoundError('Service not found');
    }

    return result;
  }
}
