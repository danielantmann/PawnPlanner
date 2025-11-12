import { IPetRepository } from '../../../core/pets/domain/IPetRepository';
// import { IOwnerRepository } from '../../../core/owners/domain/IOwnerRepository';
// import { IBreedRepository } from '../../../core/breeds/domain/IBreedRepository';
import { CreatePetDTO } from '../dto/CreatePetDTO';
import { PetResponseDTO } from '../dto/PetResponseDTO';
import { PetMapper } from '../mappers/PetMapper';
import { Pet } from '../../../core/pets/domain/Pet';
import { injectable, inject } from 'tsyringe';

@injectable()
export class CreatePetService {
  constructor(@inject('PetRepository') private petRepo: IPetRepository) {}

  async execute(dto: CreatePetDTO): Promise<PetResponseDTO> {
    try {
      const pet = new Pet();
      pet.name = dto.name;
      pet.birthDate = dto.birthDate;
      pet.importantNotes = dto.importantNotes;
      pet.quickNotes = dto.quickNotes;

      // Buscar owner y breed por id
      //   const owner = await this.ownerRepo.findById(dto.ownerId);
      //   if (!owner) throw new Error('Owner not found');
      //   pet.owner = owner;

      //   const breed = await this.breedRepo.findById(dto.breedId);
      //   if (!breed) throw new Error('Breed not found');
      //   pet.breed = breed;

      const saved = await this.petRepo.save(pet);
      return PetMapper.toDTO(saved);
    } catch (error) {
      throw new Error('Error creating pet: ' + (error as Error).message);
    }
  }
}
