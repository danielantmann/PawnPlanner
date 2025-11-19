import { Pet } from '../../../core/pets/domain/Pet';
import { PetResponseDTO } from '../dto/PetResponseDTO';

export class PetMapper {
  static toDTO(pet: Pet): PetResponseDTO {
    const { id, name, birthDate, owner, breed, importantNotes, quickNotes } = pet;
    return {
      id: id,
      name: name,
      birthDate: birthDate,
      ownerId: owner?.id ?? null,
      ownerName: owner?.name ?? '',
      ownerPhone: owner?.phone ?? '',
      breed: breed?.name ?? '',
      importantNotes: importantNotes,
      quickNotes: quickNotes,
    };
  }
}
