import type { PetSearchResult } from '@/src/modules/pets/types/pet.types';

export function normalizePetForAppointment(pet: PetSearchResult) {
  return {
    id: pet.id,
    label: `${pet.name}${pet.breed ? ' – ' + pet.breed : ''}`,
    ownerName: pet.ownerName,
    ownerPhone: pet.ownerPhone,
  };
}
