import { inject, injectable } from 'tsyringe';
import { IOwnerRepository } from '../../../core/owners/domain/IOwnerRepository';
import { UpdateOwnerDTO } from '../dto/UpdateOwnerDTO';
import { OwnerResponseDTO } from '../dto/OwnerResponseDTO';
import { NotFoundError } from '../../../shared/errors/NotFoundError';
import { Owner } from '../../../core/owners/domain/Owner';
import { OwnerMapper } from '../mappers/OwnerMapper';

@injectable()
export class UpdateOwnerService {
  constructor(@inject('OwnerRepository') private repo: IOwnerRepository) {}

  async execute(id: number, dto: UpdateOwnerDTO): Promise<OwnerResponseDTO> {
    const owner = await this.repo.findById(id);
    if (!owner) {
      throw new NotFoundError(`Owner with id:${id} not found`);
    }

    if (dto.name !== undefined) {
      owner.name = dto.name;
    }
    if (dto.phone !== undefined) {
      owner.phone = dto.phone;
    }
    if (dto.email !== undefined) {
      owner.email = dto.email;
    }

    const saved = await this.repo.save(owner);
    return OwnerMapper.toDTO(saved);
  }
}
