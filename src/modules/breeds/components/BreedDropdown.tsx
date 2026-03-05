import { useState } from 'react';
import { View, Text, Pressable, ScrollView, TextInput } from 'react-native';
import { useTranslation } from 'react-i18next';
import { InputSelect } from '@/src/ui/components/primitives/InputSelect';
import { useGetBreedsByAnimal } from '../hooks/useGetBreedsByAnimal';
import type { BreedDTO } from '../types/breed.types';
import { cn } from '@/src/utils/cn';
import { useDropdown } from '@/src/store/useDropdown';
import { colors } from '@/src/ui/theme/colors';

const DROPDOWN_ID = 'breed-dropdown';

type BreedDropdownProps = {
  label?: string;
  value: BreedDTO | null;
  animalId: number | null;
  onSelect: (breed: BreedDTO) => void;
  error?: string;
};

export function BreedDropdown({ label, value, animalId, onSelect, error }: BreedDropdownProps) {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const { data: breeds } = useGetBreedsByAnimal(animalId);
  const { isOpen, handleToggle, handleSelect } = useDropdown(DROPDOWN_ID);

  const filtered = breeds?.filter((b) => b.name.toLowerCase().includes(search.toLowerCase())) ?? [];

  const handleOpen = () => {
    setSearch('');
    handleToggle();
  };

  return (
    <View className="relative w-full">
      <InputSelect
        label={label}
        placeholder={animalId ? t('breeds.selectPlaceholder') : t('breeds.selectAnimalFirst')}
        value={value?.name}
        leftIcon="branch"
        onPress={animalId ? handleOpen : () => {}}
        error={error}
      />

      {isOpen && animalId && (
        <View
          className={cn(
            'absolute left-0 top-full z-50 w-full rounded-lg border',
            'bg-white dark:bg-neutral-900',
            'border-gray-300 dark:border-neutral-700',
            'max-h-60 overflow-hidden'
          )}>
          <View className="border-b border-gray-200 px-3 py-2 dark:border-neutral-700">
            <TextInput
              placeholder={t('breeds.searchPlaceholder')}
              placeholderTextColor="#9ca3af"
              value={search}
              onChangeText={setSearch}
              className="text-gray-900 dark:text-gray-100"
              autoFocus
            />
          </View>

          <ScrollView nestedScrollEnabled keyboardShouldPersistTaps="handled">
            {filtered.length === 0 ? (
              <View className="px-4 py-3">
                <Text style={{ color: colors.textSecondary }}>{t('breeds.noResults')}</Text>
              </View>
            ) : (
              filtered.map((breed: BreedDTO) => (
                <Pressable
                  key={breed.id}
                  onPress={() => {
                    setSearch('');
                    handleSelect(() => onSelect(breed));
                  }}
                  className="border-b border-gray-300 px-4 py-3 dark:border-neutral-700">
                  <Text className="font-semibold text-gray-900 dark:text-gray-100">
                    {breed.name}
                  </Text>
                </Pressable>
              ))
            )}
          </ScrollView>
        </View>
      )}
    </View>
  );
}
