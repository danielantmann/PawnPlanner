import { IPetRepository } from '../../../core/pets/domain/IPetRepository';
import { PetResponseDTO } from '../dto/PetResponseDTO';
import { PetMapper } from '../mappers/PetMapper';
import { injectable, inject } from 'tsyringe';
import { NotFoundError } from '../../../shared/errors/NotFoundError';
import { UpdatePetDTO } from '../dto/UpdatePetDTO';
import { Pet } from '../../../core/pets/domain/Pet';

@injectable()
export class UpdatePetService {
  constructor(@inject('PetRepository') private petRepo: IPetRepository) {}

  async execute(id: number, dto: UpdatePetDTO, userId: number): Promise<PetResponseDTO> {
    const existing = await this.petRepo.findById(id, userId);
    if (!existing) {
      throw new NotFoundError(`Pet with id ${id} not found`);
    }

    if (dto.name !== undefined) existing.name = dto.name;
    if (dto.birthDate !== undefined) existing.birthDate = new Date(dto.birthDate);
    if (dto.importantNotes !== undefined) existing.importantNotes = dto.importantNotes;
    if (dto.quickNotes !== undefined) existing.quickNotes = dto.quickNotes;

    const updated = await this.petRepo.save(existing);
    return PetMapper.toDTO(updated);
  }
}
