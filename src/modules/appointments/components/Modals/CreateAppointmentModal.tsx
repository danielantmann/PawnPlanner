import { Modal, View, ScrollView, Pressable, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { Button } from '@/src/ui/components/primitives/Button';
import { Input } from '@/src/ui/components/primitives/Input';
import { Label } from '@/src/ui/components/primitives/Label';
import { Title } from '@/src/ui/components/primitives/Title';

import { useCreateAppointment } from '../../hooks/useCreateAppointment';
import { useUpdateAppointment } from '../../hooks/useUpdateAppointment';
import { useDeleteAppointment } from '../../hooks/useDeleteAppointment';

import type {
  CreateAppointmentPayload,
  AppointmentDTO,
  AppointmentStatus,
} from '../../types/appointment.types';

import { PetAutocomplete } from '@/src/modules/pets/components/PetAutocomplete';
import type { PetSearchResult } from '@/src/modules/pets/types/pet.types';

import { ServiceDropdown } from '@/src/modules/services/components/ServiceDropdown';
import type { ServiceDTO } from '@/src/modules/services/types/service.types';

import { InputSelect } from '@/src/ui/components/primitives/InputSelect';
import { TimePickerModal } from '@/src/ui/components/patterns/TimePickerModal';

import { useAgendaStore } from '../../store/agenda.store';
import { appointmentFormSchema } from '../../schemas/appointment.schema';

import { StatusDropdown } from '../StatusDropdown';
import { useDropdownStore } from '@/src/store/dropdown.store';

// ⭐ TIPADO CORRECTO DE PROPS
interface CreateAppointmentModalProps {
  visible: boolean;
  onClose: () => void;
  appointment?: AppointmentDTO | null;
  isEditMode?: boolean;
}

export function CreateAppointmentModal({
  visible,
  onClose,
  appointment,
  isEditMode = false,
}: CreateAppointmentModalProps) {
  const closeAllDropdowns = useDropdownStore((s) => s.closeAllDropdowns);

  const { selectedDate, selectedHour, selectedMinute } = useAgendaStore();

  const { mutate: createAppointment } = useCreateAppointment();
  const { mutate: updateAppointment } = useUpdateAppointment();
  const { mutate: deleteAppointment } = useDeleteAppointment();

  const [selectedPet, setSelectedPet] = useState<PetSearchResult | null>(null);
  const [petId, setPetId] = useState('');

  const [selectedService, setSelectedService] = useState<ServiceDTO | null>(null);
  const [serviceId, setServiceId] = useState('');

  const [recommendedPrice, setRecommendedPrice] = useState('');
  const [finalPrice, setFinalPrice] = useState('');

  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');

  const [status, setStatus] = useState<AppointmentStatus>('completed');

  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const [errors, setErrors] = useState<Record<string, string[]>>({});

  // ⭐ INIT EDIT MODE
  useEffect(() => {
    if (isEditMode && appointment) {
      setPetId(String(appointment.petId));
      setServiceId(String(appointment.serviceId));
      setFinalPrice(String(appointment.finalPrice || 0));
      setStatus(appointment.status);

      const startISO = new Date(appointment.startTime);
      const endISO = new Date(appointment.endTime);

      setStartTime(
        `${String(startISO.getHours()).padStart(2, '0')}:${String(startISO.getMinutes()).padStart(2, '0')}`
      );
      setEndTime(
        `${String(endISO.getHours()).padStart(2, '0')}:${String(endISO.getMinutes()).padStart(2, '0')}`
      );

      setRecommendedPrice(String(appointment.finalPrice || 0));

      setTimeout(() => {
        setSelectedPet({
          id: appointment.petId,
          name: appointment.petName,
        } as any);

        setSelectedService({
          id: appointment.serviceId,
          name: appointment.serviceName,
          price: appointment.finalPrice || 0,
        } as any);
      }, 0);
    } else {
      if (selectedHour != null && selectedMinute != null && visible) {
        const start = `${String(selectedHour).padStart(2, '0')}:${String(selectedMinute).padStart(2, '0')}`;
        const end = `${String(selectedHour + 1).padStart(2, '0')}:${String(selectedMinute).padStart(2, '0')}`;

        setStartTime(start);
        setEndTime(end);
      }
    }
  }, [isEditMode, appointment, selectedHour, selectedMinute, visible]);

  // ⭐ VALIDATION
  const validateForm = () => {
    const formData = {
      petId: parseInt(petId),
      serviceId: parseInt(serviceId),
      startTime,
      endTime,
      finalPrice: finalPrice ? parseFloat(finalPrice) : undefined,
    };

    const result = appointmentFormSchema.safeParse(formData);

    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors as Record<string, string[]>);
      return false;
    }

    setErrors({});
    return true;
  };

  // ⭐ SUBMIT
  const handleSubmit = () => {
    if (!validateForm()) return;

    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const day = String(selectedDate.getDate()).padStart(2, '0');

    const startISO = `${year}-${month}-${day}T${startTime}:00Z`;
    const endISO = `${year}-${month}-${day}T${endTime}:00Z`;

    if (isEditMode && appointment) {
      updateAppointment(
        {
          id: appointment.id,
          data: {
            petId: parseInt(petId),
            serviceId: parseInt(serviceId),
            startTime: startISO,
            endTime: endISO,
            finalPrice: finalPrice ? parseFloat(finalPrice) : undefined,
            status,
          },
        },
        {
          onSuccess: () => {
            onClose();
            Alert.alert('✅', 'Cita actualizada exitosamente');
          },
          onError: (error: any) => {
            console.log('ERROR RAW >>>', error);

            let backendMessage = error.message;

            try {
              const raw = error?.request?._response;
              if (raw) {
                const parsed = JSON.parse(raw);
                backendMessage = parsed.message || backendMessage;
              }
            } catch (_) {}

            Alert.alert('❌', backendMessage);
          },
        }
      );
    } else {
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
          Alert.alert('✅', 'Cita creada exitosamente');
        },
        onError: (error: any) => {
          Alert.alert('❌', error.message || 'Error al crear la cita');
        },
      });
    }
  };

  // ⭐ DELETE
  const handleDelete = () => {
    if (!isEditMode || !appointment) return;

    Alert.alert('Eliminar cita', '¿Estás seguro de que deseas eliminar esta cita?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: () => {
          deleteAppointment(appointment.id, {
            onSuccess: () => {
              onClose();
              Alert.alert('✅', 'Cita eliminada exitosamente');
            },
            onError: (error: any) => {
              Alert.alert('❌', error.message || 'Error al eliminar la cita');
            },
          });
        },
      },
    ]);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      {/* ⭐ ESTE CONTENEDOR CIERRA LOS DROPDOWNS SIN BLOQUEAR TOQUES */}
      <View
        className="flex-1 items-center justify-end bg-black/50"
        onStartShouldSetResponder={() => {
          closeAllDropdowns();
          return false;
        }}>
        <View className="max-h-4/5 w-full rounded-t-3xl bg-background p-6 dark:bg-backgroundDark">
          {/* HEADER */}
          <View className="mb-6 flex-row items-center justify-between">
            <Title>{isEditMode ? 'Editar Cita' : 'Nueva Cita'}</Title>
            <Pressable onPress={onClose}>
              <Label className="text-xl">✕</Label>
            </Pressable>
          </View>

          {/* FORM */}
          <ScrollView
            contentContainerStyle={{ paddingBottom: 24 }}
            showsVerticalScrollIndicator
            nestedScrollEnabled
            onScrollBeginDrag={closeAllDropdowns} // ⭐ Cierra dropdowns al hacer scroll
          >
            <View style={{ gap: 16 }}>
              <PetAutocomplete
                label="Mascota"
                value={selectedPet}
                onSelect={(pet) => {
                  closeAllDropdowns(); // ⭐ Cierra dropdowns al tocar Mascota
                  setSelectedPet({ ...pet });
                  setPetId(String(pet.id));
                }}
              />

              <InputSelect
                label="Hora de inicio"
                value={startTime}
                leftIcon="clock"
                onPress={() => {
                  closeAllDropdowns(); // ⭐ Cierra dropdowns
                  setShowStartPicker(true);
                }}
              />

              <InputSelect
                label="Hora de fin"
                value={endTime}
                leftIcon="clock"
                onPress={() => {
                  closeAllDropdowns(); // ⭐ Cierra dropdowns
                  setShowEndPicker(true);
                }}
              />

              <StatusDropdown
                label="Estado"
                value={status}
                onSelect={(newStatus) => {
                  closeAllDropdowns(); // ⭐ Cierra dropdowns
                  setStatus(newStatus);
                }}
              />

              <ServiceDropdown
                label="Servicio"
                value={selectedService}
                onSelect={(service) => {
                  closeAllDropdowns(); // ⭐ Cierra dropdowns
                  setSelectedService(service);
                  setServiceId(String(service.id));
                  setRecommendedPrice(String(service.price));
                  setFinalPrice(String(service.price));
                }}
              />

              <View>
                <Label className="mb-2 font-semibold">Precio recomendado</Label>

                {/* ⭐ ENVUELTO EN PRESSABLE PARA CERRAR DROPDOWNS */}
                <Pressable onPressIn={closeAllDropdowns}>
                  <Input
                    value={recommendedPrice}
                    editable={false}
                    leftIcon="pricetag"
                    type="number"
                    onChangeText={() => {}}
                  />
                </Pressable>
              </View>

              <View>
                <Label className="mb-2 font-semibold">Precio final</Label>

                {/* ⭐ ENVUELTO EN PRESSABLE PARA CERRAR DROPDOWNS */}
                <Pressable onPressIn={closeAllDropdowns}>
                  <Input
                    placeholder="0.00"
                    value={finalPrice}
                    onChangeText={(v) => setFinalPrice(v)}
                    leftIcon="cash"
                    type="number"
                  />
                </Pressable>
              </View>
            </View>
          </ScrollView>

          {/* BOTONES */}
          <View className="mt-6 flex-row gap-3">
            {isEditMode ? (
              <>
                <Button
                  onPress={handleDelete}
                  icon="trash"
                  className="flex-1"
                  variant="secondary"
                />
                <Button onPress={onClose} icon="close" className="flex-1" />
                <Button onPress={handleSubmit} icon="check" className="flex-1" />
              </>
            ) : (
              <>
                <Button onPress={onClose} icon="close" className="flex-1" />
                <Button onPress={handleSubmit} icon="check" className="flex-1" />
              </>
            )}
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
          closeAllDropdowns(); // ⭐ Cierra dropdowns al confirmar picker
          const formatted = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
          setStartTime(formatted);
          setEndTime(`${String(h + 1).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
          setShowStartPicker(false);
        }}
      />

      <TimePickerModal
        visible={showEndPicker}
        initialHour={parseInt(endTime.split(':')[0])}
        initialMinute={parseInt(endTime.split(':')[1])}
        onClose={() => setShowEndPicker(false)}
        onConfirm={(h, m) => {
          closeAllDropdowns(); // ⭐ Cierra dropdowns al confirmar picker
          const formatted = `${h.toString().padStart(2, '0')}:${String(m).padStart(2, '0')}`;
          setEndTime(formatted);
          setShowEndPicker(false);
        }}
      />
    </Modal>
  );
}
