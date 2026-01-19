import 'reflect-metadata';
import { describe, it, expect, vi } from 'vitest';
import { GetPetByNameService } from '../../../application/pets/services/GetPetByNameService';
import { Pet } from '../../../core/pets/domain/Pet';

describe('GetPetByNameService', () => {
  const mockPetRepo = { findByName: vi.fn() };
  const service = new GetPetByNameService(mockPetRepo as any);
  const userId = 1;

  it('should return pets matching the given name', async () => {
    const pets = [
      new Pet(
        1,
        'Fluffy',
        'fluffy',
        new Date('2020-01-15'),
        'allergic to chicken',
        'loves walks',
        5,
        3,
        userId
      ),
      new Pet(2, 'Fluffy', 'fluffy', new Date('2019-05-20'), null, 'calm', 8, 2, userId),
    ];

    mockPetRepo.findByName.mockResolvedValue(pets);

    const result = await service.execute('Fluffy', userId);

    expect(mockPetRepo.findByName).toHaveBeenCalledWith('Fluffy', userId);
    expect(result).toHaveLength(2);
    expect(result[0].name).toBe('Fluffy');
    expect(result[1].name).toBe('Fluffy');
  });

  it('should return empty array if no pets match the name', async () => {
    mockPetRepo.findByName.mockResolvedValue([]);

    const result = await service.execute('Nonexistent', userId);

    expect(mockPetRepo.findByName).toHaveBeenCalledWith('Nonexistent', userId);
    expect(result).toHaveLength(0);
  });

  it('should handle case-insensitive search', async () => {
    const pets = [
      new Pet(
        1,
        'Fluffy',
        'fluffy',
        new Date('2020-01-15'),
        'allergic to chicken',
        'loves walks',
        5,
        3,
        userId
      ),
    ];

    mockPetRepo.findByName.mockResolvedValue(pets);

    const result = await service.execute('FLUFFY', userId);

    expect(result[0].name).toBe('Fluffy');
  });

  it('should pass userId to repository correctly', async () => {
    const userId2 = 42;
    const pets = [
      new Pet(1, 'Max', 'max', new Date('2020-01-15'), null, 'energetic', 5, 3, userId2),
    ];

    mockPetRepo.findByName.mockResolvedValue(pets);

    await service.execute('Max', userId2);

    expect(mockPetRepo.findByName).toHaveBeenCalledWith('Max', userId2);
  });

  it('should map returned pets to DTOs', async () => {
    const pets = [
      new Pet(
        1,
        'Fluffy',
        'fluffy',
        new Date('2020-01-15'),
        'allergic to chicken',
        'loves walks',
        5,
        3,
        userId
      ),
    ];

    mockPetRepo.findByName.mockResolvedValue(pets);

    const result = await service.execute('Fluffy', userId);

    expect(result[0]).toHaveProperty('id');
    expect(result[0]).toHaveProperty('name');
    expect(result[0]).toHaveProperty('birthDate');
  });

  it('should return multiple pets with correct properties', async () => {
    const pets = [
      new Pet(
        1,
        'Fluffy',
        'fluffy',
        new Date('2020-01-15'),
        'allergic to chicken',
        'loves walks',
        5,
        3,
        userId
      ),
      new Pet(3, 'Fluffy', 'fluffy', new Date('2021-03-10'), null, 'playful', 7, 4, userId),
      new Pet(5, 'Fluffy', 'fluffy', null, 'diabetic', 'shy', 9, 1, userId),
    ];

    mockPetRepo.findByName.mockResolvedValue(pets);

    const result = await service.execute('Fluffy', userId);

    expect(result).toHaveLength(3);
    expect(result[0].id).toBe(1);
    expect(result[1].id).toBe(3);
    expect(result[2].id).toBe(5);
  });

  it('should handle special characters in pet name', async () => {
    const pets = [
      new Pet(1, 'Fluffy-Max', 'fluffy-max', new Date('2020-01-15'), null, 'active', 5, 3, userId),
    ];

    mockPetRepo.findByName.mockResolvedValue(pets);

    const result = await service.execute('Fluffy-Max', userId);

    // capitalize() function converts to "Fluffy-max" (only capitalizes first letter)
    expect(result[0].name).toBe('Fluffy-max');
  });
});
