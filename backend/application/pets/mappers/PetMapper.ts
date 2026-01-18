import { Pet } from '../../../core/pets/domain/Pet';
import { capitalize } from '../../../shared/utils/stringUtils';
import { PetResponseDTO } from '../dto/PetResponseDTO';

export class PetMapper {
  static toDTO(pet: Pet): PetResponseDTO {
    const { id, name, birthDate, owner, breed, importantNotes, quickNotes } = pet;

    return {
      id,
      name: name ? capitalize(name) : '',
      birthDate,
      ownerId: owner?.id ?? null,
      ownerName: owner ? capitalize(owner.name) : '',
      ownerPhone: owner?.phone ?? '',
      breed: breed ? capitalize(breed.name) : '',
      importantNotes,
      quickNotes,
    };
  }
}
