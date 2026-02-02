import { describe, it, expect } from 'vitest';
import { BreedMapper } from '../../../../application/breeds/mappers/BreedMapper';
import { Breed } from '../../../../core/breeds/domain/Breed';
import { Animal } from '../../../../core/animals/domain/Animal';

describe('BreedMapper', () => {
  it('should map a breed with animal', () => {
    const breed = new Breed(1, 'beagle', 'beagle', 10, 99);
    const animal = new Animal(10, 'dog', 99); // ✔ constructor correcto

    const dto = BreedMapper.toDTO(breed, animal);

    expect(dto).toEqual({
      id: 1,
      name: 'Beagle',
      animal: {
        id: 10,
        species: 'Dog',
      },
    });
  });

  it('should map a breed without animal', () => {
    const breed = new Breed(1, 'beagle', 'beagle', 10, 99);

    const dto = BreedMapper.toDTO(breed);

    expect(dto).toEqual({
      id: 1,
      name: 'Beagle',
      animal: {
        id: 10,
        species: '',
      },
    });
  });
});
