import { injectable, inject } from 'tsyringe';
import { IBreedRepository } from '../../../core/breeds/domain/IBreedRepository';
import { UpdateBreedDTO } from '../dto/UpdateBreedDTO';
import { BreedResponseDTO } from '../dto/BreedResponseDTO';
import { BreedMapper } from '../mappers/BreedMapper';
import { NotFoundError } from '../../../shared/errors/NotFoundError';

@injectable()
export class UpdateBreedService {
  constructor(@inject('BreedRepository') private breedRepo: IBreedRepository) {}

  async execute(dto: UpdateBreedDTO): Promise<BreedResponseDTO> {
    const breed = await this.breedRepo.findById(dto.id);
    if (!breed) throw new NotFoundError('Breed not found');

    breed.name = dto.name ?? breed.name;

    const updated = await this.breedRepo.update(breed);
    if (!updated) throw new NotFoundError('Breed could not be updated');

    return BreedMapper.toDTO(updated);
  }
}
