import { describe, it, expect } from 'vitest';
import { OwnerMapper } from '../../../../application/owners/mappers/OwnerMapper';
import { Owner } from '../../../../core/owners/domain/Owner';
import { Pet } from '../../../../core/pets/domain/Pet';

describe('OwnerMapper', () => {
  it('should map an owner without pets', () => {
    const owner = new Owner(1, 'daniel', 'daniel', 'dan@test.com', '12345', 99);

    const dto = OwnerMapper.toDTO(owner);

    expect(dto).toEqual({
      id: 1,
      name: 'Daniel', // capitalize
      email: 'dan@test.com',
      phone: '12345',
      pets: [],
    });
  });

  it('should map an owner with pets', () => {
    const owner = new Owner(1, 'daniel', 'daniel', 'dan@test.com', '12345', 99);

    const pets = [
      new Pet(10, 'bobby', 'bobby', null, null, null, 1, 1, 99),
      new Pet(11, 'rocky', 'rocky', null, null, null, 1, 1, 99),
    ];

    const dto = OwnerMapper.toDTO(owner, pets);

    expect(dto.pets).toEqual([
      { id: 10, name: 'Bobby' },
      { id: 11, name: 'Rocky' },
    ]);
  });

  it('should map multiple owners using toDTOs with petsMap', () => {
    const owner1 = new Owner(1, 'daniel', 'daniel', 'dan@test.com', '12345', 99);
    const owner2 = new Owner(2, 'maria', 'maria', 'maria@test.com', '67890', 99);

    const petsMap = new Map<number, Pet[]>();
    petsMap.set(1, [new Pet(10, 'bobby', 'bobby', null, null, null, 1, 1, 99)]);
    petsMap.set(2, [new Pet(11, 'luna', 'luna', null, null, null, 2, 1, 99)]);

    const dtos = OwnerMapper.toDTOs([owner1, owner2], petsMap);

    expect(dtos).toEqual([
      {
        id: 1,
        name: 'Daniel',
        email: 'dan@test.com',
        phone: '12345',
        pets: [{ id: 10, name: 'Bobby' }],
      },
      {
        id: 2,
        name: 'Maria',
        email: 'maria@test.com',
        phone: '67890',
        pets: [{ id: 11, name: 'Luna' }],
      },
    ]);
  });

  it('should map multiple owners with empty pets when petsMap is missing', () => {
    const owner1 = new Owner(1, 'daniel', 'daniel', 'dan@test.com', '12345', 99);
    const owner2 = new Owner(2, 'maria', 'maria', 'maria@test.com', '67890', 99);

    const dtos = OwnerMapper.toDTOs([owner1, owner2]);

    expect(dtos).toEqual([
      {
        id: 1,
        name: 'Daniel',
        email: 'dan@test.com',
        phone: '12345',
        pets: [],
      },
      {
        id: 2,
        name: 'Maria',
        email: 'maria@test.com',
        phone: '67890',
        pets: [],
      },
    ]);
  });
});
