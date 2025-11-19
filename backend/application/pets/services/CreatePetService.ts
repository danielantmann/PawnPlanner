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

@injectable()
export class CreatePetService {
  constructor(
    @inject('PetRepository') private petRepo: IPetRepository,
    @inject('OwnerRepository') private ownerRepo: IOwnerRepository,
    @inject('BreedRepository') private breedRepo: IBreedRepository,
    @inject('AnimalRepository') private animalRepo: IAnimalRepository
  ) {}

  async execute(dto: CreatePetDTO): Promise<PetResponseDTO> {
    // --- Owner ---
    let owner;
    if (dto.ownerId) {
      owner = await this.ownerRepo.findById(dto.ownerId);
      if (!owner) throw new Error(`Owner with id ${dto.ownerId} not found`);
    } else if (dto.ownerData) {
      owner = new Owner();
      owner.name = dto.ownerData.name;
      owner.email = dto.ownerData.email;
      owner.phone = dto.ownerData.phone;
      owner = await this.ownerRepo.create(owner);
    } else {
      throw new Error('Owner information is required');
    }

    // --- Breed ---
    let breed;
    if (dto.breedId) {
      breed = await this.breedRepo.findById(dto.breedId);
      if (!breed) throw new Error(`Breed with id ${dto.breedId} not found`);
    } else if (dto.breedData) {
      breed = new Breed();
      breed.name = dto.breedData.name;

      // Buscar el Animal por id y asignarlo a la relación
      const animal = await this.animalRepo.findById(dto.breedData.animalId);
      if (!animal) throw new Error(`Animal with id ${dto.breedData.animalId} not found`);
      breed.animal = animal;

      breed = await this.breedRepo.save(breed);
    } else {
      throw new Error('Breed information is required');
    }

    // --- Pet ---
    const pet = new Pet();
    pet.name = dto.name;
    if (dto.birthDate) {
      pet.birthDate = new Date(dto.birthDate);
    }
    pet.importantNotes = dto.importantNotes;
    pet.quickNotes = dto.quickNotes;
    pet.owner = owner;
    pet.breed = breed;

    const saved = await this.petRepo.save(pet);
    return PetMapper.toDTO(saved);
  }
}
