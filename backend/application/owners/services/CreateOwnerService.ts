import { inject, injectable } from 'tsyringe';
import { IOwnerRepository } from '../../../core/owners/domain/IOwnerRepository';
import { CreateOwnerDTO } from '../dto/CreateOwnerDTO';
import { Owner } from '../../../core/owners/domain/Owner';
import { OwnerWithPetsMapper } from '../mappers/OwnerWithPetsMapper';
import { ConflictError } from '../../../shared/errors/ConflictError';
import { normalizeSearch } from '../../../shared/normalizers/normalizeSearch';

@injectable()
export class CreateOwnerService {
  constructor(@inject('OwnerRepository') private repo: IOwnerRepository) {}

  async execute(dto: CreateOwnerDTO) {
    const existingByEmail = await this.repo.findByEmail(dto.email, dto.userId);
    if (existingByEmail) {
      throw new ConflictError(`Owner with email ${dto.email} already exists`);
    }

    const existingByPhone = await this.repo.findByPhone(dto.phone, dto.userId);
    if (existingByPhone) {
      throw new ConflictError(`Owner with phone ${dto.phone} already exists`);
    }

    const owner = new Owner(
      null,
      dto.name,
      normalizeSearch(dto.name),
      dto.email,
      dto.phone,
      dto.userId
    );

    const saved = await this.repo.create(owner);
    // Newly created owner has no pets
    return OwnerWithPetsMapper.toDTO(saved, []);
  }
}
