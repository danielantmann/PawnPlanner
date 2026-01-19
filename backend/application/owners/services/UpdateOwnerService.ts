import { inject, injectable } from 'tsyringe';
import { IOwnerRepository } from '../../../core/owners/domain/IOwnerRepository';
import { IPetRepository } from '../../../core/pets/domain/IPetRepository';
import { UpdateOwnerDTO } from '../dto/UpdateOwnerDTO';
import { NotFoundError } from '../../../shared/errors/NotFoundError';
import { ConflictError } from '../../../shared/errors/ConflictError';
import { OwnerWithPetsMapper } from '../mappers/OwnerWithPetsMapper';
import { Owner } from '../../../core/owners/domain/Owner';
import { normalizeSearch } from '../../../shared/normalizers/normalizeSearch';

@injectable()
export class UpdateOwnerService {
  constructor(
    @inject('OwnerRepository') private owners: IOwnerRepository,
    @inject('PetRepository') private pets: IPetRepository
  ) {}

  async execute(id: number, dto: UpdateOwnerDTO, userId: number) {
    const existing = await this.owners.findById(id, userId);
    if (!existing) {
      throw new NotFoundError(`Owner with id:${id} not found`);
    }

    if (dto.email) {
      const dup = await this.owners.findByEmail(dto.email, userId);
      if (dup && dup.id !== id) {
        throw new ConflictError(`Owner with email ${dto.email} already exists`);
      }
    }

    if (dto.phone) {
      const dup = await this.owners.findByPhone(dto.phone, userId);
      if (dup && dup.id !== id) {
        throw new ConflictError(`Owner with phone ${dto.phone} already exists`);
      }
    }

    const updated = new Owner(
      id,
      dto.name ?? existing.name,
      normalizeSearch(dto.name ?? existing.name),
      dto.email ?? existing.email,
      dto.phone ?? existing.phone,
      userId
    );

    const saved = await this.owners.update(id, updated, userId);
    const ownerPets = await this.pets.findByOwner(id, userId);
    
    return OwnerWithPetsMapper.toDTO(saved!, ownerPets);
  }
}
