import { OwnerResponseDTO } from './../dto/OwnerResponseDTO';
import { inject, injectable } from 'tsyringe';
import { IOwnerRepository } from '../../../core/owners/domain/IOwnerRepository';
import { CreateOwnerDTO } from '../dto/CreateOwnerDTO';
import { Owner } from '../../../core/owners/domain/Owner';
import { OwnerMapper } from '../mappers/OwnerMapper';

@injectable()
export class CreateOwnerService {
  constructor(@inject('OwnerRepository') private repo: IOwnerRepository) {}

  async execute(dto: CreateOwnerDTO): Promise<OwnerResponseDTO> {
    const owner = new Owner();
    owner.name = dto.name;
    owner.phone = dto.phone;
    owner.email = dto.email;

    const saved = await this.repo.create(owner);
    return OwnerMapper.toDTO(saved);
  }
}
