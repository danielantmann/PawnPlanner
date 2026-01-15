import { inject, injectable } from 'tsyringe';
import { IAnimalRepository } from '../../../core/animals/domain/IAnimalRepository';
import { AnimalResponseDTO } from '../dto/AnimalResponseDTO';
import { AnimalMapper } from '../mappers/AnimalMapper';

@injectable()
export class GetAllAnimalsService {
  constructor(@inject('AnimalRepository') private repo: IAnimalRepository) {}

  async execute(userId: number): Promise<AnimalResponseDTO[]> {
    const animals = await this.repo.findAll(userId);
    return AnimalMapper.toDTOs(animals);
  }
}
