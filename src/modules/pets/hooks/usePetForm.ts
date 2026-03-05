import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { getPetSchema } from '../schemas/pet.schema';
import type { AnimalDTO } from '@/src/modules/animals/types/animal.types';
import type { BreedDTO } from '@/src/modules/breeds/types/breed.types';

// Extendemos el schema para permitir breedId null en el form (se valida con refine)
const petFormSchema = getPetSchema();
export type PetFormValues = z.input<typeof petFormSchema>;

type PetUIState = {
  animal: AnimalDTO | null;
  breed: BreedDTO | null;
};

export function usePetForm() {
  const [petUI, setPetUI] = useState<PetUIState>({ animal: null, breed: null });

  const form = useForm<PetFormValues>({
    resolver: zodResolver(petFormSchema) as any,
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: {
      name: '',
      breedId: undefined,
      birthDate: null,
      importantNotes: '',
      quickNotes: '',
    },
  });

  const resetPetForm = () => {
    form.reset();
    setPetUI({ animal: null, breed: null });
  };

  const selectAnimal = (animal: AnimalDTO) => {
    setPetUI((prev) => ({ ...prev, animal, breed: null }));
    form.setValue('breedId', undefined as any);
  };

  const selectBreed = (breed: BreedDTO) => {
    setPetUI((prev) => ({ ...prev, breed }));
    form.setValue('breedId', breed.id, { shouldValidate: true });
  };

  return { form, petUI, selectAnimal, selectBreed, resetPetForm };
}
