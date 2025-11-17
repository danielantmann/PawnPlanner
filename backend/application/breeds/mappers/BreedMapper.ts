import { Breed } from '../../../core/breeds/domain/Breed';
import { BreedResponseDTO } from '../dto/BreedResponseDTO';
import { capitalize } from '../../../shared/utils/stringUtils';

export class BreedMapper {
  static toDTO(breed: Breed): BreedResponseDTO {
    return {
      id: breed.id,
      name: capitalize(breed.name),
      animal: {
        id: breed.animal.id,
        species: capitalize(breed.animal.species),
      },
    };
  }
}
