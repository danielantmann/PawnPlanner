import { inject, injectable } from 'tsyringe';
import { IBreedRepository } from '../../../core/breeds/domain/IBreedRepository';
import { BreedResponseDTO } from '../dto/BreedResponseDTO';
import { BreedMapper } from '../mappers/BreedMapper';

@injectable()
export class GetBreedsByAnimalService {
  constructor(@inject('BreedRepository') private breedRepo: IBreedRepository) {}

  async execute(animalId: number, userId: number): Promise<BreedResponseDTO[]> {
    const breeds = await this.breedRepo.findByAnimal(animalId, userId);
    return breeds.map((b) => BreedMapper.toDTO(b, b.animal));
  }
}
