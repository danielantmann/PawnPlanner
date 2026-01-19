import { Animal } from '../../../core/animals/domain/Animal';
import { AnimalResponseDTO } from '../dto/AnimalResponseDTO';
import { capitalize } from '../../../shared/utils/stringUtils';

export class AnimalMapper {
  static toDTO(animal: Animal): AnimalResponseDTO {
    return {
      id: animal.id!,
      species: capitalize(animal.species),
    };
  }

  static toDTOs(animals: Animal[]): AnimalResponseDTO[] {
    return animals.map((a) => this.toDTO(a));
  }
}
