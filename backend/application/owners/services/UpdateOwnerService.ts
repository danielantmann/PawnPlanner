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

  async execute(id: number, dto: UpdateOwnerDTO): Promise<OwnerResponseDTO> {
    const owner = await this.repo.findById(id);
    if (!owner) {
      throw new NotFoundError(`Owner with id:${id} not found`);
    }

    // comprobación de duplicados antes de actualizar
    if (dto.email) {
      const existingByEmail = await this.repo.findByEmail(dto.email);
      if (existingByEmail && existingByEmail.id !== id) {
        throw new ConflictError(`Owner with email ${dto.email} already exists`);
      }
      owner.email = dto.email;
    }

    if (dto.phone) {
      const existingByPhone = await this.repo.findByPhone(dto.phone);
      if (existingByPhone && existingByPhone.id !== id) {
        throw new ConflictError(`Owner with phone ${dto.phone} already exists`);
      }
      owner.phone = dto.phone;
    }

    if (dto.name) {
      // aquí decides si normalizas o no; si quieres respetar mayúsculas, no toques el valor
      owner.name = dto.name;
    }

    const saved = await this.repo.save(owner);
    return OwnerMapper.toDTO(saved);
  }
}
