import { inject, injectable } from 'tsyringe';
import { IServiceRepository } from '../../../core/services/domain/IServiceRepository';
import { Service } from '../../../core/services/domain/Service';

@injectable()
export class GetAllServicesService {
  constructor(
    @inject('ServiceRepository')
    private readonly services: IServiceRepository
  ) {}

  async execute(userId: number): Promise<Service[]> {
    return await this.services.findAll(userId);
  }
}
