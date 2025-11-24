import { OwnerResponseDTO } from '../dto/OwnerResponseDTO';
import { Owner } from '../../../core/owners/domain/Owner';
import { capitalize } from '../../../shared/utils/stringUtils';

export class OwnerMapper {
  static toDTO(owner: Owner): OwnerResponseDTO {
    return {
      id: owner.id,
      name: capitalize(owner.name),
      email: owner.email,
      phone: owner.phone,
      pets: owner.pets
        ? owner.pets.map((pet) => ({
            id: pet.id,
            name: capitalize(pet.name),
          }))
        : [],
    };
  }

  static toDTOs(owners: Owner[]): OwnerResponseDTO[] {
    return owners.map((owner) => this.toDTO(owner));
  }
}
