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

  // Calendario
  calendar: ((props: IoniconProps) => (
    <Ionicons name="calendar-outline" {...props} />
  )) as IoniconComponent,

  // NUEVOS ICONOS
  add: ((props: IoniconProps) => <Ionicons name="add-outline" {...props} />) as IoniconComponent,

  addCircle: ((props: IoniconProps) => (
    <Ionicons name="add-circle-outline" {...props} />
  )) as IoniconComponent,

  calendarToday: ((props: IoniconProps) => (
    <Ionicons name="calendar-clear-outline" {...props} />
  )) as IoniconComponent,

  // Otros iconos existentes
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
  scissors: ((props: IoniconProps) => (
    <Ionicons name="cut-outline" {...props} />
  )) as IoniconComponent,
  chevronDown: ((props: IoniconProps) => (
    <Ionicons name="chevron-down-outline" {...props} />
  )) as IoniconComponent,
  clock: ((props: IoniconProps) => <Ionicons name="time-outline" {...props} />) as IoniconComponent,
  pricetag: ((props: IoniconProps) => (
    <Ionicons name="pricetag-outline" {...props} />
  )) as IoniconComponent,
  trash: ((props: IoniconProps) => (
    <Ionicons name="trash-outline" {...props} />
  )) as IoniconComponent,
  menu: ((props: IoniconProps) => <Ionicons name="menu-outline" {...props} />) as IoniconComponent,

  // NUEVOS PARA EL MENÚ
  home: ((props: IoniconProps) => <Ionicons name="home-outline" {...props} />) as IoniconComponent,
  people: ((props: IoniconProps) => (
    <Ionicons name="people-outline" {...props} />
  )) as IoniconComponent,
  leaf: ((props: IoniconProps) => <Ionicons name="leaf-outline" {...props} />) as IoniconComponent,
  branch: ((props: IoniconProps) => (
    <Ionicons name="git-branch-outline" {...props} />
  )) as IoniconComponent,
  briefcase: ((props: IoniconProps) => (
    <Ionicons name="briefcase-outline" {...props} />
  )) as IoniconComponent,
  settings: ((props: IoniconProps) => (
    <Ionicons name="settings-outline" {...props} />
  )) as IoniconComponent,
  shapes: ((props: IoniconProps) => (
    <Ionicons name="shapes-outline" {...props} />
  )) as IoniconComponent,
  flash: ((props: IoniconProps) => (
    <Ionicons name="flash-outline" {...props} />
  )) as IoniconComponent,
  edit: ((props: IoniconProps) => (
    <Ionicons name="create-outline" {...props} />
  )) as IoniconComponent,
  chevronLeft: ((props: IoniconProps) => (
    <Ionicons name="chevron-back-outline" {...props} />
  )) as IoniconComponent,

  chevronRight: ((props: IoniconProps) => (
    <Ionicons name="chevron-forward-outline" {...props} />
  )) as IoniconComponent,
  documentText: ((props: IoniconProps) => (
    <Ionicons name="document-text-outline" {...props} />
  )) as IoniconComponent,
} as const;

export type IconName = keyof typeof iconMap;

type SizeName = keyof typeof sizes;
type ColorName = keyof typeof colors;

type IconProps = {
  name: IconName;
  size?: SizeName | number;
  color?: ColorName | string;
  strokeColor?: ColorName | string;
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
    : resolvedColor;

  const Component = iconMap[name];

  if (typeof Component === 'function' && name !== 'pawPrint') {
    // Dejamos tu forma original, que sabes que te funciona
    return Component({ size: resolvedSize, color: resolvedColor });
  }

  const SvgComp = Component as SvgIconComponent;
  return (
    <SvgComp
      width={resolvedSize}
      height={resolvedSize}
      fill={resolvedColor}
      stroke={resolvedStroke}
      strokeWidth={2}
    />
  );
};
