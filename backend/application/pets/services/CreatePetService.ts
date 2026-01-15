import { IPetRepository } from '../../../core/pets/domain/IPetRepository';
import { IOwnerRepository } from '../../../core/owners/domain/IOwnerRepository';
import { IBreedRepository } from '../../../core/breeds/domain/IBreedRepository';
import { IAnimalRepository } from '../../../core/animals/domain/IAnimalRepository';
import { CreatePetDTO } from '../dto/CreatePetDTO';
import { PetResponseDTO } from '../dto/PetResponseDTO';
import { PetMapper } from '../mappers/PetMapper';
import { Pet } from '../../../core/pets/domain/Pet';
import { Owner } from '../../../core/owners/domain/Owner';
import { Breed } from '../../../core/breeds/domain/Breed';
import { injectable, inject } from 'tsyringe';
import { NotFoundError } from '../../../shared/errors/NotFoundError';
import { BadRequestError } from '../../../shared/errors/BadRequestError';

@injectable()
export class CreatePetService {
  constructor(
    @inject('PetRepository') private petRepo: IPetRepository,
    @inject('OwnerRepository') private ownerRepo: IOwnerRepository,
    @inject('BreedRepository') private breedRepo: IBreedRepository,
    @inject('AnimalRepository') private animalRepo: IAnimalRepository
  ) {}

  async execute(dto: CreatePetDTO, userId: number): Promise<PetResponseDTO> {
    // --- Owner ---
    const owner = await this.resolveOwner(dto, userId);

    // --- Breed ---
    const breed = await this.resolveBreed(dto, userId);

    // --- Pet ---
    const pet = new Pet();
    pet.name = dto.name;
    pet.birthDate = dto.birthDate ? new Date(dto.birthDate) : undefined;
    pet.importantNotes = dto.importantNotes;
    pet.quickNotes = dto.quickNotes;
    pet.owner = owner;
    pet.breed = breed;
    pet.userId = userId;

    const saved = await this.petRepo.save(pet);
    return PetMapper.toDTO(saved);
  }

  private async resolveOwner(dto: CreatePetDTO, userId: number) {
    if (dto.ownerId) {
      const owner = await this.ownerRepo.findById(dto.ownerId, userId);
      if (!owner) throw new NotFoundError(`Owner with id ${dto.ownerId} not found`);
      return owner;
    }

    if (dto.ownerData) {
      const owner = new Owner();
      owner.name = dto.ownerData.name;
      owner.email = dto.ownerData.email;
      owner.phone = dto.ownerData.phone;
      owner.userId = userId;
      return await this.ownerRepo.create(owner);
    }

    throw new BadRequestError('Owner information is required');
  }

  private async resolveBreed(dto: CreatePetDTO, userId: number) {
    if (dto.breedId) {
      const breed = await this.breedRepo.findById(dto.breedId, userId);
      if (!breed) throw new NotFoundError(`Breed with id ${dto.breedId} not found`);
      return breed;
    }

    if (dto.breedData) {
      const breed = new Breed();
      breed.name = dto.breedData.name;
      breed.userId = userId;

      const animal = await this.animalRepo.findById(dto.breedData.animalId, userId);
      if (!animal) throw new NotFoundError(`Animal with id ${dto.breedData.animalId} not found`);

      breed.animal = animal;
      return await this.breedRepo.save(breed);
    }

    throw new BadRequestError('Breed information is required');
  }
}
