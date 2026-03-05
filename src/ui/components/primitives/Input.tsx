import { useState } from 'react';
import { TextInput, View, Text, Pressable } from 'react-native';
import { Icon } from '@/src/ui/components/primitives/Icon';
import type { IconName } from '@/src/ui/components/primitives/Icon';
import { cn } from '@/src/utils/cn';

type InputProps = {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText?: (text: string) => void;
  type?: 'text' | 'email' | 'password' | 'number' | 'phone';
  leftIcon?: IconName;
  error?: string;
  editable?: boolean;
  onPressIn?: () => void;
  multiline?: boolean;
  numberOfLines?: number;
};

export function Input({
  label,
  placeholder,
  value,
  onChangeText,
  type = 'text',
  leftIcon,
  error,
  editable = true,
  onPressIn,
  multiline = false,
  numberOfLines = 3,
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
    <View className="z-10 w-full">
      {label && (
        <Text className="mb-1 text-xs font-semibold uppercase text-textSecondary dark:text-textSecondaryDark">
          {label}
        </Text>
      )}
      <Pressable onPressIn={onPressIn} disabled={editable}>
        <View
          className={cn(
            'flex-row overflow-hidden rounded-lg border px-3 py-2',
            multiline ? 'min-h-[100px] items-start' : 'items-center',
            'bg-white dark:bg-neutral-900',
            'border-gray-300 dark:border-neutral-700',
            error && 'border-red-500'
          )}>
          {leftIcon && (
            <View className="pt-0.5">
              <Icon name={leftIcon} size={20} color="muted" />
            </View>
          )}
          <TextInput
            className="ml-2 flex-1 text-gray-900 dark:text-gray-100"
            placeholder={placeholder}
            placeholderTextColor="#9ca3af"
            value={value}
            onChangeText={onChangeText}
            secureTextEntry={isPassword && !showPassword}
            autoCapitalize={type === 'email' ? 'none' : 'sentences'}
            keyboardType={keyboardType}
            editable={editable}
            showSoftInputOnFocus={editable}
            multiline={multiline}
            numberOfLines={multiline ? numberOfLines : undefined}
            textAlignVertical={multiline ? 'top' : 'center'}
            contextMenuHidden={!editable}
          />
          {isPassword && (
            <Pressable onPress={() => setShowPassword(!showPassword)}>
              <Icon name={showPassword ? 'eyeOff' : 'eye'} size={20} color="muted" />
            </Pressable>
          )}
        </View>
      </Pressable>
      {error && <Text className="mt-1 text-sm text-red-500">{error}</Text>}
    </View>
  );
}
