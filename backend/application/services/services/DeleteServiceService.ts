import { inject, injectable } from 'tsyringe';
import { IServiceRepository } from '../../../core/services/domain/IServiceRepository';
import { NotFoundError } from '../../../shared/errors/NotFoundError';
import { ForbiddenError } from '../../../shared/errors/ForbiddenError';

@injectable()
export class DeleteServiceService {
  constructor(
    @inject('ServiceRepository')
    private readonly services: IServiceRepository
  ) {}

  async execute(id: number, userId: number): Promise<void> {
    const existing = await this.services.findById(id, userId);
    if (!existing) {
      throw new NotFoundError('Service not found');
    }

    if (existing.userId === null) {
      throw new ForbiddenError('Global services cannot be deleted');
    }

    await this.services.delete(id, userId);
  }
}
