import { inject, injectable } from 'tsyringe';
import { IAnimalRepository } from '../../../core/animals/domain/IAnimalRepository';
import { UpdateAnimalDTO } from '../dto/UpdateAnimalDTO';
import { NotFoundError } from '../../../shared/errors/NotFoundError';
import { AnimalMapper } from '../mappers/AnimalMapper';
import { AnimalResponseDTO } from '../dto/AnimalResponseDTO';

@injectable()
export class UpdateAnimalService {
  constructor(@inject('AnimalRepository') private repo: IAnimalRepository) {}

  async execute(id: number, dto: UpdateAnimalDTO, userId: number): Promise<AnimalResponseDTO> {
    const updated = await this.repo.update(
      id,
      {
        species: dto.species.toLowerCase().trim(),
      },
      userId
    );

    if (!updated) {
      throw new NotFoundError(`Animal with id ${id} not found or cannot edit global animal`);
    }

    return AnimalMapper.toDTO(updated);
  }
}
