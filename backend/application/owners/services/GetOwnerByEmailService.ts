import { inject, injectable } from 'tsyringe';
import { IOwnerRepository } from '../../../core/owners/domain/IOwnerRepository';
import { NotFoundError } from '../../../shared/errors/NotFoundError';
import { OwnerMapper } from '../mappers/OwnerMapper';

@injectable()
export class GetOwnerByEmailService {
  constructor(@inject('IOwnerRepository') private repo: IOwnerRepository) {}

  async execute(email: string, userId: number) {
    const owner = await this.repo.findByEmail(email, userId);

    if (!owner) {
      throw new NotFoundError(`Owner not found with email: ${email}`);
    }

    return OwnerMapper.toDTO(owner);
  }
}
