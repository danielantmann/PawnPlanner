import { View, useColorScheme, ViewStyle } from 'react-native';
import { colors } from '@/src/ui/theme/colors';

interface SkeletonProps {
  height?: number;
  width?: number | string;
  rounded?: 'sm' | 'md' | 'lg' | 'full';
  className?: string;
}

export function Skeleton({
  height = 120,
  width = '100%',
  rounded = 'md',
  className = '',
}: SkeletonProps) {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  const roundedStyles: Record<string, number> = {
    sm: 4,
    md: 8,
    lg: 12,
    full: 9999,
  };

  const style: ViewStyle = {
    height,
    width: typeof width === 'string' ? '100%' : width,
    backgroundColor: isDark ? colors.skeletonDark : colors.skeleton,
    borderRadius: roundedStyles[rounded],
  };

  return <View className={`${className} animate-pulse`} style={style} />;
}
