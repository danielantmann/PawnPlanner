import { Button } from '@/src/ui/components/primitives/Button';
import { ScreenHeader } from '@/src/ui/components/patterns/ScreenHeader';
import { Label } from '@/src/ui/components/primitives/Label';
import { MiniAppointmentCard } from '@/src/modules/appointments/components/MiniAppointmentCard';
import { EmptyAppointmentsCard } from '@/src/modules/appointments/components/EmptyAppointmentsCard';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { StatsCard } from '@/src/modules/dashboard/components/StatsCard';
import { WeeklyStatsCard } from '@/src/modules/dashboard/components/WeeklyStatsCard';
import { useRouter } from 'expo-router';
import { Skeleton } from '@/src/ui/components/primitives/Skeleton';
import { useHomeUtils } from '@/src/modules/dashboard/hooks/useHomeUtils';
import { useHomeAppointments } from '@/src/modules/appointments/hooks/useHomeAppointments';
import { useHomeDashboard } from '@/src/modules/dashboard/hooks/useHomeDashboard';

export default function HomeScreen() {
  const router = useRouter();
  const { user, formatted, t } = useHomeUtils();
  const {
    mappedAppointments,
    isLoading: loadingAppointments,
    error: errorAppointments,
  } = useHomeAppointments();
  const {
    todayStats,
    loadingToday,
    weeklyStats,
    loadingWeekly,

    hasError: errorDashboard,
  } = useHomeDashboard();

  // ERRORES
  const hasError = errorAppointments || errorDashboard;
  if (hasError) {
    return (
      <ScrollView className="bg-background dark:bg-backgroundDark flex-1 p-4">
        <Text className="text-danger">{t('error.loadingDashboard')}</Text>
      </ScrollView>
    );
  }

  return (
    <ScrollView
      className="bg-background dark:bg-backgroundDark flex-1 p-4"
      contentContainerStyle={{ paddingBottom: 40 }}>
      {/* HEADER */}
      <ScreenHeader
        title={t('home.greeting', { name: user?.firstName || 'User' })}
        subtitle={t('home.today', {
          date: formatted,
          count: mappedAppointments.length,
        })}
      />

      {/* ACCIONES RÁPIDAS */}
      <View className="mb-6 flex-row justify-around">
        <Pressable onPress={() => router.push('../agenda')}>
          <View className="items-center">
            <Button icon="calendar" circle="lg" />
            <Label className="mt-2">{t('home.quickActions.appointment')}</Label>
          </View>
        </Pressable>

        <Pressable>
          <View className="items-center">
            <Button icon="personAdd" circle="lg" />
            <Label className="mt-2">{t('home.quickActions.client')}</Label>
          </View>
        </Pressable>

        <Pressable>
          <View className="items-center">
            <Button icon="paw" circle="lg" />
            <Label className="mt-2">{t('home.quickActions.pet')}</Label>
          </View>
        </Pressable>
      </View>

      {/* CITAS DE HOY */}
      <View className="mb-3 flex-row items-center justify-between">
        <Text className="text-textPrimary dark:text-textPrimaryDark text-lg font-semibold">
          {t('home.appointmentsToday')}
        </Text>

        <Pressable onPress={() => router.push('../agenda')}>
          <Text className="text-primary font-medium">{t('home.seeAll')}</Text>
        </Pressable>
      </View>

      {/* LISTA DE CITAS */}
      {!loadingAppointments ? (
        <>
          {mappedAppointments.length === 0 && (
            <View className="w-full">
              <EmptyAppointmentsCard full />
            </View>
          )}

          {mappedAppointments.length === 1 && (
            <View className="mb-6 w-full">
              <Pressable onPress={() => router.push(`/appointment/${mappedAppointments[0].id}`)}>
                <MiniAppointmentCard {...mappedAppointments[0]} full />
              </Pressable>
            </View>
          )}

          {mappedAppointments.length > 1 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="mb-6"
              decelerationRate="fast">
              {mappedAppointments.map((a) => (
                <Pressable key={a.id} onPress={() => router.push(`/appointment/${a.id}`)}>
                  <MiniAppointmentCard {...a} />
                </Pressable>
              ))}
            </ScrollView>
          )}
        </>
      ) : (
        <Skeleton height={128} className="mb-6" rounded="lg" />
      )}

      {/* MINI ESTADÍSTICAS DEL DÍA */}
      {loadingToday ? (
        <Skeleton height={120} className="mb-4" rounded="lg" />
      ) : todayStats ? (
        <StatsCard
          title={t('home.dailyStats')}
          moreLabel={t('home.more')}
          items={[
            {
              label: t('home.stats.income'),
              value: todayStats.income + '€',
              icon: 'cash',
            },
            {
              label: t('home.stats.completed'),
              value: todayStats.completed,
              icon: 'check',
              color: 'text-success',
            },
            {
              label: t('home.stats.noShows'),
              value: todayStats.noShow,
              icon: 'close',
              color: 'text-danger',
            },
          ]}
          onPressMore={() => router.push('../stats')}
        />
      ) : null}

      {/* RESUMEN SEMANAL */}
      {loadingWeekly ? (
        <Skeleton height={150} className="mb-4" rounded="lg" />
      ) : weeklyStats ? (
        <WeeklyStatsCard
          title={t('home.weeklySummary')}
          totalAppointments={weeklyStats.appointments}
          totalRevenue={weeklyStats.income + '€'}
          cancellations={weeklyStats.cancelled}
          weeklyActivity={weeklyStats.activity}
          onPressMore={() => router.push('../stats')}
        />
      ) : null}
    </ScrollView>
  );
}
