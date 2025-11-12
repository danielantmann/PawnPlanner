import { inject, injectable } from 'tsyringe';
import { IPetRepository } from '../../../core/pets/domain/IPetRepository';
import { PetResponseDTO } from '../dto/PetResponseDTO';
import { PetMapper } from '../mappers/PetMapper';

@injectable()
export class GetPetByIdService {
  constructor(@inject('PetRepository') private petRepo: IPetRepository) {}

  async execute(id: number): Promise<PetResponseDTO | null> {
    const pet = await this.petRepo.findById(id);
    return pet ? PetMapper.toDTO(pet) : null;
  }
}
