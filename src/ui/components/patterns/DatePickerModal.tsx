import { Modal, View, Pressable, Text, useColorScheme } from 'react-native';
import { useState, useEffect } from 'react';
import WheelPicker from '@quidone/react-native-wheel-picker';
import { useTranslation } from 'react-i18next';

interface DatePickerModalProps {
  visible: boolean;
  initialDay: number;
  initialMonth: number; // 1–12
  initialYear: number;
  onClose: () => void;
  onConfirm: (day: number, month: number, year: number) => void;
  minYear?: number;
  maxYear?: number;
}

export function DatePickerModal({
  visible,
  initialDay,
  initialMonth,
  initialYear,
  onClose,
  onConfirm,
  minYear = 1950,
  maxYear = new Date().getFullYear(),
}: DatePickerModalProps) {
  const { t } = useTranslation();
  const scheme = useColorScheme();
  const textColor = scheme === 'dark' ? '#FFFFFF' : '#000000';

  // Meses traducidos
  const months = Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    label: t(`months.${i + 1}`),
  }));

  const days = Array.from({ length: 31 }, (_, i) => ({
    value: i + 1,
    label: (i + 1).toString().padStart(2, '0'),
  }));

  const years = Array.from({ length: maxYear - minYear + 1 }, (_, i) => {
    const year = maxYear - i;
    return { value: year, label: year.toString() };
  });

  const [day, setDay] = useState(initialDay);
  const [month, setMonth] = useState(initialMonth);
  const [year, setYear] = useState(initialYear);

  useEffect(() => {
    if (visible) {
      setDay(initialDay);
      setMonth(initialMonth);
      setYear(initialYear);
    }
  }, [visible, initialDay, initialMonth, initialYear]);

  const overlay = () => (
    <View className="absolute h-full w-full">
      <View className="absolute left-[-4px] right-[-4px] top-[42%] h-[3px] bg-primary" />
      <View className="absolute left-[-4px] right-[-4px] top-[58%] h-[3px] bg-primary" />
    </View>
  );

  return (
    <Modal visible={visible} transparent animationType="fade">
      <Pressable className="flex-1 bg-black/50" onPress={onClose} />

      <View className="absolute bottom-0 w-full rounded-t-2xl bg-white p-6 dark:bg-neutral-900">
        <Text className="mb-4 text-center text-lg font-semibold text-gray-900 dark:text-gray-100">
          {t('datePicker.title')}
        </Text>

        {/* ORDEN FIJO: DÍA → MES → AÑO */}
        <View className="flex-row items-center justify-center gap-4">
          {/* DÍA */}
          <View className="w-20">
            <WheelPicker
              data={days}
              value={day}
              onValueChanged={({ item }) => setDay(item.value)}
              style={{ height: 200 }}
              itemTextStyle={{
                color: textColor,
                fontSize: 20,
                textAlign: 'center',
              }}
              renderOverlay={overlay}
            />
          </View>

          {/* MES */}
          <View className="w-28">
            <WheelPicker
              data={months}
              value={month}
              onValueChanged={({ item }) => setMonth(item.value)}
              style={{ height: 200 }}
              itemTextStyle={{
                color: textColor,
                fontSize: 20,
                textAlign: 'center',
              }}
              renderOverlay={overlay}
            />
          </View>

          {/* AÑO */}
          <View className="w-24">
            <WheelPicker
              data={years}
              value={year}
              onValueChanged={({ item }) => setYear(item.value)}
              style={{ height: 200 }}
              itemTextStyle={{
                color: textColor,
                fontSize: 20,
                textAlign: 'center',
              }}
              renderOverlay={overlay}
            />
          </View>
        </View>

        <Pressable
          className="mt-6 rounded-lg bg-primary py-3"
          onPress={() => onConfirm(day, month, year)}>
          <Text className="text-center font-semibold text-white">{t('datePicker.confirm')}</Text>
        </Pressable>
      </View>
    </Modal>
  );
}
