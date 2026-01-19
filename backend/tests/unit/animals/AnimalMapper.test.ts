import { describe, it, expect } from 'vitest';
import { Animal } from '../../../core/animals/domain/Animal';
import { Breed } from '../../../core/breeds/domain/Breed';
import { AnimalMapper } from '../../../application/animals/mappers/AnimalMapper';

describe('AnimalMapper', () => {
  describe('toDTO', () => {
    it('should map animal to DTO without breeds', () => {
      const animal = new Animal(1, 'dog', 'dog', 1);

      const result = AnimalMapper.toDTO(animal);

      expect(result.id).toBe(1);
      expect(result.species).toBe('Dog');
      expect(result.breeds).toEqual([]);
    });

    it('should map animal to DTO with breeds', () => {
      const animal = new Animal(1, 'cat', 'cat', 1);
      const breed1 = new Breed(1, 'persian', 'persian', 1, 1);
      const breed2 = new Breed(2, 'siamese', 'siamese', 1, 1);

      const result = AnimalMapper.toDTO(animal, [breed1, breed2]);

      expect(result.id).toBe(1);
      expect(result.species).toBe('Cat');
      expect(result.breeds).toHaveLength(2);
      expect(result.breeds[0]).toEqual({
        id: 1,
        name: 'Persian',
      });
      expect(result.breeds[1]).toEqual({
        id: 2,
        name: 'Siamese',
      });
    });

    it('should capitalize animal species', () => {
      const animal = new Animal(1, 'rabbit', 'rabbit', 1);

      const result = AnimalMapper.toDTO(animal);

      expect(result.species).toBe('Rabbit');
    });

    it('should capitalize breed names', () => {
      const animal = new Animal(1, 'dog', 'dog', 1);
      const breed = new Breed(1, 'golden retriever', 'golden retriever', 1, 1);

      const result = AnimalMapper.toDTO(animal, [breed]);

      expect(result.breeds[0].name).toBe('Golden retriever');
    });

    it('should handle empty breeds array', () => {
      const animal = new Animal(1, 'bird', 'bird', 1);

      const result = AnimalMapper.toDTO(animal, []);

      expect(result.breeds).toEqual([]);
    });

    it('should handle undefined breeds parameter', () => {
      const animal = new Animal(1, 'horse', 'horse', 1);

      const result = AnimalMapper.toDTO(animal, undefined);

      expect(result.breeds).toEqual([]);
    });
  });

  describe('toDTOs', () => {
    it('should map multiple animals to DTOs without breeds', () => {
      const animal1 = new Animal(1, 'dog', 'dog', 1);
      const animal2 = new Animal(2, 'cat', 'cat', 1);

      const result = AnimalMapper.toDTOs([animal1, animal2]);

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe(1);
      expect(result[0].species).toBe('Dog');
      expect(result[1].id).toBe(2);
      expect(result[1].species).toBe('Cat');
    });

    it('should map multiple animals to DTOs with breeds map', () => {
      const animal1 = new Animal(1, 'dog', 'dog', 1);
      const animal2 = new Animal(2, 'cat', 'cat', 1);

      const breed1 = new Breed(1, 'labrador', 'labrador', 1, 1);
      const breed2 = new Breed(2, 'persian', 'persian', 1, 1);
      const breed3 = new Breed(3, 'siamese', 'siamese', 1, 1);

      const breedsMap = new Map<number, Breed[]>([
        [1, [breed1]],
        [2, [breed2, breed3]],
      ]);

      const result = AnimalMapper.toDTOs([animal1, animal2], breedsMap);

      expect(result).toHaveLength(2);
      expect(result[0].breeds).toHaveLength(1);
      expect(result[1].breeds).toHaveLength(2);
    });

    it('should handle empty animals array', () => {
      const result = AnimalMapper.toDTOs([]);

      expect(result).toEqual([]);
    });

    it('should handle animals without breeds in map', () => {
      const animal = new Animal(1, 'reptile', 'reptile', 1);
      const breedsMap = new Map<number, Breed[]>();

      const result = AnimalMapper.toDTOs([animal], breedsMap);

      expect(result).toHaveLength(1);
      expect(result[0].breeds).toEqual([]);
    });

    it('should handle undefined breeds map', () => {
      const animal1 = new Animal(1, 'fish', 'fish', 1);
      const animal2 = new Animal(2, 'bird', 'bird', 1);

      const result = AnimalMapper.toDTOs([animal1, animal2], undefined);

      expect(result).toHaveLength(2);
      expect(result[0].breeds).toEqual([]);
      expect(result[1].breeds).toEqual([]);
    });

    it('should map mixed scenario with some animals having breeds and others not', () => {
      const animal1 = new Animal(1, 'dog', 'dog', 1);
      const animal2 = new Animal(2, 'fish', 'fish', 1);

      const breed = new Breed(1, 'poodle', 'poodle', 1, 1);
      const breedsMap = new Map<number, Breed[]>([
        [1, [breed]],
        // animal 2 has no entry in map
      ]);

      const result = AnimalMapper.toDTOs([animal1, animal2], breedsMap);

      expect(result).toHaveLength(2);
      expect(result[0].breeds).toHaveLength(1);
      expect(result[1].breeds).toEqual([]);
    });
  });
});
