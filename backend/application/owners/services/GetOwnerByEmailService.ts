import { OwnerResponseDTO } from './../dto/OwnerResponseDTO';
import { inject, injectable } from 'tsyringe';
import { IOwnerRepository } from '../../../core/owners/domain/IOwnerRepository';
import { NotFoundError } from '../../../shared/errors/NotFoundError';
import { OwnerMapper } from '../mappers/OwnerMapper';

@injectable()
export class GetOwnerByEmailService {
  constructor(@inject('OwnerRepository') private repo: IOwnerRepository) {}

  async execute(email: string, userId: number): Promise<OwnerResponseDTO> {
    const owner = await this.repo.findByEmail(email, userId);

    if (!owner) {
      throw new NotFoundError(`Owner not found with email: ${email}`);
    }

    return OwnerMapper.toDTO(owner);
  }
}
