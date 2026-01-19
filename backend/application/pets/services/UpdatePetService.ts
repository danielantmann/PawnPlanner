import { IPetRepository } from '../../../core/pets/domain/IPetRepository';
import { IOwnerRepository } from '../../../core/owners/domain/IOwnerRepository';
import { IBreedRepository } from '../../../core/breeds/domain/IBreedRepository';
import { PetResponseDTO } from '../dto/PetResponseDTO';
import { PetMapper } from '../mappers/PetMapper';
import { injectable, inject } from 'tsyringe';
import { NotFoundError } from '../../../shared/errors/NotFoundError';
import { UpdatePetDTO } from '../dto/UpdatePetDTO';
import { normalizeSearch } from '../../../shared/normalizers/normalizeSearch';

@injectable()
export class UpdatePetService {
  constructor(
    @inject('PetRepository') private pets: IPetRepository,
    @inject('OwnerRepository') private owners: IOwnerRepository,
    @inject('BreedRepository') private breeds: IBreedRepository
  ) {}

  async execute(id: number, dto: UpdatePetDTO, userId: number): Promise<PetResponseDTO> {
    const existing = await this.pets.findById(id, userId);
    if (!existing) throw new NotFoundError(`Pet with id ${id} not found`);

    if (dto.name !== undefined) {
      existing.name = dto.name;
      existing.searchName = normalizeSearch(dto.name);
    }

    if (dto.birthDate !== undefined) {
      existing.birthDate = new Date(dto.birthDate);
    }

    if (dto.importantNotes !== undefined) {
      existing.importantNotes = dto.importantNotes;
    }

    if (dto.quickNotes !== undefined) {
      existing.quickNotes = dto.quickNotes;
    }

    const saved = await this.pets.save(existing);

    const owner = await this.owners.findById(saved.ownerId, userId);
    const breed = await this.breeds.findById(saved.breedId, userId);

    return PetMapper.toDTO(saved, owner, breed);
  }
}
