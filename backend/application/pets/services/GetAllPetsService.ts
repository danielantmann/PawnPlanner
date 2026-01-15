import { PetResponseDTO } from '../dto/PetResponseDTO';
import { inject, injectable } from 'tsyringe';
import { IPetRepository } from '../../../core/pets/domain/IPetRepository';
import { PetMapper } from '../mappers/PetMapper';

@injectable()
export class GetAllPetsService {
  constructor(@inject('PetRepository') private petRepo: IPetRepository) {}

  async execute(userId: number): Promise<PetResponseDTO[]> {
    const pets = await this.petRepo.findAll(userId);
    return pets.map(PetMapper.toDTO);
  }
}
