import { inject, injectable } from 'tsyringe';
import { IServiceRepository } from '../../../core/services/domain/IServiceRepository';
import { CreateServiceDTO } from '../dto/CreateServiceDTO';
import { Service } from '../../../core/services/domain/Service';
import { BadRequestError } from '../../../shared/errors/BadRequestError';
import { ForbiddenError } from '../../../shared/errors/ForbiddenError';

@injectable()
export class CreateServiceService {
  constructor(
    @inject('ServiceRepository')
    private readonly services: IServiceRepository
  ) {}

  async execute(data: CreateServiceDTO, userId: number): Promise<Service> {
    if (!data.name || data.name.trim() === '') {
      throw new BadRequestError('Service name is required');
    }

    if (data.price < 0) {
      throw new BadRequestError('Price must be greater or equal to 0');
    }

    if (userId === null) {
      throw new ForbiddenError('Global services cannot be created through this endpoint');
    }

    const service = new Service(null, data.name.trim(), data.price, userId);

    return await this.services.create(service);
  }
}
