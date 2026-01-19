import { inject, injectable } from 'tsyringe';
import { IAnimalRepository } from '../../../core/animals/domain/IAnimalRepository';
import { AnimalResponseDTO } from '../dto/AnimalResponseDTO';
import { AnimalMapper } from '../mappers/AnimalMapper';

@injectable()
export class GetAnimalsBySpeciesService {
  constructor(@inject('AnimalRepository') private repo: IAnimalRepository) {}

  async execute(species: string, userId: number): Promise<AnimalResponseDTO[]> {
    const normalized = species.toLowerCase().trim();

    const animals = await this.repo.findBySpecies(normalized, userId);

    return AnimalMapper.toDTOs(animals);
  }
}
