import { injectable, inject } from 'tsyringe';
import { IPetRepository } from '../../../core/pets/domain/IPetRepository';

@injectable()
export class DeletePetService {
  constructor(@inject('PetRepository') private petRepo: IPetRepository) {}

  async execute(id: number): Promise<Boolean> {
    try {
      const pet = await this.petRepo.findById(id);
      if (!pet) return false;

      await this.petRepo.delete(id);
      return true;
    } catch (error) {
      throw new Error('Error deleting pet: ' + (error as Error).message);
    }
  }
}
