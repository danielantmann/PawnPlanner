import { useState } from 'react';
import type { AnimalDTO } from '@/src/modules/animals/types/animal.types';
import type { BreedDTO } from '@/src/modules/breeds/types/breed.types';

export type PetFormState = {
  animal: AnimalDTO | null;
  animalId: number | null;
  breed: BreedDTO | null;
  breedId: number | null;
  name: string;
  birthDate: string | null;
  importantNotes: string;
  quickNotes: string;
};

export type PetFormErrors = Partial<Record<keyof PetFormState, string[]>>;

export function usePetForm() {
  const [petState, setPetState] = useState<PetFormState>({
    animal: null,
    animalId: null,
    breed: null,
    breedId: null,
    name: '',
    birthDate: null,
    importantNotes: '',
    quickNotes: '',
  });

  const [petErrors, setPetErrors] = useState<PetFormErrors>({});

  const setPetField = <K extends keyof PetFormState>(field: K, value: PetFormState[K]) => {
    setPetState((prev) => ({ ...prev, [field]: value }));
  };

  const resetPetForm = () => {
    setPetState({
      animal: null,
      animalId: null,
      breed: null,
      breedId: null,
      name: '',
      birthDate: null,
      importantNotes: '',
      quickNotes: '',
    });
    setPetErrors({});
  };

  return {
    petState,
    petErrors,
    setPetField,
    setPetErrors,
    resetPetForm,
  };
}
