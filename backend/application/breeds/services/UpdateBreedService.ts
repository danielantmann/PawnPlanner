import { injectable, inject } from 'tsyringe';
import { IBreedRepository } from '../../../core/breeds/domain/IBreedRepository';
import { UpdateBreedDTO } from '../dto/UpdateBreedDTO';
import { BreedResponseDTO } from '../dto/BreedResponseDTO';
import { BreedMapper } from '../mappers/BreedMapper';
import { Breed } from '../../../core/breeds/domain/Breed';

@injectable()
export class UpdateBreedService {
  constructor(@inject('BreedRepository') private breedRepo: IBreedRepository) {}

  async execute(dto: UpdateBreedDTO): Promise<BreedResponseDTO | null> {
    const breed = new Breed();
    breed.id = dto.id;
    breed.name = dto.name;

    const updated = await this.breedRepo.update(breed);
    return updated ? BreedMapper.toDTO(updated) : null;
  }
}
