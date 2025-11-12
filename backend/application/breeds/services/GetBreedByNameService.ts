import { inject, injectable } from 'tsyringe';
import { IBreedRepository } from '../../../core/breeds/domain/IBreedRepository';
import { BreedResponseDTO } from '../dto/BreedResponseDTO';
import { BreedMapper } from '../mappers/BreedMapper';

@injectable()
export class GetBreedByNameService {
  constructor(@inject('BreedRepository') private breedRepo: IBreedRepository) {}

  async execute(name: string): Promise<BreedResponseDTO[]> {
    const breeds = await this.breedRepo.findByName(name);
    return breeds.map(BreedMapper.toDTO);
  }
}
