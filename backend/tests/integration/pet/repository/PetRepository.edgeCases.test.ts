import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { DataSource } from 'typeorm';
import { PetRepository } from '../../../infrastructure/repositories/PetRepository';
import { Pet } from '../../../core/pets/domain/Pet';
import { getDataSource } from '../setup/dataSource';

let dataSource: DataSource;
let repository: PetRepository;

beforeAll(async () => {
  dataSource = await getDataSource();
  repository = new PetRepository(dataSource);
});

afterAll(async () => {
  if (dataSource?.isInitialized) {
    await dataSource.destroy();
  }
});

describe('PetRepository - Edge Cases', () => {
  const userId = 999;
  const ownerId = 1;
  const breedId = 1;

  describe('findByName', () => {
    it('should return empty array when searching for non-existent pet name', async () => {
      const result = await repository.findByName('NonexistentPetName', userId);

      expect(result).toEqual([]);
    });

    it('should handle special characters in search', async () => {
      const pet = new Pet(
        null,
        'Fluffy-Max Jr.',
        'fluffy-max jr.',
        null,
        null,
        null,
        ownerId,
        breedId,
        userId
      );
      await repository.save(pet);

      const result = await repository.findByName('Fluffy-Max Jr.', userId);

      expect(result.length).toBeGreaterThan(0);
    });

    it('should find pets case-insensitively', async () => {
      const pet = new Pet(null, 'Bobby', 'bobby', null, null, null, ownerId, breedId, userId);
      const saved = await repository.save(pet);

      const resultLower = await repository.findByName('bobby', userId);
      const resultUpper = await repository.findByName('BOBBY', userId);

      expect(resultLower.some((p) => p.id === saved.id)).toBe(true);
      expect(resultUpper.some((p) => p.id === saved.id)).toBe(true);
    });

    it('should find pets with accents', async () => {
      const pet = new Pet(null, 'José', 'jose', null, null, null, ownerId, breedId, userId);
      const saved = await repository.save(pet);

      const result = await repository.findByName('Jose', userId);

      expect(result.some((p) => p.id === saved.id)).toBe(true);
    });

    it('should handle whitespace in search', async () => {
      const pet = new Pet(
        null,
        'Max Junior',
        'maxjunior',
        null,
        null,
        null,
        ownerId,
        breedId,
        userId
      );
      const saved = await repository.save(pet);

      const result = await repository.findByName('Max Junior', userId);

      expect(result.some((p) => p.id === saved.id)).toBe(true);
    });

    it('should only return pets for specific userId', async () => {
      const pet1 = new Pet(null, 'Pet1', 'pet1', null, null, null, ownerId, breedId, 111);
      const pet2 = new Pet(null, 'Pet1', 'pet1', null, null, null, ownerId, breedId, 222);

      await repository.save(pet1);
      await repository.save(pet2);

      const result = await repository.findByName('Pet1', 111);

      const user111Pets = result.filter((p) => p.userId === 111);
      const user222Pets = result.filter((p) => p.userId === 222);

      expect(user111Pets.length).toBeGreaterThan(0);
      expect(user222Pets.length).toBe(0);
    });
  });

  describe('findByBreed', () => {
    it('should return empty array when breed has no pets', async () => {
      const result = await repository.findByBreed(999999, userId);

      expect(result).toEqual([]);
    });

    it('should only return pets for specific breed', async () => {
      const pet1 = new Pet(null, 'PetBreed1', 'petbreed1', null, null, null, ownerId, 1, userId);
      const pet2 = new Pet(
        null,
        'PetBreed2',
        'petbreed2',
        null,
        null,
        null,
        ownerId,
        2,
        userId
      );

      const saved1 = await repository.save(pet1);
      const saved2 = await repository.save(pet2);

      const result = await repository.findByBreed(1, userId);

      expect(result.some((p) => p.id === saved1.id)).toBe(true);
      expect(result.some((p) => p.id === saved2.id)).toBe(false);
    });

    it('should respect userId filter in findByBreed', async () => {
      const pet1 = new Pet(
        null,
        'BreedTest1',
        'breedtest1',
        null,
        null,
        null,
        ownerId,
        breedId,
        333
      );
      const pet2 = new Pet(
        null,
        'BreedTest2',
        'breedtest2',
        null,
        null,
        null,
        ownerId,
        breedId,
        444
      );

      await repository.save(pet1);
      await repository.save(pet2);

      const result = await repository.findByBreed(breedId, 333);

      const user333Pets = result.filter((p) => p.userId === 333);
      const user444Pets = result.filter((p) => p.userId === 444);

      expect(user333Pets.length).toBeGreaterThan(0);
      expect(user444Pets.length).toBe(0);
    });
  });

  describe('findById', () => {
    it('should return null for non-existent pet', async () => {
      const result = await repository.findById(999999, userId);

      expect(result).toBeNull();
    });

    it('should return null if pet belongs to different user', async () => {
      const pet = new Pet(null, 'TestPet', 'testpet', null, null, null, ownerId, breedId, 555);
      const saved = await repository.save(pet);

      const result = await repository.findById(saved.id!, 666);

      expect(result).toBeNull();
    });
  });

  describe('delete', () => {
    it('should return false when deleting non-existent pet', async () => {
      const result = await repository.delete(999999, userId);

      expect(result).toBe(false);
    });

    it('should return false if trying to delete pet of different user', async () => {
      const pet = new Pet(null, 'DeleteTest', 'deletetest', null, null, null, ownerId, breedId, 777);
      const saved = await repository.save(pet);

      const result = await repository.delete(saved.id!, 888);

      expect(result).toBe(false);
    });

    it('should successfully delete pet and return true', async () => {
      const pet = new Pet(null, 'DeleteMe', 'deleteme', null, null, null, ownerId, breedId, 999);
      const saved = await repository.save(pet);

      const result = await repository.delete(saved.id!, 999);

      expect(result).toBe(true);

      const foundAfterDelete = await repository.findById(saved.id!, 999);
      expect(foundAfterDelete).toBeNull();
    });
  });

  describe('findByOwner', () => {
    it('should return empty array when owner has no pets', async () => {
      const result = await repository.findByOwner(999999, userId);

      expect(result).toEqual([]);
    });

    it('should return all pets for a specific owner', async () => {
      const pet1 = new Pet(null, 'OwnerPet1', 'ownerpet1', null, null, null, 1, breedId, userId);
      const pet2 = new Pet(null, 'OwnerPet2', 'ownerpet2', null, null, null, 1, breedId, userId);
      const pet3 = new Pet(null, 'OtherPet', 'otherpet', null, null, null, 2, breedId, userId);

      const saved1 = await repository.save(pet1);
      const saved2 = await repository.save(pet2);
      const saved3 = await repository.save(pet3);

      const result = await repository.findByOwner(1, userId);

      expect(result.some((p) => p.id === saved1.id)).toBe(true);
      expect(result.some((p) => p.id === saved2.id)).toBe(true);
      expect(result.some((p) => p.id === saved3.id)).toBe(false);
    });
  });

  describe('update', () => {
    it('should return null when updating non-existent pet', async () => {
      const result = await repository.update(999999, { name: 'Updated' }, userId);

      expect(result).toBeNull();
    });

    it('should return null when updating pet of different user', async () => {
      const pet = new Pet(null, 'UpdateTest', 'updatetest', null, null, null, ownerId, breedId, 1001);
      const saved = await repository.save(pet);

      const result = await repository.update(saved.id!, { name: 'Updated' }, 1002);

      expect(result).toBeNull();
    });

    it('should successfully update pet data', async () => {
      const pet = new Pet(null, 'OriginalName', 'originalname', null, null, null, ownerId, breedId, 1003);
      const saved = await repository.save(pet);

      const updated = await repository.update(saved.id!, { name: 'NewName' }, 1003);

      expect(updated).not.toBeNull();
      expect(updated?.name).toBe('NewName');
    });
  });

  describe('findAll', () => {
    it('should return empty array when user has no pets', async () => {
      const result = await repository.findAll(999999);

      expect(result).toEqual([]);
    });

    it('should return all pets for specific user', async () => {
      const userId1 = 1004;
      const userId2 = 1005;

      const pet1 = new Pet(null, 'AllPet1', 'allpet1', null, null, null, ownerId, breedId, userId1);
      const pet2 = new Pet(null, 'AllPet2', 'allpet2', null, null, null, ownerId, breedId, userId1);
      const pet3 = new Pet(null, 'OtherUserPet', 'otheruserpet', null, null, null, ownerId, breedId, userId2);

      const saved1 = await repository.save(pet1);
      const saved2 = await repository.save(pet2);
      const saved3 = await repository.save(pet3);

      const result1 = await repository.findAll(userId1);
      const result2 = await repository.findAll(userId2);

      expect(result1.some((p) => p.id === saved1.id)).toBe(true);
      expect(result1.some((p) => p.id === saved2.id)).toBe(true);
      expect(result1.some((p) => p.id === saved3.id)).toBe(false);

      expect(result2.some((p) => p.id === saved3.id)).toBe(true);
      expect(result2.some((p) => p.id === saved1.id)).toBe(false);
    });
  });
});
