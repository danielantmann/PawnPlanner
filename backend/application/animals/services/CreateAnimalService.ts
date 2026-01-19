import { inject, injectable } from 'tsyringe';
import { IAnimalRepository } from '../../../core/animals/domain/IAnimalRepository';
import { IBreedRepository } from '../../../core/breeds/domain/IBreedRepository';
import { CreateAnimalDTO } from '../dto/CreateAnimalDTO';
import { ConflictError } from '../../../shared/errors/ConflictError';
import { Animal } from '../../../core/animals/domain/Animal';
import { AnimalMapper } from '../mappers/AnimalMapper';
import { AnimalResponseDTO } from '../dto/AnimalResponseDTO';

@injectable()
export class CreateAnimalService {
  constructor(
    @inject('AnimalRepository') private animals: IAnimalRepository,
    @inject('BreedRepository') private breeds: IBreedRepository
  ) {}

  async execute(dto: CreateAnimalDTO, userId: number): Promise<AnimalResponseDTO> {
    const normalized = dto.species.toLowerCase().trim();

    const existing = await this.animals.findBySpecies(normalized, userId);
    if (existing.length > 0) {
      throw new ConflictError(`Animal with species '${dto.species}' already exists`);
    }

    const animal = new Animal(null, normalized, userId);

    const saved = await this.animals.create(animal);
    const animalBreeds = await this.breeds.findByAnimal(saved.id!, userId);

    return AnimalMapper.toDTO(saved, animalBreeds);
  }
}
