import { useState } from 'react';
import { TextInput, View, Text, Pressable } from 'react-native';
import { Icon } from '@/src/ui/components/primitives/Icon';
import type { IconName } from '@/src/ui/components/primitives/Icon';
import { cn } from '@/src/utils/cn';

type InputProps = {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  type?: 'text' | 'email' | 'password' | 'number' | 'phone';
  leftIcon?: IconName;
  error?: string;
};

export function Input({
  label,
  placeholder,
  value,
  onChangeText,
  type = 'text',
  leftIcon,
  error,
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === 'password';

  const keyboardType =
    type === 'email'
      ? 'email-address'
      : type === 'number'
        ? 'numeric'
        : type === 'phone'
          ? 'phone-pad'
          : 'default';

  return (
    <View className="z-10 mb-4 w-full">
      {label && <Text className="mb-1 font-medium text-gray-700 dark:text-gray-300">{label}</Text>}

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
          onChangeText={onChangeText}
          secureTextEntry={isPassword && !showPassword}
          autoCapitalize={type === 'email' ? 'none' : 'sentences'}
          keyboardType={keyboardType}
        />

        {isPassword && (
          <Pressable onPress={() => setShowPassword(!showPassword)}>
            <Icon name={showPassword ? 'eyeOff' : 'eye'} size={20} color="muted" />
          </Pressable>
        )}
      </View>

      {error && <Text className="mt-1 text-sm text-red-500">{error}</Text>}
    </View>
  );
}
