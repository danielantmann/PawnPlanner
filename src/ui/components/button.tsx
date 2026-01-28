import { Pressable, Text } from 'react-native';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

const buttonStyles = cva('items-center justify-center', {
  variants: {
    variant: {
      primary: 'bg-blue-600',
      secondary: 'bg-gray-600',
      outline: 'border border-gray-400',
    },
    size: {
      sm: 'px-3 py-2',
      md: 'px-4 py-3',
      lg: 'px-6 py-4',
    },
    rounded: {
      none: 'rounded-none',
      sm: 'rounded-sm',
      md: 'rounded-md',
      full: 'rounded-full',
    },
    disabled: {
      true: 'opacity-50',
      false: '',
    },
    textColor: {
      light: 'text-black',
      dark: 'text-white',
      primary: 'text-blue-600',
      white: 'text-white',
      black: 'text-black',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
    rounded: 'md',
    disabled: false,
    textColor: 'white',
  },
});

interface ButtonProps extends VariantProps<typeof buttonStyles> {
  children: React.ReactNode;
  onPress?: () => void;
  className?: string;
}

export const Button = ({
  children,
  variant,
  size,
  rounded,
  disabled,
  textColor,
  className,
  onPress,
}: ButtonProps) => {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      className={cn(buttonStyles({ variant, size, rounded, disabled }), className)}>
      <Text className={cn(buttonStyles({ textColor }), 'font-semibold')}>{children}</Text>
    </Pressable>
  );
};
