import { View, Pressable, Text, ScrollView } from 'react-native';
import { InputSelect } from '@/src/ui/components/primitives/InputSelect';
import type { AppointmentStatus } from '../types/appointment.types';
import { cn } from '@/src/utils/cn';
import { useDropdown } from '@/src/store/useDropdown';

type StatusDropdownProps = {
  label?: string;
  value: AppointmentStatus;
  onSelect: (status: AppointmentStatus) => void;
};

const STATUS_OPTIONS: { label: string; value: AppointmentStatus }[] = [
  { label: 'Completada', value: 'completed' },
  { label: 'No presentó', value: 'no-show' },
  { label: 'Cancelada', value: 'cancelled' },
];

const DROPDOWN_ID = 'status-dropdown';

export const StatusDropdown = ({ label, value, onSelect }: StatusDropdownProps) => {
  const { isOpen, handleToggle, handleSelect } = useDropdown(DROPDOWN_ID);

  const selectedLabel =
    STATUS_OPTIONS.find((opt) => opt.value === value)?.label || 'Seleccionar estado';

  return (
    <View className="relative w-full">
      <InputSelect label={label} value={selectedLabel} leftIcon="check" onPress={handleToggle} />

      {isOpen && (
        <View
          className={cn(
            'absolute left-0 top-full z-50 w-full rounded-lg border',
            'bg-white dark:bg-neutral-900',
            'border-gray-300 dark:border-neutral-700',
            'max-h-60 overflow-hidden shadow-lg'
          )}>
          <ScrollView>
            {STATUS_OPTIONS.map((option) => (
              <Pressable
                key={option.value}
                onPress={() => handleSelect(() => onSelect(option.value))}
                className="border-b border-gray-300 px-4 py-3 dark:border-neutral-700">
                <Text className="font-semibold text-gray-900 dark:text-gray-100">
                  {option.label}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};
