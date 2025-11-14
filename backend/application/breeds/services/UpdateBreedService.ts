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
    const updated = await this.breedRepo.update(id, {
      name: dto.name,
      animal: dto.animalId ? ({ id: dto.animalId } as any) : undefined,
    });

    if (!updated) {
      throw new NotFoundError(`Breed with id ${id} not found`);
    }

    return BreedMapper.toDTO(updated);
  }
}
