import { Breed } from '../../../core/breeds/domain/Breed';
import { BreedResponseDTO } from '../dto/BreedResponseDto';

export class BreedMapper {
  static toDTO(breed: Breed): BreedResponseDTO {
    return {
      id: breed.id,
      name: breed.name,
      animal: {
        id: breed.animal.id,
        species: breed.animal.species,
      },
    };
  }
}
