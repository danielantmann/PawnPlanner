import { inject, injectable } from 'tsyringe';
import { IOwnerRepository } from '../../../core/owners/domain/IOwnerRepository';
import { IPetRepository } from '../../../core/pets/domain/IPetRepository';
import { NotFoundError } from '../../../shared/errors/NotFoundError';
import { OwnerMapper } from '../mappers/OwnerMapper';

@injectable()
export class GetOwnerByIdService {
  constructor(
    @inject('OwnerRepository') private owners: IOwnerRepository,
    @inject('PetRepository') private pets: IPetRepository
  ) {}

  async execute(id: number, userId: number) {
    const owner = await this.owners.findById(id, userId);
    if (!owner) {
      throw new NotFoundError('Owner not found');
    }

    const ownerPets = await this.pets.findByOwner(id, userId);

    return OwnerMapper.toDTO(owner, ownerPets);
  }
}
