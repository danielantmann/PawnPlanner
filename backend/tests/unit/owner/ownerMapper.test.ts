import { describe, it, expect } from 'vitest';
import { OwnerMapper } from '../../../application/owners/mappers/OwnerMapper';
import { Owner } from '../../../core/owners/domain/Owner';
import { User } from '../../../core/users/domain/User';

describe('OwnerMapper', () => {
  it('should map Owner to DTO with titleCase name', () => {
    const owner = new Owner();
    Object.assign(owner, {
      id: 1,
      name: 'juan jose lopez',
      email: 'juan@test.com',
      phone: '1234567',
      pets: [],
      userId: 99,
      createdByUser: {} as User,
      searchName: 'juanjoselopez',
      normalizeFields: () => {},
      normalizeName: () => {},
      normalizeSearch: () => {},
    });

    const dto = OwnerMapper.toDTO(owner);

    expect(dto).toEqual({
      id: 1,
      name: 'Juan Jose Lopez',
      email: 'juan@test.com',
      phone: '1234567',
      pets: [],
    });
  });

  it('should handle empty pets array', () => {
    const owner = new Owner();
    Object.assign(owner, {
      id: 2,
      name: 'ana',
      email: 'ana@test.com',
      phone: '7654321',
      pets: [],
      userId: 99,
      createdByUser: {} as User,
      searchName: 'ana',
      normalizeFields: () => {},
      normalizeName: () => {},
      normalizeSearch: () => {},
    });

    const dto = OwnerMapper.toDTO(owner);
    expect(dto.pets).toEqual([]);
  });

  it('should map pets correctly', () => {
    const owner = new Owner();
    Object.assign(owner, {
      id: 3,
      name: 'carlos',
      email: 'carlos@test.com',
      phone: '9999999',
      pets: [{ id: 1, name: 'Firulais' } as any],
      userId: 99,
      createdByUser: {} as User,
      searchName: 'carlos',
      normalizeFields: () => {},
      normalizeName: () => {},
      normalizeSearch: () => {},
    });

    const dto = OwnerMapper.toDTO(owner);
    expect(dto.pets).toEqual([{ id: 1, name: 'Firulais' }]);
  });

  it('should not alter already normalized name', () => {
    const owner = new Owner();
    Object.assign(owner, {
      id: 4,
      name: 'Maria Lopez',
      email: 'maria@test.com',
      phone: '1111111',
      pets: [],
      userId: 99,
      createdByUser: {} as User,
      searchName: 'marialopez',
      normalizeFields: () => {},
      normalizeName: () => {},
      normalizeSearch: () => {},
    });

    const dto = OwnerMapper.toDTO(owner);
    expect(dto.name).toBe('Maria Lopez');
  });

  it('should always include all fields in DTO', () => {
    const owner = new Owner();
    Object.assign(owner, {
      id: 5,
      name: 'pedro',
      email: '',
      phone: '',
      pets: [],
      userId: 99,
      createdByUser: {} as User,
      searchName: 'pedro',
      normalizeFields: () => {},
      normalizeName: () => {},
      normalizeSearch: () => {},
    });

    const dto = OwnerMapper.toDTO(owner);
    expect(Object.keys(dto)).toEqual(['id', 'name', 'email', 'phone', 'pets']);
  });
});
