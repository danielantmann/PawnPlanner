import { inject, injectable } from 'tsyringe';
import { IAnimalRepository } from '../../../core/animals/domain/IAnimalRepository';
import { NotFoundError } from '../../../shared/errors/NotFoundError';
import { AnimalResponseDTO } from '../dto/AnimalResponseDTO';
import { AnimalMapper } from '../mappers/AnimalMapper';

@injectable()
export class GetAnimalByIdService {
  constructor(@inject('AnimalRepository') private repo: IAnimalRepository) {}

  async execute(id: number, userId: number): Promise<AnimalResponseDTO> {
    const animal = await this.repo.findById(id, userId);

    if (!animal) {
      throw new NotFoundError(`Animal with id ${id} not found`);
    }

    return AnimalMapper.toDTO(animal);
  }
}
