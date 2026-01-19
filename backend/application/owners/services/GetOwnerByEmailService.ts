import { inject, injectable } from 'tsyringe';
import { IOwnerRepository } from '../../../core/owners/domain/IOwnerRepository';
import { IPetRepository } from '../../../core/pets/domain/IPetRepository';
import { NotFoundError } from '../../../shared/errors/NotFoundError';
import { OwnerWithPetsMapper } from '../mappers/OwnerWithPetsMapper';

@injectable()
export class GetOwnerByEmailService {
  constructor(
    @inject('OwnerRepository') private owners: IOwnerRepository,
    @inject('PetRepository') private pets: IPetRepository
  ) {}

  async execute(email: string, userId: number) {
    const owner = await this.owners.findByEmail(email, userId);

    if (!owner) {
      throw new NotFoundError(`Owner not found with email: ${email}`);
    }

    const ownerPets = await this.pets.findByOwner(owner.id!, userId);

    return OwnerWithPetsMapper.toDTO(owner, ownerPets);
  }
}
