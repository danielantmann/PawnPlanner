import { Button } from '@/src/ui/components/primitives/Button';
import { ScreenHeader } from '@/src/ui/components/patterns/ScreenHeader';
import { Label } from '@/src/ui/components/primitives/Label';
import {
  MiniAppointmentCard,
  MiniAppointmentCardProps,
} from '@/src/modules/appointments/components/MiniAppointmentCard';
import { EmptyAppointmentsCard } from '@/src/modules/appointments/components/EmptyAppointmentsCard';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { StatsCard } from '@/src/modules/dashboard/components/StatsCard';
import { WeeklyStatsCard } from '@/src/modules/dashboard/components/WeeklyStatsCard';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import i18n from '@/src/i18n';

export default function HomeScreen() {
  const router = useRouter();
  const { t } = useTranslation();

  const appointments: MiniAppointmentCardProps[] = [
    {
      id: 1,
      petName: 'Luna',
      ownerName: 'María Gómez',
      serviceName: 'Baño y corte',
      time: '10:30',
      status: 'completed',
    },
    {
      id: 2,
      petName: 'Luna',
      ownerName: 'María Gómez',
      serviceName: 'Baño y corte',
      time: '10:30',
      status: 'cancelled',
    },
  ];

  const locale = i18n.language;
  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
  const formatted = capitalize(
    new Date().toLocaleDateString(locale === 'es' ? 'es-ES' : 'en-US', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    })
  );

  return (
    <ScrollView
      className="bg-background dark:bg-backgroundDark flex-1 p-4"
      contentContainerStyle={{ paddingBottom: 40 }}>
      <ScreenHeader
        title={t('home.greeting', { name: 'Daniel' })}
        subtitle={t('home.today', {
          date: formatted,
          count: appointments.length,
        })}
      />

      {/* Acciones rápidas */}
      <View className="mb-6 flex-row justify-around">
        <View className="items-center">
          <Button icon="calendar" circle="lg" />
          <Label className="mt-2">{t('home.quickActions.appointment')}</Label>
        </View>

        <View className="items-center">
          <Button icon="personAdd" circle="lg" />
          <Label className="mt-2">{t('home.quickActions.client')}</Label>
        </View>

        <View className="items-center">
          <Button icon="paw" circle="lg" />
          <Label className="mt-2">{t('home.quickActions.pet')}</Label>
        </View>
      </View>

      {/* Citas de hoy */}
      <View className="mb-3 flex-row items-center justify-between">
        <Text className="text-textPrimary dark:text-textPrimaryDark text-lg font-semibold">
          {t('home.appointmentsToday')}
        </Text>

        <Pressable onPress={() => router.push('/agenda')}>
          <Text className="text-primary font-medium">{t('home.seeAll')}</Text>
        </Pressable>
      </View>

      {/* Render dinámico */}
      {appointments.length === 0 && (
        <View className="w-full">
          <EmptyAppointmentsCard full />
        </View>
      )}

      {appointments.length === 1 && (
        <View className="w-full">
          <Pressable onPress={() => router.push(`/appointment/${appointments[0].id}`)}>
            <MiniAppointmentCard {...appointments[0]} full />
          </Pressable>
        </View>
      )}

      {appointments.length > 1 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {appointments.map((a) => (
            <Pressable key={a.id} onPress={() => router.push(`/appointment/${a.id}`)}>
              <MiniAppointmentCard {...a} />
            </Pressable>
          ))}
        </ScrollView>
      )}

      {/* Mini estadísticas */}
      <StatsCard
        title={t('home.dailyStats')}
        moreLabel={t('home.more')}
        items={[
          {
            label: t('home.stats.income'),
            value: '120€',
            icon: 'cash',
          },
          {
            label: t('home.stats.completed'),
            value: 4,
            icon: 'check',
            color: 'text-success',
          },
          {
            label: t('home.stats.noShows'),
            value: 1,
            icon: 'close',
            color: 'text-danger',
          },
        ]}
        onPressMore={() => router.push('/stats')}
      />

      {/* Resumen semanal */}
      <WeeklyStatsCard
        title={t('home.weeklySummary')}
        totalAppointments={32}
        totalRevenue="820€"
        cancellations={3}
        weeklyActivity={[4, 6, 3, 5, 7, 2, 4]}
        onPressMore={() => router.push('/stats')}
      />
    </ScrollView>
  );
}
