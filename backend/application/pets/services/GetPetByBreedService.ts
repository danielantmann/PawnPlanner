import { inject, injectable } from 'tsyringe';
import { IPetRepository } from '../../../core/pets/domain/IPetRepository';
import { IOwnerRepository } from '../../../core/owners/domain/IOwnerRepository';
import { IBreedRepository } from '../../../core/breeds/domain/IBreedRepository';
import { PetResponseDTO } from '../dto/PetResponseDTO';
import { PetMapper } from '../mappers/PetMapper';

@injectable()
export class GetPetByBreedService {
  constructor(
    @inject('PetRepository') private petRepo: IPetRepository,
    @inject('OwnerRepository') private ownerRepo: IOwnerRepository,
    @inject('BreedRepository') private breedRepo: IBreedRepository
  ) {}

  async execute(breedId: number, userId: number): Promise<PetResponseDTO[]> {
    const pets = await this.petRepo.findByBreed(breedId, userId);

    return Promise.all(
      pets.map(async (p) => {
        const owner = await this.ownerRepo.findById(p.ownerId, userId);
        const breed = await this.breedRepo.findById(p.breedId, userId);

        return PetMapper.toDTO(p, owner, breed);
      })
    );
  }
}
