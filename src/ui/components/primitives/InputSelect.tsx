import { View, Text, Pressable, TextInput } from 'react-native';
import { Icon } from '@/src/ui/components/primitives/Icon';
import type { IconName } from '@/src/ui/components/primitives/Icon';
import { cn } from '@/src/utils/cn';

type InputSelectProps = {
  label?: string;
  placeholder?: string;
  value?: string;
  leftIcon?: IconName;
  onPress: () => void;
  error?: string;
};

export const InputSelect = ({
  label,
  placeholder,
  value,
  leftIcon,
  onPress,
  error,
}: InputSelectProps) => {
  return (
    <View className="z-10 w-full">
      {label && (
        <Text className="mb-1 text-xs  font-semibold uppercase text-textSecondary dark:text-textSecondaryDark">
          {label}
        </Text>
      )}

      <View
        className={cn(
          'flex-row items-center overflow-hidden rounded-lg border px-3 py-2',
          'bg-white dark:bg-neutral-900',
          'border-gray-300 dark:border-neutral-700',
          error && 'border-red-500'
        )}>
        {leftIcon && <Icon name={leftIcon} size={20} color="muted" />}

        <TextInput
          className="ml-2 flex-1 text-gray-900 dark:text-gray-100"
          placeholder={placeholder}
          placeholderTextColor="#9ca3af"
          value={value}
          editable={false}
          pointerEvents="none"
        />

        <Icon name="chevronDown" size={20} color="muted" />

        {/* Capa clicable */}
        <Pressable onPress={onPress} className="absolute inset-0" />
      </View>

      {error && <Text className="mt-1 text-sm text-red-500">{error}</Text>}
    </View>
  );
};
