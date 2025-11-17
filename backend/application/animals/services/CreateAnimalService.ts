import { inject, injectable } from 'tsyringe';
import { IAnimalRepository } from '../../../core/animals/domain/IAnimalRepository';
import { CreateAnimalDTO } from '../dto/CreateAnimalDTO';
import { ConflictError } from '../../../shared/errors/ConflictError';
import { Animal } from '../../../core/animals/domain/Animal';
import { AnimalMapper } from '../mappers/AnimalMapper';
import { AnimalResponseDTO } from '../dto/AnimalResponseDTO';

@injectable()
export class CreateAnimalService {
  constructor(@inject('AnimalRepository') private repo: IAnimalRepository) {}

  async execute(dto: CreateAnimalDTO): Promise<AnimalResponseDTO> {
    const existing = await this.repo.findBySpecies(dto.species);

    if (existing) {
      throw new ConflictError(`Animal with species '${dto.species}' already exists`);
    }

    const animal = new Animal();
    animal.species = dto.species.toLowerCase();

    const saved = await this.repo.create(animal);
    return AnimalMapper.toDTO(saved);
  }
}
