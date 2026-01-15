import { inject, injectable } from 'tsyringe';
import { IAnimalRepository } from '../../../core/animals/domain/IAnimalRepository';
import { NotFoundError } from '../../../shared/errors/NotFoundError';

@injectable()
export class DeleteAnimalService {
  constructor(@inject('AnimalRepository') private repo: IAnimalRepository) {}

  async execute(id: number, userId: number): Promise<void> {
    const deleted = await this.repo.delete(id, userId);

    if (!deleted) {
      throw new NotFoundError(`Animal with id ${id} not found or cannot delete global animal`);
    }
  }
}
