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
import { normalizeSearch } from '../../../shared/normalizers/normalizeSearch';

@injectable()
export class CreatePetService {
  constructor(
    @inject('PetRepository') private pets: IPetRepository,
    @inject('OwnerRepository') private owners: IOwnerRepository,
    @inject('BreedRepository') private breeds: IBreedRepository,
    @inject('AnimalRepository') private animals: IAnimalRepository
  ) {}

  async execute(dto: CreatePetDTO, userId: number): Promise<PetResponseDTO> {
    const owner = await this.resolveOwner(dto, userId);
    const breed = await this.resolveBreed(dto, userId);

    const pet = new Pet(
      null,
      dto.name,
      normalizeSearch(dto.name),
      dto.birthDate ? new Date(dto.birthDate) : null,
      dto.importantNotes ?? null,
      dto.quickNotes ?? null,
      owner.id!,
      breed.id!,
      userId
    );

    const saved = await this.pets.save(pet);
    return PetMapper.toDTO(saved, owner, breed);
  }

  private async resolveOwner(dto: CreatePetDTO, userId: number) {
    if (dto.ownerId) {
      const owner = await this.owners.findById(dto.ownerId, userId);
      if (!owner) throw new NotFoundError(`Owner with id ${dto.ownerId} not found`);
      return owner;
    }

    if (dto.ownerData) {
      const owner = new Owner(
        null,
        dto.ownerData.name,
        normalizeSearch(dto.ownerData.name),
        dto.ownerData.email,
        dto.ownerData.phone,
        userId
      );
      return await this.owners.create(owner);
    }

    throw new BadRequestError('Owner information is required');
  }

  private async resolveBreed(dto: CreatePetDTO, userId: number) {
    if (dto.breedId) {
      const breed = await this.breeds.findById(dto.breedId, userId);
      if (!breed) throw new NotFoundError(`Breed with id ${dto.breedId} not found`);
      return breed;
    }

    if (dto.breedData) {
      const animal = await this.animals.findById(dto.breedData.animalId, userId);
      if (!animal) throw new NotFoundError(`Animal with id ${dto.breedData.animalId} not found`);

      const breed = new Breed(
        null,
        dto.breedData.name,
        normalizeSearch(dto.breedData.name),
        animal.id!,
        userId
      );

      return await this.breeds.save(breed);
    }

    throw new BadRequestError('Breed information is required');
  }
}
