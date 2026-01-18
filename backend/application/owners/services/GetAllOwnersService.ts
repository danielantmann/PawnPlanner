import { inject, injectable } from 'tsyringe';
import { IOwnerRepository } from '../../../core/owners/domain/IOwnerRepository';
import { OwnerMapper } from '../mappers/OwnerMapper';

@injectable()
export class GetAllOwnersService {
  constructor(@inject('IOwnerRepository') private repo: IOwnerRepository) {}

  async execute(userId: number) {
    const owners = await this.repo.findAll(userId);
    return OwnerMapper.toDTOs(owners);
  }
}
