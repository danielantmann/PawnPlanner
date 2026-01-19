import 'reflect-metadata';
import { describe, it, expect } from 'vitest';
import { OwnerMapper } from '../../../application/owners/mappers/OwnerMapper';
import { Owner } from '../../../core/owners/domain/Owner';
import { Pet } from '../../../core/pets/domain/Pet';

describe('OwnerMapper', () => {
  it('should map Owner to DTO with titleCase name', () => {
    const owner = new Owner(1, 'juan jose lopez', 'juanjoselopez', 'juan@test.com', '1234567', 99);
    const pets: Pet[] = [];

    const dto = OwnerMapper.toDTO(owner, pets);

    expect(dto).toEqual({
      id: 1,
      name: 'Juan Jose Lopez',
      email: 'juan@test.com',
      phone: '1234567',
      pets: [],
    });
  });

  it('should handle empty pets array', () => {
    const owner = new Owner(2, 'ana', 'ana', 'ana@test.com', '7654321', 99);
    const pets: Pet[] = [];

    const dto = OwnerMapper.toDTO(owner, pets);
    expect(dto.pets).toEqual([]);
  });

  it('should map pets correctly', () => {
    const owner = new Owner(3, 'carlos', 'carlos', 'carlos@test.com', '9999999', 99);
    const pets = [new Pet(1, 'Firulais', 'firulais', null, null, null, 3, 1, 99)];

    const dto = OwnerMapper.toDTO(owner, pets);
    expect(dto.pets).toEqual([{ id: 1, name: 'Firulais' }]);
  });

  it('should not alter already normalized name', () => {
    const owner = new Owner(4, 'Maria Lopez', 'marialopez', 'maria@test.com', '1111111', 99);
    const pets: Pet[] = [];

    const dto = OwnerMapper.toDTO(owner, pets);
    expect(dto.name).toBe('Maria Lopez');
  });

  it('should always include all fields in DTO', () => {
    const owner = new Owner(5, 'pedro', 'pedro', 'pedro@test.com', '5555555', 99);
    const pets: Pet[] = [];

    const dto = OwnerMapper.toDTO(owner, pets);
    expect(dto).toHaveProperty('id');
    expect(dto).toHaveProperty('name');
    expect(dto).toHaveProperty('email');
    expect(dto).toHaveProperty('phone');
    expect(dto).toHaveProperty('pets');
  });
});
