import { View, Pressable, Text } from 'react-native';
import { format, addDays } from 'date-fns';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/src/ui/theme/colors';
import { Button } from '@/src/ui/components/primitives/Button';

interface CalendarHeaderProps {
  date: Date;
  mode: 'day' | '3days' | 'week' | 'month';
  onDateChange: (date: Date) => void;
  onModeChange: (mode: 'day' | '3days' | 'week' | 'month') => void;
}

export function CustomCalendarHeader({
  date,
  mode,
  onDateChange,
  onModeChange,
}: CalendarHeaderProps) {
  const goPrev = () => {
    if (mode === 'month') onDateChange(new Date(date.getFullYear(), date.getMonth() - 1, 1));
    else if (mode === 'week') onDateChange(addDays(date, -7));
    else if (mode === '3days') onDateChange(addDays(date, -3));
    else onDateChange(addDays(date, -1));
  };

  const goNext = () => {
    if (mode === 'month') onDateChange(new Date(date.getFullYear(), date.getMonth() + 1, 1));
    else if (mode === 'week') onDateChange(addDays(date, 7));
    else if (mode === '3days') onDateChange(addDays(date, 3));
    else onDateChange(addDays(date, 1));
  };

  const goToday = () => {
    onModeChange('day');
    onDateChange(new Date());
  };

  const headerTitle =
    mode === 'day'
      ? format(date, 'EEEE d MMMM')
      : mode === '3days'
        ? `${format(date, 'd MMM')} - ${format(addDays(date, 2), 'd MMM yyyy')}`
        : mode === 'week'
          ? `${format(date, 'd MMM')} - ${format(addDays(date, 6), 'd MMM yyyy')}`
          : format(date, 'MMMM yyyy');

  return (
    <View className="px-4 pb-2 pt-4">
      {/* Tabs + Hoy */}
      <View className="mb-2 flex-row items-center gap-2">
        {(['day', '3days', 'week', 'month'] as const).map((m) => {
          const isActive = mode === m;

          return (
            <Button
              key={m}
              variant={isActive ? 'primary' : 'outline'}
              size="sm"
              onPress={() => onModeChange(m)}
              className={`flex-1 !px-1 ${!isActive ? '!border-primary' : ''}`}>
              <Text
                adjustsFontSizeToFit
                numberOfLines={1}
                className={
                  isActive
                    ? 'text-sm font-semibold text-white'
                    : 'text-sm font-semibold text-primary dark:text-primary'
                }>
                {m === 'day' ? 'Día' : m === '3days' ? '3 Días' : m === 'week' ? 'Semana' : 'Mes'}
              </Text>
            </Button>
          );
        })}

        {/* Botón HOY */}
        <Button
          variant="outline"
          size="sm"
          onPress={goToday}
          className="flex-1 !border-primary !px-1">
          <Text
            adjustsFontSizeToFit
            numberOfLines={1}
            className="text-sm font-semibold text-primary dark:text-primary">
            Hoy
          </Text>
        </Button>
      </View>

      {/* Fecha / Navegación */}
      <View className="mb-2 flex-row items-center justify-between">
        <Pressable onPress={goPrev} className="p-2">
          <Ionicons name="chevron-back" size={22} color={colors.primary} />
        </Pressable>

        <Text className="text-base font-bold text-textPrimary dark:text-textPrimaryDark">
          {headerTitle}
        </Text>

        <Pressable onPress={goNext} className="p-2">
          <Ionicons name="chevron-forward" size={22} color={colors.primary} />
        </Pressable>
      </View>
    </View>
  );
}
