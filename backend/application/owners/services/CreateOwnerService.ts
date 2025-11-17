import { OwnerResponseDTO } from './../dto/OwnerResponseDTO';
import { inject, injectable } from 'tsyringe';
import { IOwnerRepository } from '../../../core/owners/domain/IOwnerRepository';
import { CreateOwnerDTO } from '../dto/CreateOwnerDTO';
import { Owner } from '../../../core/owners/domain/Owner';
import { OwnerMapper } from '../mappers/OwnerMapper';
import { ConflictError } from '../../../shared/errors/ConflictError';

@injectable()
export class CreateOwnerService {
  constructor(@inject('OwnerRepository') private repo: IOwnerRepository) {}

  async execute(dto: CreateOwnerDTO): Promise<OwnerResponseDTO> {
    // Validar duplicados por email
    const existingByEmail = await this.repo.findByEmail(dto.email);
    if (existingByEmail) {
      throw new ConflictError(`Owner with email ${dto.email} already exists`);
    }

    // Validar duplicados por phone
    const existingByPhone = await this.repo.findByPhone(dto.phone);
    if (existingByPhone) {
      throw new ConflictError(`Owner with phone ${dto.phone} already exists`);
    }

    // Crear nuevo owner
    const owner = new Owner();
    owner.name = dto.name;
    owner.phone = dto.phone;
    owner.email = dto.email;

    const saved = await this.repo.create(owner);
    return OwnerMapper.toDTO(saved);
  }
}
