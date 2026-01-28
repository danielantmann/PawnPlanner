import { inject, injectable } from 'tsyringe';
import { IBreedRepository } from '../../../core/breeds/domain/IBreedRepository';
import { BreedResponseDTO } from '../dto/BreedResponseDTO';
import { BreedMapper } from '../mappers/BreedMapper';

@injectable()
export class GetAllBreedsService {
  constructor(@inject('BreedRepository') private breedRepo: IBreedRepository) {}

  async execute(userId: number): Promise<BreedResponseDTO[]> {
    const breeds = await this.breedRepo.findAll(userId);
    return breeds.map((b) => BreedMapper.toDTO(b, b.animal));
  }
}
