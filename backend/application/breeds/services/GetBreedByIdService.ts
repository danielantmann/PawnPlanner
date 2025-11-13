import { inject, injectable } from 'tsyringe';
import { IBreedRepository } from '../../../core/breeds/domain/IBreedRepository';
import { BreedResponseDTO } from '../dto/BreedResponseDTO';
import { BreedMapper } from '../mappers/BreedMapper';
import { NotFoundError } from '../../../shared/errors/NotFoundError';

@injectable()
export class GetBreedByIdService {
  constructor(@inject('BreedRepository') private breedRepo: IBreedRepository) {}

  async execute(id: number): Promise<BreedResponseDTO | null> {
    const breed = await this.breedRepo.findById(id);
    if (!breed) throw new NotFoundError('Breed not found');
    return BreedMapper.toDTO(breed);
  }
}
