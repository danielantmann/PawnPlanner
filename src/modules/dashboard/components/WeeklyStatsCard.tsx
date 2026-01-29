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
        <Text className="text-textPrimary dark:text-textPrimaryDark text-lg font-semibold">
          {title}
        </Text>

        {onPressMore && (
          <Pressable onPress={onPressMore}>
            <Text className="text-primary font-medium">{t('weeklyStats.seeStats')}</Text>
          </Pressable>
        )}
      </View>

      <View className="bg-backgroundAlt dark:bg-backgroundDarkAlt rounded-2xl p-6 shadow">
        <View className="mb-6 flex-row justify-between">
          {/* Total appointments */}
          <View className="flex-1 items-center">
            <Icon name="calendar" size="lg" color="primary" />
            <Label className="mt-1 text-center">{t('weeklyStats.totalAppointments')}</Label>

            <View className="flex-1" />

            <Text className="text-textPrimary dark:text-textPrimaryDark text-2xl font-bold">
              {totalAppointments}
            </Text>
          </View>

          <View className="bg-border dark:bg-borderDark mx-2 w-px opacity-30" />

          {/* Total revenue */}
          <View className="flex-1 items-center">
            <Icon name="cash" size="lg" color="primary" />
            <Label className="mt-1 text-center">{t('weeklyStats.totalRevenue')}</Label>

            <View className="flex-1" />

            <Text className="text-textPrimary dark:text-textPrimaryDark text-2xl font-bold">
              {totalRevenue}
            </Text>
          </View>

          <View className="bg-border dark:bg-borderDark mx-2 w-px opacity-30" />

          {/* Cancellations */}
          <View className="flex-1 items-center">
            <Icon name="close" size="lg" color="danger" />
            <Label className="mt-1 text-center">{t('weeklyStats.cancellations')}</Label>

            <View className="flex-1" />

            <Text className="text-danger text-2xl font-bold">{cancellations}</Text>
          </View>
        </View>

        <Text className="text-textSecondary dark:text-textSecondaryDark mb-2 text-sm">
          {t('weeklyStats.weeklyActivity')}
        </Text>

        <View className="h-20 flex-row items-end justify-between px-2">
          {weeklyActivity.map((value, index) => (
            <View key={index} className="flex-1 items-center">
              <View className="bg-primary/40 w-3 rounded-t-md" style={{ height: value * 10 }} />
            </View>
          ))}
        </View>

        <View className="mt-2 flex-row justify-between px-2">
          {days.map((day, index) => (
            <View key={index} className="flex-1 items-center">
              <Text className="text-textSecondary dark:text-textSecondaryDark text-xs">{day}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};
