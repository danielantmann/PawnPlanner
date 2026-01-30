import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';
import type { SvgProps } from 'react-native-svg';
import PawPrint from '@assets/logo/paw-print.svg';

const sizes = {
  xs: 14,
  sm: 18,
  md: 22,
  lg: 28,
  xl: 36,
} as const;

const colors = {
  primary: '#4F46E5',
  danger: '#EF4444',
  success: '#22C55E',
  muted: '#6B7280',
  white: '#FFFFFF',
  black: '#000000',
} as const;

type IoniconProps = {
  size: number;
  color: string;
};

type SvgIconComponent = React.FC<SvgProps>;
type IoniconComponent = (props: IoniconProps) => React.ReactElement;

const iconMap = {
  pawPrint: PawPrint as SvgIconComponent,
  calendar: ((props: IoniconProps) => (
    <Ionicons name="calendar-outline" {...props} />
  )) as IoniconComponent,
  cash: ((props: IoniconProps) => <Ionicons name="cash-outline" {...props} />) as IoniconComponent,
  close: ((props: IoniconProps) => (
    <Ionicons name="close-circle-outline" {...props} />
  )) as IoniconComponent,
  stats: ((props: IoniconProps) => (
    <Ionicons name="stats-chart-outline" {...props} />
  )) as IoniconComponent,
  search: ((props: IoniconProps) => (
    <Ionicons name="search-outline" {...props} />
  )) as IoniconComponent,
  person: ((props: IoniconProps) => (
    <Ionicons name="person-outline" {...props} />
  )) as IoniconComponent,
  personAdd: ((props: IoniconProps) => (
    <Ionicons name="person-add-outline" {...props} />
  )) as IoniconComponent,
  paw: ((props: IoniconProps) => <Ionicons name="paw-outline" {...props} />) as IoniconComponent,
  check: ((props: IoniconProps) => (
    <Ionicons name="checkmark-circle-outline" {...props} />
  )) as IoniconComponent,
  mail: ((props: IoniconProps) => <Ionicons name="mail-outline" {...props} />) as IoniconComponent,
  lock: ((props: IoniconProps) => (
    <Ionicons name="lock-closed-outline" {...props} />
  )) as IoniconComponent,
  phone: ((props: IoniconProps) => <Ionicons name="call-outline" {...props} />) as IoniconComponent,
  eye: ((props: IoniconProps) => <Ionicons name="eye-outline" {...props} />) as IoniconComponent,
  eyeOff: ((props: IoniconProps) => (
    <Ionicons name="eye-off-outline" {...props} />
  )) as IoniconComponent,
} as const;

export type IconName = keyof typeof iconMap;

type SizeName = keyof typeof sizes;
type ColorName = keyof typeof colors;

type IconProps = {
  name: IconName;
  size?: SizeName | number;
  color?: ColorName | string;
  strokeColor?: ColorName | string; // ← AÑADIDO
  fixedColor?: boolean;
};

export const Icon = ({ name, size = 'md', color, strokeColor, fixedColor = false }: IconProps) => {
  const scheme = useColorScheme();

  const resolvedSize = typeof size === 'number' ? size : sizes[size];

  let resolvedColor: string;

  if (color) {
    resolvedColor = colors[color as ColorName] ?? color;
  } else {
    resolvedColor = fixedColor ? colors.white : scheme === 'dark' ? colors.white : colors.black;
  }

  const resolvedStroke = strokeColor
    ? (colors[strokeColor as ColorName] ?? strokeColor)
    : resolvedColor; // ← si no se pasa stroke, usamos el mismo color

  const Component = iconMap[name];

  // Ionicons
  if (typeof Component === 'function' && name !== 'pawPrint') {
    return Component({ size: resolvedSize, color: resolvedColor });
  }

  // SVG Icons
  const SvgComp = Component as SvgIconComponent;
  return (
    <SvgComp
      width={resolvedSize}
      height={resolvedSize}
      fill={resolvedColor}
      stroke={resolvedStroke} // ← AÑADIDO
      strokeWidth={2} // ← Ajustable
    />
  );
};
