import { Animal } from '../../../core/animals/domain/Animal';
import { AnimalResponseDTO } from '../dto/AnimalResponseDTO';

export class AnimalMapper {
  static toDTO(animal: Animal): AnimalResponseDTO {
    return {
      id: animal.id,
      species: animal.species,
      breeds:
        animal.breeds?.map((b) => ({
          id: b.id,
          name: b.name,
        })) ?? [],
    };
  }

  static toDTOs(animals: Animal[]): AnimalResponseDTO[] {
    return animals.map((animal) => this.toDTO(animal));
  }
}
