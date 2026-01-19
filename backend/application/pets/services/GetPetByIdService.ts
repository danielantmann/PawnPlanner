import { inject, injectable } from 'tsyringe';
import { IPetRepository } from '../../../core/pets/domain/IPetRepository';
import { IOwnerRepository } from '../../../core/owners/domain/IOwnerRepository';
import { IBreedRepository } from '../../../core/breeds/domain/IBreedRepository';
import { NotFoundError } from '../../../shared/errors/NotFoundError';
import { PetMapper } from '../mappers/PetMapper';

@injectable()
export class GetPetByIdService {
  constructor(
    @inject('PetRepository') private pets: IPetRepository,
    @inject('OwnerRepository') private owners: IOwnerRepository,
    @inject('BreedRepository') private breeds: IBreedRepository
  ) {}

  async execute(id: number, userId: number) {
    const pet = await this.pets.findById(id, userId);
    if (!pet) throw new NotFoundError('Pet not found');

    const owner = await this.owners.findById(pet.ownerId, userId);
    const breed = await this.breeds.findById(pet.breedId, userId);

    return PetMapper.toDTO(pet, owner, breed);
  }
}
