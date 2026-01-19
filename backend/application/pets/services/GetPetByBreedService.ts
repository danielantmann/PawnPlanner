import { inject, injectable } from 'tsyringe';
import { IPetRepository } from '../../../core/pets/domain/IPetRepository';
import { PetResponseDTO } from '../dto/PetResponseDTO';
import { PetMapper } from '../mappers/PetMapper';

@injectable()
export class GetPetByBreedService {
  constructor(@inject('PetRepository') private petRepo: IPetRepository) {}

  async execute(breedId: number, userId: number): Promise<PetResponseDTO[]> {
    const pets = await this.petRepo.findByBreed(breedId, userId);
    return pets.map((p) => PetMapper.toDTO(p));
  }
}
