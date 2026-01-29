import type { FC, ReactNode } from 'react';
import { Text } from 'react-native';
import { cn } from '@/src/utils/cn';

interface SubtitleProps {
  children: ReactNode;
  className?: string;
}

export const Subtitle: FC<SubtitleProps> = ({ children, className }) => (
  <Text className={cn('text-textSecondary dark:text-textSecondaryDark mt-1', className)}>
    {children}
  </Text>
);
