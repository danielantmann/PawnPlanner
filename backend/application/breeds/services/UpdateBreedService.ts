import { injectable, inject } from 'tsyringe';
import { IBreedRepository } from '../../../core/breeds/domain/IBreedRepository';
import { UpdateBreedDTO } from '../dto/UpdateBreedDTO';
import { BreedResponseDTO } from '../dto/BreedResponseDTO';
import { BreedMapper } from '../mappers/BreedMapper';
import { NotFoundError } from '../../../shared/errors/NotFoundError';

@injectable()
export class UpdateBreedService {
  constructor(@inject('BreedRepository') private breedRepo: IBreedRepository) {}

  async execute(id: number, dto: UpdateBreedDTO): Promise<BreedResponseDTO> {
    const breed = await this.breedRepo.findById(id);
    if (!breed) {
      throw new NotFoundError(`Breed with id ${id} not found`);
    }

    if (dto.name !== undefined) {
      breed.name = dto.name;
    }
    if (dto.animalId !== undefined) {
      breed.animal = { id: dto.animalId } as any;
    }

    const saved = await this.breedRepo.save(breed);
    return BreedMapper.toDTO(saved);
  }
}
