import { inject, injectable } from 'tsyringe';
import { IOwnerRepository } from '../../../core/owners/domain/IOwnerRepository';
import { UpdateOwnerDTO } from '../dto/UpdateOwnerDTO';
import { OwnerResponseDTO } from '../dto/OwnerResponseDTO';
import { NotFoundError } from '../../../shared/errors/NotFoundError';
import { ConflictError } from '../../../shared/errors/ConflictError';
import { OwnerMapper } from '../mappers/OwnerMapper';

@injectable()
export class UpdateOwnerService {
  constructor(@inject('OwnerRepository') private repo: IOwnerRepository) {}

  async execute(id: number, dto: UpdateOwnerDTO, userId: number): Promise<OwnerResponseDTO> {
    const owner = await this.repo.findById(id, userId);
    if (!owner) {
      throw new NotFoundError(`Owner with id:${id} not found`);
    }

    if (dto.email) {
      const existingByEmail = await this.repo.findByEmail(dto.email, userId);
      if (existingByEmail && existingByEmail.id !== id) {
        throw new ConflictError(`Owner with email ${dto.email} already exists`);
      }
      owner.email = dto.email;
    }

    if (dto.phone) {
      const existingByPhone = await this.repo.findByPhone(dto.phone, userId);
      if (existingByPhone && existingByPhone.id !== id) {
        throw new ConflictError(`Owner with phone ${dto.phone} already exists`);
      }
      owner.phone = dto.phone;
    }

    if (dto.name) {
      owner.name = dto.name;
    }

    const updated = await this.repo.update(id, owner, userId);
    return OwnerMapper.toDTO(updated!);
  }
}
