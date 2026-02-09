import { useState, useEffect } from 'react';
import { View, Text, Pressable, ActivityIndicator, ScrollView } from 'react-native';
import { Input } from '@/src/ui/components/primitives/Input';
import { Label } from '@/src/ui/components/primitives/Label';
import { useSearchPets } from '../hooks/useSearchPets';
import type { PetSearchResult } from '../types/pet.types';
import { cn } from '@/src/utils/cn';
import { useDropdownStore } from '@/src/store/dropdown.store';

const DROPDOWN_ID = 'pet-autocomplete';

type PetAutocompleteProps = {
  label?: string;
  value: PetSearchResult | null;
  onSelect: (pet: PetSearchResult) => void;
};

export const PetAutocomplete = ({ label, value, onSelect }: PetAutocompleteProps) => {
  const [query, setQuery] = useState('');

  const isOpen = useDropdownStore((s) => s.isDropdownOpen(DROPDOWN_ID));
  const openDropdown = useDropdownStore((s) => s.openDropdown);
  const closeDropdown = useDropdownStore((s) => s.closeDropdown);

  const { data, isLoading } = useSearchPets(query);

  // ⭐ Sincronizar input con value del padre
  useEffect(() => {
    if (value?.name) {
      setQuery(value.name);
    }
  }, [value]);

  const handleSelect = (pet: PetSearchResult) => {
    onSelect({ ...pet });
    setQuery(pet.name);

    setTimeout(() => {
      closeDropdown(DROPDOWN_ID);
    }, 0);
  };

  return (
    <View className="relative w-full">
      {/* LABEL */}
      {label && <Label className="mb-1 font-semibold">{label}</Label>}

      {/* INPUT */}
      <Input
        placeholder="Buscar mascota..."
        value={query}
        onChangeText={(text) => {
          setQuery(text);
          if (text.length > 0) openDropdown(DROPDOWN_ID);
          else closeDropdown(DROPDOWN_ID);
        }}
        leftIcon="search"
      />

      {/* ⭐ OVERLAY LOCAL (HERMANO DEL DROPDOWN) */}
      {isOpen && (
        <Pressable
          className="absolute inset-0"
          style={{ zIndex: 40 }}
          onPress={() => closeDropdown(DROPDOWN_ID)}
        />
      )}

      {/* ⭐ DROPDOWN */}
      {isOpen && query.length > 1 && (
        <View
          style={{ zIndex: 50 }}
          className={cn(
            'absolute left-0 top-full w-full rounded-lg border',
            'bg-white dark:bg-neutral-900',
            'border-gray-300 dark:border-neutral-700',
            'max-h-60 overflow-hidden'
          )}>
          {isLoading && (
            <View className="items-center p-4">
              <ActivityIndicator size="small" />
            </View>
          )}

          {!isLoading && data?.length === 0 && (
            <View className="p-4">
              <Text className="text-gray-500 dark:text-gray-400">No hay resultados</Text>
            </View>
          )}

          {!isLoading && data && (
            <ScrollView>
              {data.map((pet) => (
                <Pressable
                  key={pet.id}
                  onPress={() => handleSelect(pet)}
                  className="border-b border-gray-300 px-4 py-3 dark:border-neutral-700">
                  <Text className="font-semibold text-gray-900 dark:text-gray-100">
                    {pet.name} {pet.breed ? `– ${pet.breed}` : ''}
                  </Text>

                  <Text className="text-sm text-gray-600 dark:text-gray-400">
                    {pet.ownerName} · {pet.ownerPhone}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          )}
        </View>
      )}
    </View>
  );
};
