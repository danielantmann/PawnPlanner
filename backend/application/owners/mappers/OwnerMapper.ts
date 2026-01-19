import { Owner } from '../../../core/owners/domain/Owner';
import { Pet } from '../../../core/pets/domain/Pet';
import { capitalize } from '../../../shared/utils/stringUtils';
import { OwnerWithPetsResponseDTO } from '../dto/OwnerWithPetsResponseDTO';

export class OwnerMapper {
  static toDTO(owner: Owner, pets?: Pet[]): OwnerWithPetsResponseDTO {
    return {
      id: owner.id,
      name: capitalize(owner.name),
      email: owner.email,
      phone: owner.phone,
      pets: pets?.map((p) => ({
        id: p.id,
        name: capitalize(p.name),
      })) ?? [],
    };
  }

  static toDTOs(owners: Owner[], petsMap?: Map<number, Pet[]>): OwnerWithPetsResponseDTO[] {
    return owners.map((owner) =>
      this.toDTO(owner, petsMap?.get(owner.id!) ?? undefined)
    );
  }
}
