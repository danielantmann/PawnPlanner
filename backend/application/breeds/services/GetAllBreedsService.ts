import { inject, injectable } from 'tsyringe';
import { IBreedRepository } from '../../../core/breeds/domain/IBreedRepository';
import { BreedResponseDTO } from '../dto/BreedResponseDTO';
import { BreedMapper } from '../mappers/BreedMapper';

@injectable()
export class GetAllBreedsService {
  constructor(@inject('BreedRepository') private breedRepo: IBreedRepository) {}

  async execute(): Promise<BreedResponseDTO[]> {
    const breeds = await this.breedRepo.findAll();
    return breeds.map(BreedMapper.toDTO);
  }
}
