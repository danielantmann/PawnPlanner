import { View, Text, Pressable, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { InputSelect } from '@/src/ui/components/primitives/InputSelect';
import { useServices } from '../hooks/useServices';
import type { ServiceDTO } from '../types/service.types';
import { cn } from '@/src/utils/cn';
import { useDropdown } from '@/src/store/useDropdown';
import { colors } from '@/src/ui/theme/colors';

const DROPDOWN_ID = 'service-dropdown';

type ServiceDropdownProps = {
  label?: string;
  value: ServiceDTO | null;
  onSelect: (service: ServiceDTO) => void;
};

export const ServiceDropdown = ({ label, value, onSelect }: ServiceDropdownProps) => {
  const { t } = useTranslation();
  const { data: services } = useServices();
  const { isOpen, handleToggle, handleSelect } = useDropdown(DROPDOWN_ID);

  return (
    <View className="relative w-full">
      <InputSelect
        label={label}
        placeholder={t('services.searchPlaceholder')}
        value={value?.name}
        leftIcon="scissors"
        onPress={handleToggle}
      />

      {isOpen && services && (
        <View
          className={cn(
            'absolute left-0 top-full z-50 w-full rounded-lg border',
            'bg-white dark:bg-neutral-900',
            'border-gray-300 dark:border-neutral-700',
            'max-h-60 overflow-hidden'
          )}>
          <ScrollView nestedScrollEnabled keyboardShouldPersistTaps="handled">
            {services.map((service: ServiceDTO) => (
              <Pressable
                key={service.id}
                onPress={() => handleSelect(() => onSelect(service))}
                className="border-b border-gray-300 px-4 py-3 dark:border-neutral-700">
                <Text className="font-semibold text-gray-900 dark:text-gray-100">
                  {service.name}
                </Text>

                <Text
                  style={{ color: colors.textSecondary }}
                  className="text-sm dark:text-textSecondaryDark">
                  {t('services.price')}: {service.price}€
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};
