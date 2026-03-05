import { View, Text, Pressable } from 'react-native';
import { Label } from '@ui/components/primitives/Label';
import { Icon } from '@ui/components/primitives/Icon';
import { useTranslation } from 'react-i18next';

export interface WeeklyStatsCardProps {
  title: string;
  totalAppointments: number;
  totalRevenue: string | number;
  cancellations: number;
  weeklyActivity: number[];
  onPressMore?: () => void;
}

export const WeeklyStatsCard = ({
  title,
  totalAppointments,
  totalRevenue,
  cancellations,
  weeklyActivity,
  onPressMore,
}: WeeklyStatsCardProps) => {
  const { t } = useTranslation();

  const rawDays = t('weeklyStats.daysShort', { returnObjects: true });
  const days = Array.isArray(rawDays) ? rawDays : [];

  return (
    <View className="mt-10">
      <View className="mb-3 flex-row items-center justify-between">
        <Text className="text-lg font-semibold text-textPrimary dark:text-textPrimaryDark">
          {title}
        </Text>
        {onPressMore && (
          <Pressable onPress={onPressMore}>
            <Text className="font-medium text-primary">{t('weeklyStats.seeStats')}</Text>
          </Pressable>
        )}
      </View>

      <View className="rounded-2xl bg-backgroundAlt p-6 shadow dark:bg-backgroundAltDark">
        <View className="mb-6 flex-row justify-between">
          <View className="flex-1 items-center">
            <Icon name="calendar" size="lg" color="primary" />
            <Label className="mt-1 text-center">{t('weeklyStats.totalAppointments')}</Label>
            <View className="flex-1" />
            <Text className="text-2xl font-bold text-textPrimary dark:text-textPrimaryDark">
              {totalAppointments}
            </Text>
          </View>

          <View className="mx-2 w-px bg-border opacity-30 dark:bg-borderDark" />

          <View className="flex-1 items-center">
            <Icon name="cash" size="lg" color="primary" />
            <Label className="mt-1 text-center">{t('weeklyStats.totalRevenue')}</Label>
            <View className="flex-1" />
            <Text className="text-2xl font-bold text-textPrimary dark:text-textPrimaryDark">
              {totalRevenue}
            </Text>
          </View>

          <View className="mx-2 w-px bg-border opacity-30 dark:bg-borderDark" />

          <View className="flex-1 items-center">
            <Icon name="close" size="lg" color="danger" />
            <Label className="mt-1 text-center">{t('weeklyStats.cancellations')}</Label>
            <View className="flex-1" />
            <Text className="text-2xl font-bold text-danger">{cancellations}</Text>
          </View>
        </View>

        <Text className="mb-2 text-sm text-textSecondary dark:text-textSecondaryDark">
          {t('weeklyStats.weeklyActivity')}
        </Text>

        <View className="h-20 flex-row items-end justify-between px-2">
          {weeklyActivity.map((value, index) => (
            <View key={index} className="flex-1 items-center">
              <View className="w-3 rounded-t-md bg-primary/40" style={{ height: value * 10 }} />
            </View>
          ))}
        </View>

        <View className="mt-2 flex-row justify-between px-2">
          {days.map((day, index) => (
            <View key={index} className="flex-1 items-center">
              <Text className="text-xs text-textSecondary dark:text-textSecondaryDark">{day}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};
