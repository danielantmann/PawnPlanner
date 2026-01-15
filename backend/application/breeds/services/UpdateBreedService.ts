import { inject, injectable } from 'tsyringe';
import { IBreedRepository } from '../../../core/breeds/domain/IBreedRepository';
import { BreedResponseDTO } from '../dto/BreedResponseDTO';
import { BreedMapper } from '../mappers/BreedMapper';
import { NotFoundError } from '../../../shared/errors/NotFoundError';

@injectable()
export class UpdateBreedService {
  constructor(@inject('BreedRepository') private breedRepo: IBreedRepository) {}

  async execute(
    id: number,
    data: Partial<{ name: string }>,
    userId: number
  ): Promise<BreedResponseDTO> {
    // Normalizar nombre si viene
    if (data.name) {
      data.name = data.name.toLowerCase().trim();
    }

    // Intentar actualizar (solo privadas o globales)
    const updated = await this.breedRepo.update(id, data, userId);

    if (!updated) {
      throw new NotFoundError('Breed not found or cannot update global breed');
    }

    return BreedMapper.toDTO(updated);
  }
}
