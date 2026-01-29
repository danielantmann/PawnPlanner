import type { FC, ReactNode } from 'react';
import { Text } from 'react-native';
import { cn } from '@/src/utils/cn';

interface TitleProps {
  children: ReactNode;
  className?: string;
}

export const Title: FC<TitleProps> = ({ children, className }) => (
  <Text className={cn('text-textPrimary dark:text-textPrimaryDark text-2xl font-bold', className)}>
    {children}
  </Text>
);
