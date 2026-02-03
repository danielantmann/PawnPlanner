// src/modules/appointments/components/Modals/CreateAppointmentModal.tsx

import { Modal, View, ScrollView, Pressable, Alert } from 'react-native';
import { useState } from 'react';
import { Button } from '@/src/ui/components/primitives/Button';
import { Input } from '@/src/ui/components/primitives/Input';
import { Label } from '@/src/ui/components/primitives/Label';
import { Title } from '@/src/ui/components/primitives/Title';
import { useCreateAppointment } from '../../hooks/useCreateAppointment';
import { useTranslation } from 'react-i18next';
import type { CreateAppointmentPayload } from '../../types/appointment.types';

interface CreateAppointmentModalProps {
  visible: boolean;
  onClose: () => void;
  selectedDate: Date;
}

export function CreateAppointmentModal({
  visible,
  onClose,
  selectedDate,
}: CreateAppointmentModalProps) {
  const { t } = useTranslation();
  const { mutate: createAppointment } = useCreateAppointment();

  // Form state
  const [petId, setPetId] = useState('');
  const [serviceId, setServiceId] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [finalPrice, setFinalPrice] = useState('');

  const handleCreate = async () => {
    if (!petId || !serviceId || !startTime || !endTime) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    // Construct ISO datetime strings
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const day = String(selectedDate.getDate()).padStart(2, '0');

    const startISO = `${year}-${month}-${day}T${startTime}:00Z`;
    const endISO = `${year}-${month}-${day}T${endTime}:00Z`;

    const payload: CreateAppointmentPayload = {
      petId: parseInt(petId),
      serviceId: parseInt(serviceId),
      startTime: startISO,
      endTime: endISO,
      finalPrice: finalPrice ? parseFloat(finalPrice) : undefined,
    };

    createAppointment(payload, {
      onSuccess: () => {
        onClose();
        // Reset form
        setPetId('');
        setServiceId('');
        setStartTime('09:00');
        setEndTime('10:00');
        setFinalPrice('');
        Alert.alert('✅', 'Cita creada exitosamente');
      },
      onError: (error: any) => {
        Alert.alert('❌', error.message || 'Error al crear la cita');
      },
    });
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View className="flex-1 items-center justify-end bg-black/50">
        <View className="bg-background dark:bg-backgroundDark max-h-4/5 w-full rounded-t-3xl p-6">
          {/* Header */}
          <View className="mb-6 flex-row items-center justify-between">
            <Title>Nueva Cita</Title>
            <Pressable onPress={onClose}>
              <Label className="text-xl">✕</Label>
            </Pressable>
          </View>

          {/* Form */}
          <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
            {/* Pet ID - TODO: Replace with dropdown */}
            <View className="mb-4">
              <Label className="mb-2 font-semibold">Mascota</Label>
              <Input placeholder="ID de la mascota" value={petId} onChangeText={setPetId} />
            </View>

            {/* Service ID - TODO: Replace with dropdown */}
            <View className="mb-4">
              <Label className="mb-2 font-semibold">Servicio</Label>
              <Input placeholder="ID del servicio" value={serviceId} onChangeText={setServiceId} />
            </View>

            {/* Start Time */}
            <View className="mb-4">
              <Label className="mb-2 font-semibold">Hora de inicio</Label>
              <Input placeholder="HH:mm" value={startTime} onChangeText={setStartTime} />
            </View>

            {/* End Time */}
            <View className="mb-4">
              <Label className="mb-2 font-semibold">Hora de fin</Label>
              <Input placeholder="HH:mm" value={endTime} onChangeText={setEndTime} />
            </View>

            {/* Final Price */}
            <View className="mb-6">
              <Label className="mb-2 font-semibold">Precio final</Label>
              <Input placeholder="0.00" value={finalPrice} onChangeText={setFinalPrice} />
            </View>
          </ScrollView>

          {/* Actions */}
          <View className="mt-6 flex-row gap-3">
            <Button onPress={onClose} icon="close" className="flex-1" />
            <Button onPress={handleCreate} icon="check" className="flex-1" />
          </View>
        </View>
      </View>
    </Modal>
  );
}
