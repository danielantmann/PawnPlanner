import type { FC } from 'react';
import { View } from 'react-native';
import { Title } from '@ui/components/primitives/Title';
import { Subtitle } from '@ui/components/primitives/Subtitle';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  className?: string; // opcional para personalizar spacing si lo necesitas
}

export const ScreenHeader: FC<ScreenHeaderProps> = ({ title, subtitle, className }) => (
  <View className={`mb-6 mt-4 ${className ?? ''}`}>
    <Title className="text-textPrimary dark:text-textPrimaryDark">{title}</Title>

    {subtitle && (
      <Subtitle className="text-textSecondary dark:text-textSecondaryDark mt-1">
        {subtitle}
      </Subtitle>
    )}
  </View>
);
