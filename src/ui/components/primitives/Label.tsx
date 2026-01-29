import type { FC, ReactNode } from 'react';
import { Text } from 'react-native';
import { cn } from '@/src/utils/cn';

interface LabelProps {
  children: ReactNode;
  className?: string;
}

export const Label: FC<LabelProps> = ({ children, className }) => (
  <Text
    className={cn(
      'text-textSecondary dark:text-textSecondaryDark text-xs font-medium uppercase',
      className
    )}>
    {children}
  </Text>
);
