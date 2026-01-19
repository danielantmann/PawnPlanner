import 'reflect-metadata';
import { describe, it, expect, vi } from 'vitest';
import { UpdatePetService } from '../../../application/pets/services/UpdatePetService';
import { NotFoundError } from '../../../shared/errors/NotFoundError';
import { Pet } from '../../../core/pets/domain/Pet';
import { Owner } from '../../../core/owners/domain/Owner';
import { Breed } from '../../../core/breeds/domain/Breed';

const createBreed = (id: number, name: string, animalId: number, userId: number) =>
  new Breed(id, name, name.toLowerCase(), animalId, userId);

describe('UpdatePetService', () => {
  const mockPetRepo = { findById: vi.fn(), save: vi.fn() };
  const mockOwnerRepo = { findById: vi.fn() };
  const mockBreedRepo = { findById: vi.fn() };
  const service = new UpdatePetService(
    mockPetRepo as any,
    mockOwnerRepo as any,
    mockBreedRepo as any
  );
  const userId = 1;

  it('should update pet name successfully', async () => {
    const existingPet = new Pet(
      1,
      'Fluffy',
      'fluffy',
      new Date('2020-01-15'),
      'allergic to chicken',
      'loves walks',
      5,
      3,
      userId
    );
    const updatedPet = new Pet(
      1,
      'Fluffy Updated',
      'fluffy updated',
      new Date('2020-01-15'),
      'allergic to chicken',
      'loves walks',
      5,
      3,
      userId
    );
    const owner = new Owner(5, 'John', 'john', 'john@test.com', '123', userId);
    const breed = createBreed(3, 'Golden Retriever', 1, userId);

    mockPetRepo.findById.mockResolvedValue(existingPet);
    mockPetRepo.save.mockResolvedValue(updatedPet);
    mockOwnerRepo.findById.mockResolvedValue(owner);
    mockBreedRepo.findById.mockResolvedValue(breed);

    const result = await service.execute(1, { name: 'Fluffy Updated' }, userId);

    expect(mockPetRepo.findById).toHaveBeenCalledWith(1, userId);
    expect(result.name).toBe('Fluffy Updated');
  });

  it('should update pet birthDate successfully', async () => {
    const existingPet = new Pet(
      1,
      'Fluffy',
      'fluffy',
      new Date('2020-01-15'),
      'allergic to chicken',
      'loves walks',
      5,
      3,
      userId
    );
    const newBirthDate = new Date('2021-06-20');
    const updatedPet = new Pet(
      1,
      'Fluffy',
      'fluffy',
      newBirthDate,
      'allergic to chicken',
      'loves walks',
      5,
      3,
      userId
    );
    const owner = new Owner(5, 'John', 'john', 'john@test.com', '123', userId);
    const breed = createBreed(3, 'Golden Retriever', 1, userId);

    mockPetRepo.findById.mockResolvedValue(existingPet);
    mockPetRepo.save.mockResolvedValue(updatedPet);
    mockOwnerRepo.findById.mockResolvedValue(owner);
    mockBreedRepo.findById.mockResolvedValue(breed);

    const result = await service.execute(1, { birthDate: '2021-06-20' }, userId);

    // birthDate is a Date object in the response
    expect(result.birthDate).toEqual(newBirthDate);
  });

  it('should update pet importantNotes successfully', async () => {
    const existingPet = new Pet(
      1,
      'Fluffy',
      'fluffy',
      new Date('2020-01-15'),
      'allergic to chicken',
      'loves walks',
      5,
      3,
      userId
    );
    const updatedPet = new Pet(
      1,
      'Fluffy',
      'fluffy',
      new Date('2020-01-15'),
      'allergic to dairy',
      'loves walks',
      5,
      3,
      userId
    );
    const owner = new Owner(5, 'John', 'john', 'john@test.com', '123', userId);
    const breed = createBreed(3, 'Golden Retriever', 1, userId);

    mockPetRepo.findById.mockResolvedValue(existingPet);
    mockPetRepo.save.mockResolvedValue(updatedPet);
    mockOwnerRepo.findById.mockResolvedValue(owner);
    mockBreedRepo.findById.mockResolvedValue(breed);

    const result = await service.execute(1, { importantNotes: 'allergic to dairy' }, userId);
    expect(result.importantNotes).toBe('allergic to dairy');
  });

  it('should update pet quickNotes successfully', async () => {
    const existingPet = new Pet(
      1,
      'Fluffy',
      'fluffy',
      new Date('2020-01-15'),
      'allergic to chicken',
      'loves walks',
      5,
      3,
      userId
    );
    const updatedPet = new Pet(
      1,
      'Fluffy',
      'fluffy',
      new Date('2020-01-15'),
      'allergic to chicken',
      'loves playing fetch',
      5,
      3,
      userId
    );
    const owner = new Owner(5, 'John', 'john', 'john@test.com', '123', userId);
    const breed = createBreed(3, 'Golden Retriever', 1, userId);

    mockPetRepo.findById.mockResolvedValue(existingPet);
    mockPetRepo.save.mockResolvedValue(updatedPet);
    mockOwnerRepo.findById.mockResolvedValue(owner);
    mockBreedRepo.findById.mockResolvedValue(breed);

    const result = await service.execute(1, { quickNotes: 'loves playing fetch' }, userId);
    expect(result.quickNotes).toBe('loves playing fetch');
  });

  it('should update multiple pet fields at once', async () => {
    const existingPet = new Pet(
      1,
      'Fluffy',
      'fluffy',
      new Date('2020-01-15'),
      'allergic to chicken',
      'loves walks',
      5,
      3,
      userId
    );
    const newBirthDate = new Date('2021-06-20');
    const updatedPet = new Pet(
      1,
      'Max',
      'max',
      newBirthDate,
      'allergic to dairy',
      'very active',
      5,
      3,
      userId
    );
    const owner = new Owner(5, 'John', 'john', 'john@test.com', '123', userId);
    const breed = createBreed(3, 'Golden Retriever', 1, userId);

    mockPetRepo.findById.mockResolvedValue(existingPet);
    mockPetRepo.save.mockResolvedValue(updatedPet);
    mockOwnerRepo.findById.mockResolvedValue(owner);
    mockBreedRepo.findById.mockResolvedValue(breed);

    const result = await service.execute(
      1,
      {
        name: 'Max',
        birthDate: '2021-06-20',
        importantNotes: 'allergic to dairy',
        quickNotes: 'very active',
      },
      userId
    );

    expect(result.name).toBe('Max');
    expect(result.importantNotes).toBe('allergic to dairy');
    expect(result.quickNotes).toBe('very active');
  });

  it('should throw NotFoundError if pet does not exist', async () => {
    mockPetRepo.findById.mockResolvedValue(null);
    await expect(service.execute(99, { name: 'Ghost' }, userId)).rejects.toThrow(NotFoundError);
  });

  it('should not modify fields that are not in DTO', async () => {
    const existingPet = new Pet(
      1,
      'Fluffy',
      'fluffy',
      new Date('2020-01-15'),
      'allergic to chicken',
      'loves walks',
      5,
      3,
      userId
    );
    const updatedPet = new Pet(
      1,
      'Fluffy',
      'fluffy',
      new Date('2020-01-15'),
      'allergic to chicken',
      'loves walks',
      5,
      3,
      userId
    );
    const owner = new Owner(5, 'John', 'john', 'john@test.com', '123', userId);
    const breed = createBreed(3, 'Golden Retriever', 1, userId);

    mockPetRepo.findById.mockResolvedValue(existingPet);
    mockPetRepo.save.mockResolvedValue(updatedPet);
    mockOwnerRepo.findById.mockResolvedValue(owner);
    mockBreedRepo.findById.mockResolvedValue(breed);

    const result = await service.execute(1, {}, userId);

    expect(result.name).toBe('Fluffy');
    expect(result.importantNotes).toBe('allergic to chicken');
    expect(result.quickNotes).toBe('loves walks');
  });

  it('should include owner and breed in returned DTO', async () => {
    const existingPet = new Pet(
      1,
      'Fluffy',
      'fluffy',
      new Date('2020-01-15'),
      'allergic to chicken',
      'loves walks',
      5,
      3,
      userId
    );
    const updatedPet = new Pet(
      1,
      'Fluffy Updated',
      'fluffy updated',
      new Date('2020-01-15'),
      'allergic to chicken',
      'loves walks',
      5,
      3,
      userId
    );
    const owner = new Owner(5, 'John', 'john', 'john@test.com', '123', userId);
    const breed = createBreed(3, 'Golden Retriever', 1, userId);

    mockPetRepo.findById.mockResolvedValue(existingPet);
    mockPetRepo.save.mockResolvedValue(updatedPet);
    mockOwnerRepo.findById.mockResolvedValue(owner);
    mockBreedRepo.findById.mockResolvedValue(breed);

    const result = await service.execute(1, { name: 'Fluffy Updated' }, userId);

    expect(mockOwnerRepo.findById).toHaveBeenCalledWith(5, userId);
    expect(mockBreedRepo.findById).toHaveBeenCalledWith(3, userId);
    expect(result.ownerName).toBeDefined();
    expect(result.breed).toBeDefined();
  });

  it('should normalize name for searchName field', async () => {
    const existingPet = new Pet(
      1,
      'Fluffy',
      'fluffy',
      new Date('2020-01-15'),
      'allergic to chicken',
      'loves walks',
      5,
      3,
      userId
    );
    const updatedPet = new Pet(
      1,
      'Fluffy Updated',
      'fluffy updated',
      new Date('2020-01-15'),
      'allergic to chicken',
      'loves walks',
      5,
      3,
      userId
    );
    const owner = new Owner(5, 'John', 'john', 'john@test.com', '123', userId);
    const breed = createBreed(3, 'Golden Retriever', 1, userId);

    mockPetRepo.findById.mockResolvedValue(existingPet);
    mockPetRepo.save.mockResolvedValue(updatedPet);
    mockOwnerRepo.findById.mockResolvedValue(owner);
    mockBreedRepo.findById.mockResolvedValue(breed);

    await service.execute(1, { name: 'Fluffy Updated' }, userId);

    const savedPet = mockPetRepo.save.mock.calls[0][0];
    expect(savedPet.searchName).toBe('fluffy updated');
  });
});
