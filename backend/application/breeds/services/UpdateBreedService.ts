import { inject, injectable } from 'tsyringe';
import { IBreedRepository } from '../../../core/breeds/domain/IBreedRepository';
import { BreedResponseDTO } from '../dto/BreedResponseDTO';
import { BreedMapper } from '../mappers/BreedMapper';
import { NotFoundError } from '../../../shared/errors/NotFoundError';
import { IAnimalRepository } from '../../../core/animals/domain/IAnimalRepository';
import { normalizeSearch } from '../../../shared/normalizers/normalizeSearch';

@injectable()
export class UpdateBreedService {
  constructor(
    @inject('BreedRepository') private breedRepo: IBreedRepository,
    @inject('AnimalRepository') private animalRepo: IAnimalRepository
  ) {}

  async execute(
    id: number,
    data: Partial<{ name: string; animalId: number }>,
    userId: number
  ): Promise<BreedResponseDTO> {
    if (data.name) {
      data.name = data.name.toLowerCase().trim();
      (data as any).searchName = normalizeSearch(data.name);
    }

    const updated = await this.breedRepo.update(id, data, userId);
    if (!updated) throw new NotFoundError('Breed not found or cannot update global breed');

    const animal = await this.animalRepo.findById(updated.animalId, userId);

    return BreedMapper.toDTO(updated, animal);
  }
}
