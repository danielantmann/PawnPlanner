import { injectable, inject } from 'tsyringe';
import { IBreedRepository } from '../../../core/breeds/domain/IBreedRepository';
import { CreateBreedDTO } from '../dto/CreateBreedDTO';
import { BreedResponseDTO } from '../dto/BreedResponseDTO';
import { BreedMapper } from '../mappers/BreedMapper';
import { Breed } from '../../../core/breeds/domain/Breed';

@injectable()
export class CreateBreedService {
  constructor(@inject('BreedRepository') private breedRepo: IBreedRepository) {}

  async execute(dto: CreateBreedDTO): Promise<BreedResponseDTO> {
    const breed = new Breed();
    breed.name = dto.name;

    // const animal = await this.animalRepo.findById(dto.animalId);
    // if (!animal) throw new Error("Animal not found");
    // breed.animal = animal;

    const saved = await this.breedRepo.save(breed);
    return BreedMapper.toDTO(saved);
  }
}
