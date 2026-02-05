import { Modal, View, ScrollView, Pressable, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { Button } from '@/src/ui/components/primitives/Button';
import { Input } from '@/src/ui/components/primitives/Input';
import { Label } from '@/src/ui/components/primitives/Label';
import { Title } from '@/src/ui/components/primitives/Title';
import { useCreateAppointment } from '../../hooks/useCreateAppointment';
import { useTranslation } from 'react-i18next';
import type { CreateAppointmentPayload } from '../../types/appointment.types';

import { PetAutocomplete } from '@/src/modules/pets/components/PetAutocomplete';
import type { PetSearchResult } from '@/src/modules/pets/types/pet.types';

import { ServiceDropdown } from '@/src/modules/services/components/ServiceDropdown';
import type { ServiceDTO } from '@/src/modules/services/types/service.types';

import { InputSelect } from '@/src/ui/components/primitives/InputSelect';
import { TimePickerModal } from '@/src/ui/components/patterns/TimePickerModal';
import { useAgendaStore } from '../../store/agenda.store';

interface CreateAppointmentModalProps {
  visible: boolean;
  onClose: () => void;
}

export function CreateAppointmentModal({ visible, onClose }: CreateAppointmentModalProps) {
  const { t } = useTranslation();
  const { mutate: createAppointment } = useCreateAppointment();

  const { selectedDate, selectedHour, selectedMinute } = useAgendaStore();

  // Form state
  const [selectedPet, setSelectedPet] = useState<PetSearchResult | null>(null);
  const [petId, setPetId] = useState('');

  const [selectedService, setSelectedService] = useState<ServiceDTO | null>(null);
  const [serviceId, setServiceId] = useState('');

  const [recommendedPrice, setRecommendedPrice] = useState('');
  const [finalPrice, setFinalPrice] = useState('');

  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');

  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  // ⭐ Cuando se abre el modal desde el calendario → usar esa hora
  useEffect(() => {
    if (selectedHour != null && selectedMinute != null) {
      const start = `${String(selectedHour).padStart(2, '0')}:${String(selectedMinute).padStart(2, '0')}`;
      const end = `${String(selectedHour + 1).padStart(2, '0')}:${String(selectedMinute).padStart(2, '0')}`;

      setStartTime(start);
      setEndTime(end);
    }
  }, [selectedHour, selectedMinute, visible]);

  const handleCreate = async () => {
    if (!petId || !serviceId || !startTime || !endTime) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

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
        setSelectedPet(null);
        setPetId('');
        setSelectedService(null);
        setServiceId('');
        setStartTime('09:00');
        setEndTime('10:00');
        setRecommendedPrice('');
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
        <View className="max-h-4/5 w-full rounded-t-3xl bg-background p-6 dark:bg-backgroundDark">
          {/* HEADER */}
          <View className="mb-6 flex-row items-center justify-between">
            <Title>Nueva Cita</Title>
            <Pressable onPress={onClose}>
              <Label className="text-xl">✕</Label>
            </Pressable>
          </View>

          <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
            {/* 1. Mascota */}
            <View className="mb-2">
              <PetAutocomplete
                label="Mascota"
                value={selectedPet}
                onSelect={(pet) => {
                  setSelectedPet(pet);
                  setPetId(String(pet.id));
                }}
              />
            </View>

            {/* 2. Hora inicio */}
            <View className="mb-6">
              <InputSelect
                label="Hora de inicio"
                value={startTime}
                leftIcon="clock"
                onPress={() => setShowStartPicker(true)}
              />
            </View>

            {/* 3. Hora fin */}
            <View className="mb-4">
              <InputSelect
                label="Hora de fin"
                value={endTime}
                leftIcon="clock"
                onPress={() => setShowEndPicker(true)}
              />
            </View>

            {/* 4. Servicio */}
            <View className="mb-3">
              <ServiceDropdown
                label="Servicio"
                value={selectedService}
                onSelect={(service) => {
                  setSelectedService(service);
                  setServiceId(String(service.id));

                  // ⭐ Precio recomendado
                  setRecommendedPrice(String(service.price));

                  // ⭐ Precio final editable
                  setFinalPrice(String(service.price));
                }}
              />
            </View>

            {/* 5. Precio recomendado (solo lectura) */}
            <View className="mb-2">
              <Label className="mb-2 font-semibold">Precio recomendado</Label>
              <Input
                value={recommendedPrice}
                onChangeText={() => {}} // ⭐ requerido por InputProps
                editable={false}
                leftIcon="pricetag"
                type="number"
              />
            </View>

            {/* 6. Precio final (editable) */}
            <View className="mb-6">
              <Label className="mb-2 font-semibold">Precio final</Label>
              <Input
                placeholder="0.00"
                value={finalPrice}
                onChangeText={setFinalPrice}
                leftIcon="cash"
                type="number"
              />
            </View>
          </ScrollView>

          {/* BOTONES */}
          <View className="mt-6 flex-row gap-3">
            <Button onPress={onClose} icon="close" className="flex-1" />
            <Button onPress={handleCreate} icon="check" className="flex-1" />
          </View>
        </View>
      </View>

      {/* TIME PICKERS */}
      <TimePickerModal
        visible={showStartPicker}
        initialHour={parseInt(startTime.split(':')[0])}
        initialMinute={parseInt(startTime.split(':')[1])}
        onClose={() => setShowStartPicker(false)}
        onConfirm={(h, m) => {
          const formatted = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
          setStartTime(formatted);

          // ⭐ AUTOCOMPLETAR FIN +1 HORA
          const endHour = h + 1;
          const formattedEnd = `${endHour.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
          setEndTime(formattedEnd);

          setShowStartPicker(false);
        }}
      />

      <TimePickerModal
        visible={showEndPicker}
        initialHour={parseInt(endTime.split(':')[0])}
        initialMinute={parseInt(endTime.split(':')[1])}
        onClose={() => setShowEndPicker(false)}
        onConfirm={(h, m) => {
          const formatted = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
          setEndTime(formatted);
          setShowEndPicker(false);
        }}
      />
    </Modal>
  );
}
