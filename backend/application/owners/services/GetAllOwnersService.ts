import { inject, injectable } from 'tsyringe';
import { IOwnerRepository } from '../../../core/owners/domain/IOwnerRepository';
import { Owner } from '../../../core/owners/domain/Owner';
import { OwnerResponseDTO } from '../dto/OwnerResponseDTO';
import { OwnerMapper } from '../mappers/OwnerMapper';

@injectable()
export class GetAllOwnersService {
  constructor(@inject('OwnerRepository') private repo: IOwnerRepository) {}

  async execute(userId: number): Promise<OwnerResponseDTO[]> {
    const owners = await this.repo.findAll(userId);
    return OwnerMapper.toDTOs(owners);
  }
}
