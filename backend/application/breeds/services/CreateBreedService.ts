import { injectable, inject } from 'tsyringe';
import { IBreedRepository } from '../../../core/breeds/domain/IBreedRepository';
import { CreateBreedDTO } from '../dto/CreateBreedDTO';
import { BreedResponseDTO } from '../dto/BreedResponseDTO';
import { BreedMapper } from '../mappers/BreedMapper';
import { Breed } from '../../../core/breeds/domain/Breed';
import { IAnimalRepository } from '../../../core/animals/domain/IAnimalRepository';
import { NotFoundError } from '../../../shared/errors/NotFoundError';
import { ConflictError } from '../../../shared/errors/ConflictError';

@injectable()
export class CreateBreedService {
  constructor(
    @inject('BreedRepository') private breedRepo: IBreedRepository,
    @inject('AnimalRepository') private animalRepo: IAnimalRepository
  ) {}

  async execute(dto: CreateBreedDTO, userId: number): Promise<BreedResponseDTO> {
    const animal = await this.animalRepo.findById(dto.animalId, userId);
    if (!animal) throw new NotFoundError('Animal not found');

    const normalizedName = dto.name.toLowerCase();

    const existing = await this.breedRepo.findByNameAndAnimal(normalizedName, dto.animalId, userId);

    if (existing) {
      throw new ConflictError(`Breed '${dto.name}' already exists for this animal`);
    }

    const breed = new Breed();
    breed.name = normalizedName;
    breed.animal = animal;
    breed.userId = userId;

    const saved = await this.breedRepo.save(breed);
    return BreedMapper.toDTO(saved);
  }
}
