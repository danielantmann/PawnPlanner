import { inject, injectable } from 'tsyringe';
import { IBreedRepository } from '../../../core/breeds/domain/IBreedRepository';
import { NotFoundError } from '../../../shared/errors/NotFoundError';

@injectable()
export class DeleteBreedService {
  constructor(@inject('BreedRepository') private breedRepo: IBreedRepository) {}

  async execute(id: number, userId: number): Promise<void> {
    const deleted = await this.breedRepo.delete(id, userId);
    if (!deleted) {
      throw new NotFoundError('Breed not found or cannot delete global breed');
    }
  }
}
