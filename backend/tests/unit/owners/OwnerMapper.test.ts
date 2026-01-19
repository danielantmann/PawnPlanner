import { describe, it, expect } from 'vitest';
import { Owner } from '../../../core/owners/domain/Owner';
import { Pet } from '../../../core/pets/domain/Pet';
import { OwnerMapper } from '../../../application/owners/mappers/OwnerMapper';

describe('OwnerMapper', () => {
  describe('toDTO', () => {
    it('should map owner to DTO without pets', () => {
      const owner = new Owner(1, 'john doe', 'john doe', 'john@test.com', '123456', 1);

      const result = OwnerMapper.toDTO(owner);

      expect(result.id).toBe(1);
      expect(result.name).toBe('John doe');
      expect(result.email).toBe('john@test.com');
      expect(result.phone).toBe('123456');
      expect(result.pets).toEqual([]);
    });

    it('should map owner to DTO with pets', () => {
      const owner = new Owner(1, 'jane doe', 'jane doe', 'jane@test.com', '654321', 1);
      const pet1 = new Pet(1, 'fluffy', 'fluffy', 1, 1, undefined, 1);
      const pet2 = new Pet(2, 'buddy', 'buddy', 1, 1, undefined, 1);

      const result = OwnerMapper.toDTO(owner, [pet1, pet2]);

      expect(result.id).toBe(1);
      expect(result.name).toBe('Jane doe');
      expect(result.pets).toHaveLength(2);
      expect(result.pets[0]).toEqual({
        id: 1,
        name: 'Fluffy',
      });
      expect(result.pets[1]).toEqual({
        id: 2,
        name: 'Buddy',
      });
    });

    it('should capitalize owner name', () => {
      const owner = new Owner(1, 'alex smith', 'alex smith', 'alex@test.com', '111111', 1);

      const result = OwnerMapper.toDTO(owner);

      expect(result.name).toBe('Alex smith');
    });

    it('should capitalize pet names', () => {
      const owner = new Owner(1, 'owner name', 'owner name', 'owner@test.com', '222222', 1);
      const pet = new Pet(1, 'max jumper', 'max jumper', 1, 1, undefined, 1);

      const result = OwnerMapper.toDTO(owner, [pet]);

      expect(result.pets[0].name).toBe('Max jumper');
    });

    it('should handle empty pets array', () => {
      const owner = new Owner(1, 'test owner', 'test owner', 'test@test.com', '333333', 1);

      const result = OwnerMapper.toDTO(owner, []);

      expect(result.pets).toEqual([]);
    });

    it('should handle undefined pets parameter', () => {
      const owner = new Owner(1, 'another owner', 'another owner', 'another@test.com', '444444', 1);

      const result = OwnerMapper.toDTO(owner, undefined);

      expect(result.pets).toEqual([]);
    });
  });

  describe('toDTOs', () => {
    it('should map multiple owners to DTOs without pets', () => {
      const owner1 = new Owner(1, 'john doe', 'john doe', 'john@test.com', '123456', 1);
      const owner2 = new Owner(2, 'jane doe', 'jane doe', 'jane@test.com', '654321', 1);

      const result = OwnerMapper.toDTOs([owner1, owner2]);

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe(1);
      expect(result[0].name).toBe('John doe');
      expect(result[1].id).toBe(2);
      expect(result[1].name).toBe('Jane doe');
    });

    it('should map multiple owners to DTOs with pets map', () => {
      const owner1 = new Owner(1, 'owner one', 'owner one', 'one@test.com', '111111', 1);
      const owner2 = new Owner(2, 'owner two', 'owner two', 'two@test.com', '222222', 1);

      const pet1 = new Pet(1, 'pet one', 'pet one', 1, 1, undefined, 1);
      const pet2 = new Pet(2, 'pet two', 'pet two', 1, 1, undefined, 1);
      const pet3 = new Pet(3, 'pet three', 'pet three', 1, 1, undefined, 1);

      const petsMap = new Map<number, Pet[]>([
        [1, [pet1, pet2]],
        [2, [pet3]],
      ]);

      const result = OwnerMapper.toDTOs([owner1, owner2], petsMap);

      expect(result).toHaveLength(2);
      expect(result[0].pets).toHaveLength(2);
      expect(result[1].pets).toHaveLength(1);
    });

    it('should handle empty owners array', () => {
      const result = OwnerMapper.toDTOs([]);

      expect(result).toEqual([]);
    });

    it('should handle owners without pets in map', () => {
      const owner = new Owner(1, 'test owner', 'test owner', 'test@test.com', '555555', 1);
      const petsMap = new Map<number, Pet[]>();

      const result = OwnerMapper.toDTOs([owner], petsMap);

      expect(result).toHaveLength(1);
      expect(result[0].pets).toEqual([]);
    });

    it('should handle undefined pets map', () => {
      const owner1 = new Owner(1, 'owner a', 'owner a', 'a@test.com', '666666', 1);
      const owner2 = new Owner(2, 'owner b', 'owner b', 'b@test.com', '777777', 1);

      const result = OwnerMapper.toDTOs([owner1, owner2], undefined);

      expect(result).toHaveLength(2);
      expect(result[0].pets).toEqual([]);
      expect(result[1].pets).toEqual([]);
    });

    it('should map mixed scenario with some owners having pets and others not', () => {
      const owner1 = new Owner(1, 'owner with pets', 'owner with pets', 'with@test.com', '888888', 1);
      const owner2 = new Owner(2, 'owner without pets', 'owner without pets', 'without@test.com', '999999', 1);

      const pet = new Pet(1, 'fluffy', 'fluffy', 1, 1, undefined, 1);
      const petsMap = new Map<number, Pet[]>([
        [1, [pet]],
        // owner 2 has no entry in map
      ]);

      const result = OwnerMapper.toDTOs([owner1, owner2], petsMap);

      expect(result).toHaveLength(2);
      expect(result[0].pets).toHaveLength(1);
      expect(result[1].pets).toEqual([]);
    });
  });
});
