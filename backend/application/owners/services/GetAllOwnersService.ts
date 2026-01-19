import { inject, injectable } from 'tsyringe';
import { IOwnerRepository } from '../../../core/owners/domain/IOwnerRepository';
import { IPetRepository } from '../../../core/pets/domain/IPetRepository';
import { OwnerWithPetsMapper } from '../mappers/OwnerWithPetsMapper';

@injectable()
export class GetAllOwnersService {
  constructor(
    @inject('OwnerRepository') private owners: IOwnerRepository,
    @inject('PetRepository') private pets: IPetRepository
  ) {}

  async execute(userId: number) {
    const ownerList = await this.owners.findAll(userId);

    return Promise.all(
      ownerList.map(async (owner) => {
        const ownerPets = await this.pets.findByOwner(owner.id!, userId);
        return OwnerWithPetsMapper.toDTO(owner, ownerPets);
      })
    );
  }
}
