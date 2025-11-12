import { IPetRepository } from '../../../core/pets/domain/IPetRepository';

export class DeletePetService {
  constructor(private petRepo: IPetRepository) {}

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
