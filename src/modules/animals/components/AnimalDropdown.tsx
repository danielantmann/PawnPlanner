import { View, Text, Pressable, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { InputSelect } from '@/src/ui/components/primitives/InputSelect';
import { useGetAnimals } from '../hooks/useGetAnimals';
import type { AnimalDTO } from '../types/animal.types';
import { cn } from '@/src/utils/cn';
import { useDropdown } from '@/src/store/useDropdown';

const DROPDOWN_ID = 'animal-dropdown';

type AnimalDropdownProps = {
  label?: string;
  value: AnimalDTO | null;
  onSelect: (animal: AnimalDTO) => void;
};

export function AnimalDropdown({ label, value, onSelect }: AnimalDropdownProps) {
  const { t } = useTranslation();
  const { data: animals } = useGetAnimals();
  const { isOpen, handleToggle, handleSelect } = useDropdown(DROPDOWN_ID);

  return (
    <View className="relative w-full">
      <InputSelect
        label={label}
        placeholder={t('animals.selectPlaceholder')}
        value={value?.species}
        leftIcon="paw"
        onPress={handleToggle}
      />

      {isOpen && animals && (
        <View
          className={cn(
            'absolute left-0 top-full z-50 w-full rounded-lg border',
            'bg-white dark:bg-neutral-900',
            'border-gray-300 dark:border-neutral-700',
            'max-h-60 overflow-hidden'
          )}>
          <ScrollView nestedScrollEnabled keyboardShouldPersistTaps="handled">
            {animals.map((animal: AnimalDTO) => (
              <Pressable
                key={animal.id}
                onPress={() => handleSelect(() => onSelect(animal))}
                className="border-b border-gray-300 px-4 py-3 dark:border-neutral-700">
                <Text className="font-semibold text-gray-900 dark:text-gray-100">
                  {animal.species}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
}
