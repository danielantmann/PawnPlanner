import { View, Text } from 'react-native';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import type { Control, FieldErrors } from 'react-hook-form';
import { Input } from '@/src/ui/components/primitives/Input';
import { InputSelect } from '@/src/ui/components/primitives/InputSelect';
import { AnimalDropdown } from '@/src/modules/animals/components/AnimalDropdown';
import { BreedDropdown } from '@/src/modules/breeds/components/BreedDropdown';
import { formatDateDisplay } from '@/src/utils/formatDate';
import type { PetFormValues } from '../hooks/usePetForm';
import type { AnimalDTO } from '@/src/modules/animals/types/animal.types';
import type { BreedDTO } from '@/src/modules/breeds/types/breed.types';

interface PetFormStepProps {
  control: Control<PetFormValues>;
  errors: FieldErrors<PetFormValues>;
  petUI: { animal: AnimalDTO | null; breed: BreedDTO | null };
  selectAnimal: (animal: AnimalDTO) => void;
  selectBreed: (breed: BreedDTO) => void;
  onOpenDatePicker: () => void;
}

export function PetFormStep({
  control,
  errors,
  petUI,
  selectAnimal,
  selectBreed,
  onOpenDatePicker,
}: PetFormStepProps) {
  const { t } = useTranslation();
  return (
    <View style={{ gap: 16 }}>
      <Text className="text-gray-500 dark:text-gray-300">{t('pets.optionalMessage')}</Text>
      <AnimalDropdown
        label={t('pets.fields.animalType')}
        value={petUI.animal}
        onSelect={selectAnimal}
      />
      <BreedDropdown
        label={t('pets.fields.breed')}
        value={petUI.breed}
        animalId={petUI.animal?.id ?? null}
        onSelect={selectBreed}
        error={errors.breedId?.message}
      />
      <Controller
        control={control}
        name="name"
        render={({ field, fieldState }) => (
          <Input
            label={t('pets.fields.name')}
            value={field.value ?? ''}
            onChangeText={field.onChange}
            error={fieldState.error?.message}
            leftIcon="paw"
          />
        )}
      />
      <Controller
        control={control}
        name="birthDate"
        render={({ field, fieldState }) => (
          <InputSelect
            label={t('pets.fields.birthDate')}
            value={formatDateDisplay(field.value) ?? undefined}
            leftIcon="calendar"
            onPress={onOpenDatePicker}
            error={fieldState.error?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="importantNotes"
        render={({ field, fieldState }) => (
          <Input
            label={t('pets.fields.importantNotes')}
            value={field.value ?? ''}
            onChangeText={field.onChange}
            error={fieldState.error?.message}
            leftIcon="documentText"
            multiline
          />
        )}
      />
      <Controller
        control={control}
        name="quickNotes"
        render={({ field, fieldState }) => (
          <Input
            label={t('pets.fields.quickNotes')}
            value={field.value ?? ''}
            onChangeText={field.onChange}
            error={fieldState.error?.message}
            leftIcon="documentText"
            multiline
          />
        )}
      />
    </View>
  );
}
