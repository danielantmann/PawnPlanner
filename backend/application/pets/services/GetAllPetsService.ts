import { PetResponseDTO } from '../dto/PetResponseDTO';
import { inject, injectable } from 'tsyringe';
import { IPetRepository } from '../../../core/pets/domain/IPetRepository';
import { PetMapper } from '../mappers/PetMapper';

@injectable()
export class GetAllPetService {
  constructor(@inject('PetRepository') private petRepo: IPetRepository) {}

  async execute(): Promise<PetResponseDTO[]> {
    const pets = await this.petRepo.findAll();
    return pets.map(PetMapper.toDTO);
  }
}
