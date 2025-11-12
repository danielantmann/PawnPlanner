import { IPetRepository } from '../../../core/pets/domain/IPetRepository';
// import { IOwnerRepository } from '../../../core/owners/domain/IOwnerRepository';
// import { IBreedRepository } from '../../../core/breeds/domain/IBreedRepository';
import { PetResponseDTO } from '../dto/PetResponseDTO';
import { PetMapper } from '../mappers/PetMapper';
import { UpdatePetDTO } from '../dto/UpdatePetDto';
import { injectable, inject } from 'tsyringe';

@injectable()
export class UpdatePetService {
  constructor(
    @inject('PetRepository') private petRepo: IPetRepository
    // Si luego añades owner y breed:
    // @inject("OwnerRepository") private ownerRepo: IOwnerRepository,
    // @inject("BreedRepository") private breedRepo: IBreedRepository
  ) {}

  async execute(dto: UpdatePetDTO): Promise<PetResponseDTO | null> {
    try {
      const pet = await this.petRepo.findById(dto.id);

      if (!pet) return null;

      if (dto.name !== undefined) pet.name = dto.name;
      if (dto.birthDate !== undefined) pet.birthDate = dto.birthDate;
      if (dto.importantNotes !== undefined) pet.importantNotes = dto.importantNotes;
      if (dto.quickNotes !== undefined) pet.quickNotes = dto.quickNotes;

      //   if (dto.ownerId !== undefined) {
      //     const owner = await this.ownerRepo.findById(dto.ownerId);
      //     if (!owner) throw new Error('Owner not found');
      //     pet.owner = owner;
      //   }

      //   if (dto.breedId !== undefined) {
      //     const breed = await this.breedRepo.findById(dto.breedId);
      //     if (!breed) throw new Error('Breed not found');
      //     pet.breed = breed;
      //   }

      const updated = await this.petRepo.save(pet);
      return PetMapper.toDTO(updated);
    } catch (error) {
      throw new Error('Error updating pet: ' + (error as Error).message);
    }
  }
}
