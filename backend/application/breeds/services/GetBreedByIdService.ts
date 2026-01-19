import { inject, injectable } from 'tsyringe';
import { IBreedRepository } from '../../../core/breeds/domain/IBreedRepository';
import { BreedResponseDTO } from '../dto/BreedResponseDTO';
import { BreedMapper } from '../mappers/BreedMapper';
import { NotFoundError } from '../../../shared/errors/NotFoundError';
import { IAnimalRepository } from '../../../core/animals/domain/IAnimalRepository';

@injectable()
export class GetBreedByIdService {
  constructor(
    @inject('BreedRepository') private breedRepo: IBreedRepository,
    @inject('AnimalRepository') private animalRepo: IAnimalRepository
  ) {}

  async execute(id: number, userId: number): Promise<BreedResponseDTO> {
    const breed = await this.breedRepo.findById(id, userId);
    if (!breed) throw new NotFoundError('Breed not found');

    const animal = await this.animalRepo.findById(breed.animalId, userId);

    return BreedMapper.toDTO(breed, animal);
  }
}
