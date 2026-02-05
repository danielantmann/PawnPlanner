import { useState } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { InputSelect } from '@/src/ui/components/primitives/InputSelect';
import { useServices } from '../hooks/useServices';
import type { ServiceDTO } from '../types/service.types';
import { cn } from '@/src/utils/cn';

type ServiceDropdownProps = {
  label?: string;
  value: ServiceDTO | null;
  onSelect: (service: ServiceDTO) => void;
};

export const ServiceDropdown = ({ label, value, onSelect }: ServiceDropdownProps) => {
  const [open, setOpen] = useState(false);
  const { data: services } = useServices();

  return (
    <View className="relative mb-4 w-full">
      <InputSelect
        label={label}
        placeholder="Seleccionar servicio..."
        value={value?.name}
        leftIcon="scissors"
        onPress={() => setOpen(true)}
      />

      {open && services && (
        <>
          {/* Overlay */}
          <Pressable className="absolute inset-0 z-40" onPress={() => setOpen(false)} />

          {/* Dropdown pegado al input */}
          <View
            className={cn(
              'absolute left-0 top-full z-50 w-full rounded-lg border',
              'bg-white dark:bg-neutral-900',
              'border-gray-300 dark:border-neutral-700',
              'max-h-60 overflow-hidden'
            )}>
            <ScrollView>
              {services.map((service: ServiceDTO) => (
                <Pressable
                  key={service.id}
                  onPress={() => {
                    onSelect(service);
                    setOpen(false);
                  }}
                  className="border-b border-gray-300 px-4 py-3 dark:border-neutral-700">
                  <Text className="font-semibold text-gray-900 dark:text-gray-100">
                    {service.name}
                  </Text>

                  <Text className="text-sm text-gray-600 dark:text-gray-400">
                    Precio: {service.price}€
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </>
      )}
    </View>
  );
};
