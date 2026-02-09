import { View, Text, Pressable, ScrollView } from 'react-native';
import { InputSelect } from '@/src/ui/components/primitives/InputSelect';
import { useServices } from '../hooks/useServices';
import type { ServiceDTO } from '../types/service.types';
import { cn } from '@/src/utils/cn';
import { useDropdownStore } from '@/src/store/dropdown.store';

const DROPDOWN_ID = 'service-dropdown';

type ServiceDropdownProps = {
  label?: string;
  value: ServiceDTO | null;
  onSelect: (service: ServiceDTO) => void;
};

export const ServiceDropdown = ({ label, value, onSelect }: ServiceDropdownProps) => {
  const { data: services } = useServices();

  // ⭐ Usar Zustand para el overlay global
  const isOpen = useDropdownStore((state) => state.isDropdownOpen(DROPDOWN_ID));
  const openDropdown = useDropdownStore((state) => state.openDropdown);
  const closeDropdown = useDropdownStore((state) => state.closeDropdown);

  const handleSelect = (service: ServiceDTO) => {
    onSelect(service); // ⭐ NOTIFICAR AL PADRE
    closeDropdown(DROPDOWN_ID);
  };

  return (
    <View className="relative w-full">
      <InputSelect
        label={label}
        placeholder="Seleccionar servicio..."
        value={value?.name} // ⭐ YA MUESTRA EL NOMBRE CORRECTAMENTE
        leftIcon="scissors"
        onPress={() => {
          if (isOpen) {
            closeDropdown(DROPDOWN_ID);
          } else {
            openDropdown(DROPDOWN_ID);
          }
        }}
      />

      {isOpen && services && (
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
                onPress={() => handleSelect(service)}
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
      )}
    </View>
  );
};
