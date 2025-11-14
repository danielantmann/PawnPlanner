import { inject, injectable } from 'tsyringe';
import { IOwnerRepository } from '../../../core/owners/domain/IOwnerRepository';
import { OwnerResponseDTO } from '../dto/OwnerResponseDTO';
import { NotFoundError } from '../../../shared/errors/NotFoundError';
import { OwnerMapper } from '../mappers/OwnerMapper';

@injectable()
export class GetOwnerByIdService {
  constructor(@inject('OwnerRespostitory') private repo: IOwnerRepository) {}

  async execute(id: number): Promise<OwnerResponseDTO> {
    const owner = await this.repo.findById(id);

    if (!owner) {
      throw new NotFoundError('Owner not found');
    }
    return OwnerMapper.toDTO(owner);
  }
}
