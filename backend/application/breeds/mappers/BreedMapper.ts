import { Breed } from '../../../core/breeds/domain/Breed';
import { BreedResponseDTO } from '../dto/BreedResponseDTO';
import { capitalize } from '../../../shared/utils/stringUtils';
import { Animal } from '../../../core/animals/domain/Animal';

export class BreedMapper {
  static toDTO(breed: Breed, animal?: Animal | null): BreedResponseDTO {
    return {
      id: breed.id!,
      name: capitalize(breed.name),
      animal: {
        id: breed.animalId,
        species: animal ? capitalize(animal.species) : '',
      },
    };
  }
}
