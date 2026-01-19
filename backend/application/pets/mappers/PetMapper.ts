import { Pet } from '../../../core/pets/domain/Pet';
import { Owner } from '../../../core/owners/domain/Owner';
import { Breed } from '../../../core/breeds/domain/Breed';
import { capitalize } from '../../../shared/utils/stringUtils';
import { PetResponseDTO } from '../dto/PetResponseDTO';

export class PetMapper {
  static toDTO(pet: Pet, owner?: Owner | null, breed?: Breed | null): PetResponseDTO {
    return {
      id: pet.id!,
      name: capitalize(pet.name),
      birthDate: pet.birthDate,
      ownerId: pet.ownerId,
      ownerName: owner ? capitalize(owner.name) : '',
      ownerPhone: owner?.phone ?? '',
      breed: breed ? capitalize(breed.name) : '',
      importantNotes: pet.importantNotes ?? '',
      quickNotes: pet.quickNotes ?? '',
    };
  }
}
