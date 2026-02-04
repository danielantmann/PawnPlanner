import type { FC } from 'react';
import { Pressable, Text } from 'react-native';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../../utils/cn';
import { Icon } from '@ui/components/primitives/Icon';
import type { IconName } from '@ui/components/primitives/Icon';

// ⭐ Estilos del contenedor (fondo, padding, disabled, etc.)
const buttonStyles = cva('items-center justify-center flex-col rounded-lg', {
  variants: {
    variant: {
      primary: 'bg-primary dark:bg-primaryDark',
      secondary: 'bg-gray-600 dark:bg-gray-700',
      disabled: 'bg-gray-300 dark:bg-gray-600',
      outline: 'border border-primary dark:border-primary',
      'outline-active': 'bg-primary border border-primary dark:bg-primaryDark dark:border-primary',

      // ⭐ NUEVO VARIANT PARA SPEEDDIAL (vertical)
      floating: `
        bg-backgroundAlt dark:bg-backgroundAltDark
        shadow-md
        rounded-xl
        px-4 py-3
        flex-col items-center justify-center
        gap-1
      `,
    },

    size: {
      sm: 'px-3 py-2',
      md: 'px-4 py-3',
      lg: 'px-6 py-4',
    },

    disabled: {
      true: 'opacity-100',
      false: '',
    },
  },

  defaultVariants: {
    variant: 'primary',
    size: 'md',
    disabled: false,
  },
});

// ⭐ Estilos del texto
const textStyles = cva('font-semibold leading-none mt-1 text-center', {
  variants: {
    textColor: {
      white: 'text-white',
      black: 'text-black',
      primary: 'text-primary dark:text-primaryLight',
      dark: 'text-white',
      light: 'text-black',
    },

    textSize: {
      xs: 'text-xs',
      sm: 'text-sm',
      base: 'text-base',
      lg: 'text-lg',
    },
  },

  defaultVariants: {
    textColor: 'white',
    textSize: 'base',
  },
});

interface ButtonProps extends VariantProps<typeof buttonStyles> {
  children?: React.ReactNode;
  icon?: IconName;
  iconSize?: number;
  iconColor?: string; // ⭐ NUEVO
  circle?: 'sm' | 'md' | 'lg';
  onPress?: () => void;
  className?: string;
  textColor?: VariantProps<typeof textStyles>['textColor'];
  textSize?: VariantProps<typeof textStyles>['textSize'];
}

export const Button: FC<ButtonProps> = ({
  children,
  icon,
  iconSize = 22,
  iconColor,
  variant,
  size,
  circle,
  disabled,
  textColor,
  textSize,
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
      android_ripple={null}
      focusable={false}
      pressRetentionOffset={0}
      className={cn(
        buttonStyles({ variant, size, disabled }),
        circleClasses,
        'active:opacity-60',
        'flex-col items-center justify-center',
        className
      )}>
      {icon && <Icon name={icon} size={iconSize} color={iconColor ?? 'white'} fixedColor />}

      {children && (
        <Text className={cn(textStyles({ textColor, textSize }))} numberOfLines={1}>
          {children}
        </Text>
      )}
    </Pressable>
  );
};
