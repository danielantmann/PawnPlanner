import { inject, injectable } from 'tsyringe';
import { IOwnerRepository } from '../../../core/owners/domain/IOwnerRepository';
import { OwnerMapper } from '../mappers/OwnerMapper';

@injectable()
export class GetOwnerByNameService {
  constructor(@inject('IOwnerRepository') private repo: IOwnerRepository) {}

  async execute(name: string, userId: number) {
    const owners = await this.repo.findByName(name, userId);
    return OwnerMapper.toDTOs(owners);
  }
}
