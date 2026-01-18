import { Owner } from '../../../core/owners/domain/Owner';
import { Pet } from '../../../core/pets/domain/Pet';
import { capitalize } from '../../../shared/utils/stringUtils';
import { OwnerWithPetsResponseDTO } from '../dto/OwnerWithPetsResponseDTO';

export class OwnerWithPetsMapper {
  static toDTO(owner: Owner, pets: Pet[]): OwnerWithPetsResponseDTO {
    return {
      id: owner.id,
      name: capitalize(owner.name),
      email: owner.email,
      phone: owner.phone,
      pets: pets.map((p) => ({
        id: p.id,
        name: capitalize(p.name),
      })),
    };
  }
}
