import { Animal } from '../../../core/animals/domain/Animal';
import { Breed } from '../../../core/breeds/domain/Breed';
import { AnimalResponseDTO } from '../dto/AnimalResponseDTO';
import { capitalize } from '../../../shared/utils/stringUtils';

export class AnimalMapper {
  static toDTO(animal: Animal, breeds?: Breed[]): AnimalResponseDTO {
    return {
      id: animal.id!,
      species: capitalize(animal.species),
      breeds:
        breeds?.map((b) => ({
          id: b.id,
          name: capitalize(b.name),
        })) || [],
    };
  }

  static toDTOs(animals: Animal[], breedsMap?: Map<number, Breed[]>): AnimalResponseDTO[] {
    return animals.map((a) => this.toDTO(a, breedsMap?.get(a.id!) || []));
  }
}
