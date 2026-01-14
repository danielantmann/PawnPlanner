import { inject, injectable } from 'tsyringe';
import { IPetRepository } from '../../../core/pets/domain/IPetRepository';
import { PetResponseDTO } from '../dto/PetResponseDTO';
import { PetMapper } from '../mappers/PetMapper';

@injectable()
export class GetPetByNameService {
  constructor(@inject('PetRepository') private petRepo: IPetRepository) {}

  async execute(name: string, userId: number): Promise<PetResponseDTO[]> {
    const pets = await this.petRepo.findByName(name, userId);
    return pets.map(PetMapper.toDTO);
  }
}
