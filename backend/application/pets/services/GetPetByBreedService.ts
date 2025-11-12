import { inject, injectable } from 'tsyringe';
import { IPetRepository } from '../../../core/pets/domain/IPetRepository';
import { PetResponseDTO } from '../dto/PetResponseDTO';
import { PetMapper } from '../mappers/PetMapper';

@injectable()
export class GetPetByBreedService {
  constructor(@inject('PetRepository') private petRepo: IPetRepository) {}

  async execute(breeId: number): Promise<PetResponseDTO[]> {
    const pets = await this.petRepo.findByBreed(breeId);
    return pets.map(PetMapper.toDTO);
  }
}
