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

  async execute(dto: UpdateOwnerDTO, id: number): Promise<OwnerResponseDTO> {
    const updated = await this.repo.update(id, {
      name: dto.name,
      phone: dto.phone,
      email: dto.email,
    });

    if (!updated) {
      throw new NotFoundError(`Owner with id:${id} not found`);
    }

    return OwnerMapper.toDTO(updated);
  }
}
