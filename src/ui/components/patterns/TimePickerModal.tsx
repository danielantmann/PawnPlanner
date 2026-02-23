import { Modal, View, Pressable, Text, useColorScheme } from 'react-native';
import { useState, useEffect } from 'react';
import WheelPicker from '@quidone/react-native-wheel-picker';

interface TimePickerModalProps {
  visible: boolean;
  initialHour: number;
  initialMinute: number;
  onClose: () => void;
  onConfirm: (hour: number, minute: number) => void;
  maxHour?: number;
}

export function TimePickerModal({
  visible,
  initialHour,
  initialMinute,
  onClose,
  onConfirm,
  maxHour = 22,
}: TimePickerModalProps) {
  const OPEN_HOUR = 8;
  const CLOSE_HOUR = maxHour;

  const scheme = useColorScheme();
  const textColor = scheme === 'dark' ? '#FFFFFF' : '#000000';

  const hours = Array.from({ length: CLOSE_HOUR - OPEN_HOUR + 1 }, (_, i) => {
    const hour = OPEN_HOUR + i;
    return {
      value: hour,
      label: hour.toString().padStart(2, '0'),
    };
  });

  const minutes = Array.from({ length: 12 }, (_, i) => {
    const value = i * 5;
    return {
      value,
      label: value.toString().padStart(2, '0'),
    };
  });

  const [selectedHour, setSelectedHour] = useState(initialHour);
  const [selectedMinute, setSelectedMinute] = useState(initialMinute);

  useEffect(() => {
    if (visible) {
      setSelectedHour(initialHour);
      setSelectedMinute(initialMinute);
    }
  }, [visible, initialHour, initialMinute]);

  const overlay = () => (
    <View style={{ position: 'absolute', width: '100%', height: '100%' }}>
      <View
        style={{
          position: 'absolute',
          top: '42%',
          height: 3,
          left: -4,
          right: -4,
          backgroundColor: '#4F46E5',
        }}
      />

      <View
        style={{
          position: 'absolute',
          top: '58%',
          height: 3,
          left: -4,
          right: -4,
          backgroundColor: '#4F46E5',
        }}
      />
    </View>
  );

  return (
    <Modal visible={visible} transparent animationType="fade">
      <Pressable className="flex-1 bg-black/50" onPress={onClose} />

      <View className="absolute bottom-0 w-full rounded-t-2xl bg-white p-6 dark:bg-neutral-900">
        <Text className="mb-4 text-center text-lg font-semibold text-gray-900 dark:text-gray-100">
          Seleccionar hora
        </Text>

        <View className="flex-row items-center justify-center gap-2">
          <WheelPicker
            data={hours}
            value={selectedHour}
            onValueChanged={({ item }) => setSelectedHour(item.value)}
            style={{ width: 80, height: 200 }}
            itemTextStyle={{
              color: textColor,
              fontSize: 20,
              textAlign: 'center',
            }}
            renderOverlay={overlay}
          />

          <Text
            style={{
              color: textColor,
              fontSize: 28,
              fontWeight: '600',
              marginHorizontal: 4,
              transform: [{ translateY: -3 }],
            }}>
            :
          </Text>

          <WheelPicker
            data={minutes}
            value={selectedMinute}
            onValueChanged={({ item }) => setSelectedMinute(item.value)}
            style={{ width: 80, height: 200 }}
            itemTextStyle={{
              color: textColor,
              fontSize: 20,
              textAlign: 'center',
            }}
            renderOverlay={overlay}
          />
        </View>

        <Pressable
          className="mt-6 rounded-lg bg-primary py-3"
          onPress={() => onConfirm(selectedHour, selectedMinute)}>
          <Text className="text-center font-semibold text-white">Confirmar</Text>
        </Pressable>
      </View>
    </Modal>
  );
}
