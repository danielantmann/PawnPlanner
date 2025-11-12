import { inject, injectable } from 'tsyringe';
import { IBreedRepository } from '../../../core/breeds/domain/IBreedRepository';

@injectable()
export class DeleteBreedService {
  constructor(@inject('BreedRepository') private breedRepo: IBreedRepository) {}

  async execute(id: number): Promise<boolean> {
    return await this.breedRepo.delete(id);
  }
}
