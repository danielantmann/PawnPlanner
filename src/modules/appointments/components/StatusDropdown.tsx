import { View, Pressable, Text, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
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
  { label: 'appointments.status.completed', value: 'completed' },
  { label: 'appointments.status.noShow', value: 'no-show' },
  { label: 'appointments.status.cancelled', value: 'cancelled' },
];

const DROPDOWN_ID = 'status-dropdown';

export const StatusDropdown = ({ label, value, onSelect }: StatusDropdownProps) => {
  const { t } = useTranslation();
  const { isOpen, handleToggle, handleSelect } = useDropdown(DROPDOWN_ID);

  const selectedLabelKey = STATUS_OPTIONS.find((opt) => opt.value === value)?.label;
  const selectedLabel = selectedLabelKey ? t(selectedLabelKey) : t('appointments.fields.status');

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
          <ScrollView nestedScrollEnabled keyboardShouldPersistTaps="handled">
            {STATUS_OPTIONS.map((option) => (
              <Pressable
                key={option.value}
                onPress={() => handleSelect(() => onSelect(option.value))}
                className="border-b border-gray-300 px-4 py-3 dark:border-neutral-700">
                <Text className="font-semibold text-gray-900 dark:text-gray-100">
                  {t(option.label)}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};
