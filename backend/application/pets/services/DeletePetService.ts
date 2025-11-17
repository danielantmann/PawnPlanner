import { injectable, inject } from 'tsyringe';
import { IPetRepository } from '../../../core/pets/domain/IPetRepository';
import { NotFoundError } from '../../../shared/errors/NotFoundError';

@injectable()
export class DeletePetService {
  constructor(@inject('PetRepository') private petRepo: IPetRepository) {}

  async execute(id: number): Promise<void> {
    const pet = await this.petRepo.findById(id);
    if (!pet) {
      throw new NotFoundError(`Pet with id ${id} not found`);
    }

    await this.petRepo.delete(id);
  }
}
