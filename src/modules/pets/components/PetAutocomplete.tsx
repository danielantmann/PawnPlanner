// src/modules/pets/components/PetAutocomplete.tsx

import { useState } from 'react';
import { View, Text, Pressable, ActivityIndicator, ScrollView } from 'react-native';
import { Input } from '@/src/ui/components/primitives/Input';
import { Label } from '@/src/ui/components/primitives/Label';
import { useSearchPets } from '../hooks/useSearchPets';
import type { PetSearchResult } from '../types/pet.types';
import { cn } from '@/src/utils/cn';

type PetAutocompleteProps = {
  label?: string;
  value: PetSearchResult | null;
  onSelect: (pet: PetSearchResult) => void;
};

export const PetAutocomplete = ({ label, value, onSelect }: PetAutocompleteProps) => {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);

  const { data, isLoading } = useSearchPets(query);

  const handleSelect = (pet: PetSearchResult) => {
    onSelect(pet);
    setQuery(pet.name);
    setOpen(false);
  };

  return (
    <View className="relative mb-4 w-full">
      {/* ⭐ Label igual que precio recomendado/final */}
      {label && <Label className="mb-1 font-semibold">{label}</Label>}

      {/* Neutralizamos el mb-4 del Input */}
      <View className="-mb-4">
        <Input
          placeholder="Buscar mascota..."
          value={query}
          onChangeText={(text) => {
            setQuery(text);
            setOpen(true);
          }}
          leftIcon="search"
        />
      </View>

      {open && query.length > 1 && (
        <>
          <Pressable className="absolute inset-0 z-40" onPress={() => setOpen(false)} />

          <View
            className={cn(
              'absolute left-0 top-full z-50 w-full rounded-lg border',
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
        </>
      )}
    </View>
  );
};
