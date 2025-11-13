import { inject, injectable } from 'tsyringe';
import { IAnimalRepository } from '../../../core/animals/domain/IAnimalRepository';
import { AnimalResponseDTO } from '../dto/AnimalResponseDTO';
import { NotFoundError } from '../../../shared/errors/NotFoundError';
import { AnimalMapper } from '../mappers/AnimalMapper';

@injectable()
export class GetAnimalBySpeciesServices {
  constructor(@inject('AnimalRepository') private repo: IAnimalRepository) {}

  async execute(species: string): Promise<AnimalResponseDTO> {
    const animal = await this.repo.findBySpecies(species);

    if (!animal) {
      throw new NotFoundError(`Animal with species:  ${species} not found`);
    }
    return AnimalMapper.toDTO(animal);
  }
}
