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
      disabled: 'bg-gray-300 dark:bg-gray-600', // ⭐ gris bonito para disabled
      outline: 'border border-gray-400 dark:border-gray-600',
    },

    size: {
      sm: 'px-3 py-2',
      md: 'px-4 py-3',
      lg: 'px-6 py-4',
    },

    disabled: {
      true: 'opacity-100', // ⭐ NO usamos opacity-50 porque queda feo
      false: '',
    },
  },

  defaultVariants: {
    variant: 'primary',
    size: 'md',
    disabled: false,
  },
});

// ⭐ Estilos del texto (separado para evitar heredar bg-primary)
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
      android_ripple={null} // ⭐ elimina highlight azul
      focusable={false} // ⭐ elimina borde de enfoque
      pressRetentionOffset={0} // ⭐ elimina retención rara
      className={cn(
        buttonStyles({ variant, size, disabled }),
        circleClasses,
        'active:opacity-60',
        'flex-col items-center justify-center',
        className
      )}>
      {icon && <Icon name={icon} size={iconSize} color="white" fixedColor />}

      {children && (
        <Text className={cn(textStyles({ textColor, textSize }))} numberOfLines={1}>
          {children}
        </Text>
      )}
    </Pressable>
  );
};
