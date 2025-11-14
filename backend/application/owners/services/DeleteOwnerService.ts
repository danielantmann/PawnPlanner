import { inject, injectable } from 'tsyringe';
import { IOwnerRepository } from '../../../core/owners/domain/IOwnerRepository';
import { NotFoundError } from '../../../shared/errors/NotFoundError';

@injectable()
export class DeleteOwnerService {
  constructor(@inject('OwnerRepository') private repo: IOwnerRepository) {}

  async execute(id: number): Promise<void> {
    const deleted = await this.repo.delete(id);

    if (!deleted) {
      throw new NotFoundError('Owner not found');
    }
  }
}
