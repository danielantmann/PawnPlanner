import { IPetRepository } from '../../../core/pets/domain/IPetRepository';
import { PetResponseDTO } from '../dto/PetResponseDTO';
import { PetMapper } from '../mappers/PetMapper';
import { UpdatePetDTO } from '../dto/UpdatePetDTO';
import { injectable, inject } from 'tsyringe';
import { NotFoundError } from '../../../shared/errors/NotFoundError';

@injectable()
export class UpdatePetService {
  constructor(@inject('PetRepository') private petRepo: IPetRepository) {}

  async execute(id: number, dto: UpdatePetDTO): Promise<PetResponseDTO> {
    const updated = await this.petRepo.update(id, {
      name: dto.name,
      birthDate: dto.birthDate ? new Date(dto.birthDate) : undefined,
      importantNotes: dto.importantNotes,
      quickNotes: dto.quickNotes,
      // owner y breed se añadirán más adelante
    });

    if (!updated) {
      throw new NotFoundError(`Pet with id ${id} not found`);
    }

    return PetMapper.toDTO(updated);
  }
}
