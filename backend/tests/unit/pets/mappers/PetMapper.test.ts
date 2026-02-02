import { describe, it, expect } from 'vitest';
import { PetMapper } from '../../../../application/pets/mappers/PetMapper';
import { Pet } from '../../../../core/pets/domain/Pet';
import { Owner } from '../../../../core/owners/domain/Owner';
import { Breed } from '../../../../core/breeds/domain/Breed';

describe('PetMapper', () => {
  it('should map a pet with owner and breed', () => {
    const pet = new Pet(1, 'bobby', 'bobby', null, 'Important', 'Quick', 10, 20, 99);
    const owner = new Owner(10, 'daniel', 'daniel', 'dan@test.com', '12345', 99);
    const breed = new Breed(20, 'labrador', 'labrador', 5, 99);

    const dto = PetMapper.toDTO(pet, owner, breed);

    expect(dto).toEqual({
      id: 1,
      name: 'Bobby',
      birthDate: null,
      ownerId: 10,
      ownerName: 'Daniel',
      ownerPhone: '12345',
      breed: 'Labrador',
      importantNotes: 'Important',
      quickNotes: 'Quick',
    });
  });

  it('should map a pet without owner and breed', () => {
    const pet = new Pet(1, 'rocky', 'rocky', null, null, null, 10, 20, 99);

    const dto = PetMapper.toDTO(pet);

    expect(dto).toEqual({
      id: 1,
      name: 'Rocky',
      birthDate: null,
      ownerId: 10,
      ownerName: '',
      ownerPhone: '',
      breed: '',
      importantNotes: '',
      quickNotes: '',
    });
  });
});
