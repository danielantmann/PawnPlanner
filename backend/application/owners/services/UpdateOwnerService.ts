import { inject, injectable } from 'tsyringe';
import { IOwnerRepository } from '../../../core/owners/domain/IOwnerRepository';
import { UpdateOwnerDTO } from '../dto/UpdateOwnerDTO';
import { NotFoundError } from '../../../shared/errors/NotFoundError';
import { ConflictError } from '../../../shared/errors/ConflictError';
import { OwnerMapper } from '../mappers/OwnerMapper';
import { Owner } from '../../../core/owners/domain/Owner';
import { normalizeSearch } from '../../../shared/normalizers/normalizeSearch';

@injectable()
export class UpdateOwnerService {
  constructor(@inject('IOwnerRepository') private repo: IOwnerRepository) {}

  async execute(id: number, dto: UpdateOwnerDTO, userId: number) {
    const existing = await this.repo.findById(id, userId);
    if (!existing) {
      throw new NotFoundError(`Owner with id:${id} not found`);
    }

    if (dto.email) {
      const dup = await this.repo.findByEmail(dto.email, userId);
      if (dup && dup.id !== id) {
        throw new ConflictError(`Owner with email ${dto.email} already exists`);
      }
    }

    if (dto.phone) {
      const dup = await this.repo.findByPhone(dto.phone, userId);
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

    const saved = await this.repo.update(id, updated, userId);
    return OwnerMapper.toDTO(saved!);
  }
}
