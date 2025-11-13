import { OwnerResponseDTO } from '../dto/OwnerResponseDTO';
import { Owner } from '../../../core/owners/domain/Owner';

export class OwnerMapper {
  static toDTO(owner: Owner): OwnerResponseDTO {
    return {
      id: owner.id,
      name: owner.name,
      email: owner.email,
      phone: owner.phone,
      pets: owner.pets
        ? owner.pets.map((pet) => ({
            id: pet.id,
            name: pet.name,
          }))
        : [],
    };
  }

  static toDTOs(owners: Owner[]): OwnerResponseDTO[] {
    return owners.map((owner) => this.toDTO(owner));
  }
}
