import 'reflect-metadata';
import { describe, it, expect, vi } from 'vitest';
import { GetPetByBreedService } from '../../../application/pets/services/GetPetByBreedService';
import { Pet } from '../../../core/pets/domain/Pet';

describe('GetPetByBreedService', () => {
  const mockPetRepo = { findByBreed: vi.fn() };
  const service = new GetPetByBreedService(mockPetRepo as any);
  const userId = 1;

  it('should return pets matching the given breed', async () => {
    const breedId = 3;
    const pets = [
      new Pet(
        1,
        'Fluffy',
        'fluffy',
        new Date('2020-01-15'),
        'allergic to chicken',
        'loves walks',
        5,
        breedId,
        userId
      ),
      new Pet(2, 'Max', 'max', new Date('2019-05-20'), null, 'calm', 8, breedId, userId),
    ];

    mockPetRepo.findByBreed.mockResolvedValue(pets);

    const result = await service.execute(breedId, userId);

    expect(mockPetRepo.findByBreed).toHaveBeenCalledWith(breedId, userId);
    expect(result).toHaveLength(2);
    // breed is empty string because we don't provide breed object in the mock
    expect(result[0].id).toBe(1);
    expect(result[1].id).toBe(2);
  });

  it('should return empty array if no pets match the breed', async () => {
    mockPetRepo.findByBreed.mockResolvedValue([]);

    const result = await service.execute(999, userId);

    expect(mockPetRepo.findByBreed).toHaveBeenCalledWith(999, userId);
    expect(result).toHaveLength(0);
  });

  it('should pass userId to repository correctly', async () => {
    const userId2 = 42;
    const breedId = 5;
    const pets = [
      new Pet(1, 'Max', 'max', new Date('2020-01-15'), null, 'energetic', 5, breedId, userId2),
    ];

    mockPetRepo.findByBreed.mockResolvedValue(pets);

    await service.execute(breedId, userId2);

    expect(mockPetRepo.findByBreed).toHaveBeenCalledWith(breedId, userId2);
  });

  it('should map returned pets to DTOs', async () => {
    const breedId = 2;
    const pets = [
      new Pet(
        1,
        'Fluffy',
        'fluffy',
        new Date('2020-01-15'),
        'allergic to chicken',
        'loves walks',
        5,
        breedId,
        userId
      ),
    ];

    mockPetRepo.findByBreed.mockResolvedValue(pets);

    const result = await service.execute(breedId, userId);

    expect(result[0]).toHaveProperty('id');
    expect(result[0]).toHaveProperty('name');
    expect(result[0]).toHaveProperty('breed');
  });

  it('should return multiple pets of same breed with correct properties', async () => {
    const breedId = 4;
    const pets = [
      new Pet(
        1,
        'Fluffy',
        'fluffy',
        new Date('2020-01-15'),
        'allergic to chicken',
        'loves walks',
        5,
        breedId,
        userId
      ),
      new Pet(3, 'Buddy', 'buddy', new Date('2021-03-10'), null, 'playful', 7, breedId, userId),
      new Pet(5, 'Charlie', 'charlie', null, 'diabetic', 'shy', 9, breedId, userId),
    ];

    mockPetRepo.findByBreed.mockResolvedValue(pets);

    const result = await service.execute(breedId, userId);

    expect(result).toHaveLength(3);
    expect(result[0].id).toBe(1);
    expect(result[1].id).toBe(3);
    expect(result[2].id).toBe(5);
  });

  it('should handle breed with single pet', async () => {
    const breedId = 10;
    const pets = [
      new Pet(
        15,
        'Solo',
        'solo',
        new Date('2022-01-01'),
        'none',
        'independent',
        3,
        breedId,
        userId
      ),
    ];

    mockPetRepo.findByBreed.mockResolvedValue(pets);

    const result = await service.execute(breedId, userId);

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Solo');
  });

  it('should return different breeds when queried with different breedIds', async () => {
    const breedId1 = 1;
    const breedId2 = 2;

    const pets1 = [
      new Pet(1, 'Fluffy', 'fluffy', new Date('2020-01-15'), null, null, 5, breedId1, userId),
    ];

    const pets2 = [
      new Pet(2, 'Max', 'max', new Date('2020-01-15'), null, null, 8, breedId2, userId),
    ];

    mockPetRepo.findByBreed.mockResolvedValueOnce(pets1).mockResolvedValueOnce(pets2);

    const result1 = await service.execute(breedId1, userId);
    const result2 = await service.execute(breedId2, userId);

    expect(result1[0].name).toBe('Fluffy');
    expect(result2[0].name).toBe('Max');
  });
});
