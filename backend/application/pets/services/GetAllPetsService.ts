import { PetMapper } from '../mappers/PetMapper';
import { inject, injectable } from 'tsyringe';
import { IPetRepository } from '../../../core/pets/domain/IPetRepository';

@injectable()
export class GetAllPetsService {
  constructor(@inject('PetRepository') private pets: IPetRepository) {}

  async execute(userId: number) {
    const list = await this.pets.findAll(userId);
    return list.map((p) => PetMapper.toDTO(p));
  }
}
