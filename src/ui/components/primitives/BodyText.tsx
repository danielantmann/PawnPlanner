import type { FC, ReactNode } from 'react';
import { Text } from 'react-native';
import { cn } from '@/src/utils/cn';

interface BodyTextProps {
  children: ReactNode;
  className?: string;
}

export const BodyText: FC<BodyTextProps> = ({ children, className }) => (
  <Text className={cn('text-textPrimary dark:text-textPrimaryDark text-base', className)}>
    {children}
  </Text>
);
