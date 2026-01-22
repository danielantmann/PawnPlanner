import { inject, injectable } from 'tsyringe';
import { IServiceRepository } from '../../../core/services/domain/IServiceRepository';
import { NotFoundError } from '../../../shared/errors/NotFoundError';
import { Service } from '../../../core/services/domain/Service';

@injectable()
export class GetServiceByIdService {
  constructor(
    @inject('ServiceRepository')
    private readonly services: IServiceRepository
  ) {}

  async execute(id: number, userId: number): Promise<Service> {
    const service = await this.services.findById(id, userId);

    if (!service) {
      throw new NotFoundError('Service not found');
    }

    return service;
  }
}
