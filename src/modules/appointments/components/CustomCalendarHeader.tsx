import { View, Pressable, Text, useColorScheme } from 'react-native';
import { format, addDays, addMonths } from 'date-fns';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/src/ui/theme/colors';
import { Button } from '@/src/ui/components/primitives/Button';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const goPrev = () => {
    if (mode === 'month') onDateChange(addMonths(date, -1));
    else if (mode === 'week') onDateChange(addDays(date, -7));
    else if (mode === '3days') onDateChange(addDays(date, -3));
    else onDateChange(addDays(date, -1));
  };

  const goNext = () => {
    if (mode === 'month') onDateChange(addMonths(date, 1));
    else if (mode === 'week') onDateChange(addDays(date, 7));
    else if (mode === '3days') onDateChange(addDays(date, 3));
    else onDateChange(addDays(date, 1));
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
    <View className={`px-4 pb-2 pt-4 ${isDark ? 'bg-backgroundDark' : 'bg-background'}`}>
      {/* Tabs */}
      <View className="mb-3 flex-row items-center gap-2">
        {(['day', '3days', 'week', 'month'] as const).map((m) => {
          const isActive = mode === m;

          return (
            <Button
              key={m}
              variant={isActive ? 'outline-active' : 'outline'}
              size="sm"
              onPress={() => onModeChange(m)}
              className="flex-1 !px-1"
              textColor={isActive ? 'white' : 'primary'}>
              {m === 'day'
                ? t('appointments.viewModes.day')
                : m === '3days'
                  ? t('appointments.viewModes.threeDays')
                  : m === 'week'
                    ? t('appointments.viewModes.week')
                    : t('appointments.viewModes.month')}
            </Button>
          );
        })}
      </View>

      {/* Fecha / Navegación */}
      <View className="flex-row items-center justify-between">
        <Pressable onPress={goPrev} className="p-2">
          <Ionicons name="chevron-back" size={22} color={colors.primary} />
        </Pressable>

        <Text
          className={`text-base font-bold ${isDark ? 'text-textPrimaryDark' : 'text-textPrimary'}`}>
          {headerTitle}
        </Text>

        <Pressable onPress={goNext} className="p-2">
          <Ionicons name="chevron-forward" size={22} color={colors.primary} />
        </Pressable>
      </View>
    </View>
  );
}
