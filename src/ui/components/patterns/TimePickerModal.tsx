import { Modal, View, Pressable, Text, useColorScheme } from 'react-native';
import { useState } from 'react';
import WheelPicker from '@quidone/react-native-wheel-picker';

interface TimePickerModalProps {
  visible: boolean;
  initialHour: number;
  initialMinute: number;
  onClose: () => void;
  onConfirm: (hour: number, minute: number) => void;
}

export function TimePickerModal({
  visible,
  initialHour,
  initialMinute,
  onClose,
  onConfirm,
}: TimePickerModalProps) {
  // Horario del negocio
  const OPEN_HOUR = 8;
  const CLOSE_HOUR = 22;

  // Modo oscuro
  const scheme = useColorScheme();
  const textColor = scheme === 'dark' ? '#FFFFFF' : '#000000';

  // Horas limitadas
  const hours = Array.from({ length: CLOSE_HOUR - OPEN_HOUR + 1 }, (_, i) => {
    const hour = OPEN_HOUR + i;
    return {
      value: hour,
      label: hour.toString().padStart(2, '0'),
    };
  });

  // Minutos en intervalos de 5
  const minutes = Array.from({ length: 12 }, (_, i) => {
    const value = i * 5;
    return {
      value,
      label: value.toString().padStart(2, '0'),
    };
  });

  const [hour, setHour] = useState(initialHour);
  const [minute, setMinute] = useState(initialMinute);

  // ⭐ Overlay con dos líneas moradas un pelín más largas
  const overlay = () => (
    <View style={{ position: 'absolute', width: '100%', height: '100%' }}>
      {/* Línea superior */}
      <View
        style={{
          position: 'absolute',
          top: '42%',
          height: 3,
          left: -4, // ← un pelín más larga
          right: -4, // ← un pelín más larga
          backgroundColor: '#4F46E5',
        }}
      />

      {/* Línea inferior */}
      <View
        style={{
          position: 'absolute',
          top: '58%',
          height: 3,
          left: -4, // ← un pelín más larga
          right: -4, // ← un pelín más larga
          backgroundColor: '#4F46E5',
        }}
      />
    </View>
  );

  return (
    <Modal visible={visible} transparent animationType="fade">
      {/* Fondo oscuro */}
      <Pressable className="flex-1 bg-black/50" onPress={onClose} />

      <View className="absolute bottom-0 w-full rounded-t-2xl bg-white p-6 dark:bg-neutral-900">
        <Text className="mb-4 text-center text-lg font-semibold text-gray-900 dark:text-gray-100">
          Seleccionar hora
        </Text>

        <View className="flex-row items-center justify-center gap-2">
          {/* HORAS */}
          <WheelPicker
            data={hours}
            value={hour}
            onValueChanged={({ item }) => setHour(item.value)}
            style={{ width: 80, height: 200 }}
            itemTextStyle={{
              color: textColor,
              fontSize: 20,
              textAlign: 'center',
            }}
            renderOverlay={overlay}
          />

          {/* DOS PUNTOS */}
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

          {/* MINUTOS */}
          <WheelPicker
            data={minutes}
            value={minute}
            onValueChanged={({ item }) => setMinute(item.value)}
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
          onPress={() => onConfirm(hour, minute)}>
          <Text className="text-center font-semibold text-white">Confirmar</Text>
        </Pressable>
      </View>
    </Modal>
  );
}
