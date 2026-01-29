import type { FC } from 'react';
import { Pressable, Text } from 'react-native';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../../utils/cn';
import { Icon } from '@ui/components/primitives/Icon';
import type { IconName } from '@ui/components/primitives/Icon';

const buttonStyles = cva('items-center justify-center flex-col', {
  variants: {
    variant: {
      primary: 'bg-primary dark:bg-primaryDark',
      secondary: 'bg-gray-600 dark:bg-gray-700',
      outline: 'border border-gray-400 dark:border-gray-600',
    },

    size: {
      sm: 'px-3 py-2',
      md: 'px-4 py-3',
      lg: 'px-6 py-4',
    },

    disabled: {
      true: 'opacity-50',
      false: '',
    },

    textColor: {
      light: 'text-black',
      dark: 'text-white',
      primary: 'text-primary dark:text-primaryLight',
      white: 'text-white',
      black: 'text-black',
    },
  },

  defaultVariants: {
    variant: 'primary',
    size: 'md',
    disabled: false,
    textColor: 'white',
  },
});

interface ButtonProps extends VariantProps<typeof buttonStyles> {
  children?: React.ReactNode;
  icon?: IconName;
  iconSize?: number;
  circle?: 'sm' | 'md' | 'lg';
  onPress?: () => void;
  className?: string;
}

export const Button: FC<ButtonProps> = ({
  children,
  icon,
  iconSize = 22,
  variant,
  size,
  circle,
  disabled,
  textColor,
  className,
  onPress,
}) => {
  const circleClasses =
    circle === 'sm'
      ? 'w-12 h-12 rounded-full'
      : circle === 'md'
        ? 'w-16 h-16 rounded-full'
        : circle === 'lg'
          ? 'w-20 h-20 rounded-full'
          : '';

  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      className={cn(
        buttonStyles({ variant, size, disabled }),
        circleClasses,
        'active:opacity-60',
        'flex-col items-center justify-center',
        className
      )}>
      {icon && (
        <Icon
          name={icon}
          size={iconSize}
          color="white" // ⭐ PRO: icono blanco siempre
          fixedColor // ⭐ evita que cambie en dark mode
        />
      )}

      {children && (
        <Text
          className={cn(buttonStyles({ textColor }), 'mt-1 text-center text-xs font-semibold')}
          numberOfLines={1}>
          {children}
        </Text>
      )}
    </Pressable>
  );
};
