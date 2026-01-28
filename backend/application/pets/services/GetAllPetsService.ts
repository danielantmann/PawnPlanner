import { PetMapper } from '../mappers/PetMapper';
import { inject, injectable } from 'tsyringe';
import { IPetRepository } from '../../../core/pets/domain/IPetRepository';
import { IOwnerRepository } from '../../../core/owners/domain/IOwnerRepository';
import { IBreedRepository } from '../../../core/breeds/domain/IBreedRepository';

@injectable()
export class GetAllPetsService {
  constructor(
    @inject('PetRepository') private pets: IPetRepository,
    @inject('OwnerRepository') private owners: IOwnerRepository,
    @inject('BreedRepository') private breeds: IBreedRepository
  ) {}

  async execute(userId: number) {
    const list = await this.pets.findAll(userId);

    return Promise.all(
      list.map(async (p) => {
        const owner = await this.owners.findById(p.ownerId, userId);
        const breed = await this.breeds.findById(p.breedId, userId);

        return PetMapper.toDTO(p, owner, breed);
      })
    );
  }
}
