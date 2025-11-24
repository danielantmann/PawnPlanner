import { inject, injectable } from 'tsyringe';
import { IOwnerRepository } from '../../../core/owners/domain/IOwnerRepository';
import { NotFoundError } from '../../../shared/errors/NotFoundError';
import { OwnerMapper } from '../mappers/OwnerMapper';
import { OwnerResponseDTO } from '../dto/OwnerResponseDTO';

@injectable()
export class GetOwnerByNameService {
  constructor(@inject('OwnerRepository') private repo: IOwnerRepository) {}

  async execute(name: string): Promise<OwnerResponseDTO[]> {
    const owners = await this.repo.findByName(name);
    // devolvemos array vacío si no hay coincidencias
    return OwnerMapper.toDTOs(owners);
  }
}
