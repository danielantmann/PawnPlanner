import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';
import type { SvgProps } from 'react-native-svg';
import PawPrint from '@assets/logo/paw-print.svg';

// -----------------------------
// Tamaños semánticos
// -----------------------------
const sizes = {
  xs: 14,
  sm: 18,
  md: 22,
  lg: 28,
  xl: 36,
} as const;

// -----------------------------
// Colores semánticos
// -----------------------------
const colors = {
  primary: '#4F46E5',
  danger: '#EF4444',
  success: '#22C55E',
  muted: '#6B7280',
  white: '#FFFFFF',
  black: '#000000',
} as const;

// -----------------------------
// Tipos
// -----------------------------
type IoniconProps = {
  size: number;
  color: string;
};

type SvgIconComponent = React.FC<SvgProps>;
type IoniconComponent = (props: IoniconProps) => React.ReactElement;

// -----------------------------
// Mapa de iconos
// -----------------------------
const iconMap = {
  // SVG branding
  pawPrint: PawPrint as SvgIconComponent,

  // Ionicons funcionales
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
} as const;

export type IconName = keyof typeof iconMap;

type SizeName = keyof typeof sizes;
type ColorName = keyof typeof colors;

type IconProps = {
  name: IconName;
  size?: SizeName | number;
  color?: ColorName | string;
  fixedColor?: boolean;
};

export const Icon = ({ name, size = 'md', color, fixedColor = false }: IconProps) => {
  const scheme = useColorScheme();

  // Resolver tamaño
  const resolvedSize = typeof size === 'number' ? size : sizes[size];

  // Resolver color
  let resolvedColor: string;

  if (color) {
    resolvedColor = colors[color as ColorName] ?? color;
  } else {
    resolvedColor = fixedColor ? colors.white : scheme === 'dark' ? colors.white : colors.black;
  }

  const Component = iconMap[name];

  // Si es Ionicon (función)
  if (typeof Component === 'function' && name !== 'pawPrint') {
    return Component({ size: resolvedSize, color: resolvedColor });
  }

  // Si es SVG (componente)
  const SvgComp = Component as SvgIconComponent;
  return <SvgComp width={resolvedSize} height={resolvedSize} fill={resolvedColor} />;
};
