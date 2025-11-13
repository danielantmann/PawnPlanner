import { injectable, inject } from 'tsyringe';
import { IBreedRepository } from '../../../core/breeds/domain/IBreedRepository';
import { CreateBreedDTO } from '../dto/CreateBreedDTO';
import { BreedResponseDTO } from '../dto/BreedResponseDTO';
import { BreedMapper } from '../mappers/BreedMapper';
import { Breed } from '../../../core/breeds/domain/Breed';
import { NotFoundError } from '../../../shared/errors/NotFoundError';

@injectable()
export class CreateBreedService {
  constructor(@inject('BreedRepository') private breedRepo: IBreedRepository) {}

  async execute(dto: CreateBreedDTO): Promise<BreedResponseDTO> {
    const breed = new Breed();
    breed.name = dto.name;

    // Cuando tengas el repo de Animal:
    // const animal = await this.animalRepo.findById(dto.animalId);
    // if (!animal) throw new NotFoundError("Animal not found");
    // breed.animal = animal;

    const saved = await this.breedRepo.save(breed);
    return BreedMapper.toDTO(saved);
  }
}
