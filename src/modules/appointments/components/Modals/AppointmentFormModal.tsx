import { Modal, View, ScrollView, Pressable, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { Button } from '@/src/ui/components/primitives/Button';
import { Input } from '@/src/ui/components/primitives/Input';
import { Label } from '@/src/ui/components/primitives/Label';
import { Title } from '@/src/ui/components/primitives/Title';
import { ConfirmModal } from '@/src/ui/components/patterns/ConfirmModal';

import type { AppointmentDTO } from '../../types/appointment.types';

import { PetAutocomplete } from '@/src/modules/pets/components/PetAutocomplete';
import { ServiceDropdown } from '@/src/modules/services/components/ServiceDropdown';
import { WorkerDropdown } from '@/src/modules/workers/components/WorkerDropdown';

import { InputSelect } from '@/src/ui/components/primitives/InputSelect';
import { TimePickerModal } from '@/src/ui/components/patterns/TimePickerModal';

import { useAgendaStore } from '../../store/agenda.store';
import { StatusDropdown } from '../StatusDropdown';
import { useDropdownStore } from '@/src/store/dropdown.store';

import { useAppointmentForm } from '../../hooks/useAppointmentForm';
import { useAppointmentSubmit } from '../../hooks/useAppointmentSubmit';

interface AppointmentFormModalProps {
  visible: boolean;
  onClose: () => void;
  appointment?: AppointmentDTO | null;
  isEditMode?: boolean;
}

export function AppointmentFormModal({
  visible,
  onClose,
  appointment,
  isEditMode = false,
}: AppointmentFormModalProps) {
  const { t } = useTranslation();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const closeAllDropdowns = useDropdownStore((s) => s.closeAllDropdowns);
  const { selectedDate, selectedHour, selectedMinute } = useAgendaStore();

  const {
    formState,
    formErrors,
    selectedPet,
    setSelectedPet,
    selectedService,
    setSelectedService,
    selectedWorker,
    setSelectedWorker,
    recommendedPrice,
    setRecommendedPrice,
    showStartPicker,
    setShowStartPicker,
    showEndPicker,
    setShowEndPicker,
    setFormField,
    setFormErrors,
    resetForm,
  } = useAppointmentForm({
    appointment,
    isEditMode,
    selectedHour,
    selectedMinute,
    visible,
  });

  const { handleSubmit, handleDelete, isCreating, isUpdating, isDeleting } = useAppointmentSubmit({
    selectedDate,
    onSuccess: () => {
      resetForm();
      onClose();
    },
  });

  const isSubmitting = isCreating || isUpdating || isDeleting;

  const handleClose = () => {
    if (isSubmitting) return;
    resetForm();
    onClose();
  };

  const handleDeletePress = () => {
    if (isSubmitting) return;
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    setShowDeleteConfirm(false);
    if (appointment) handleDelete(appointment);
  };

  const getErrorMessage = (field: string): string | null => {
    return formErrors[field]?.[0] || null;
  };

  return (
    <>
      <Modal visible={visible} animationType="slide" transparent>
        <View
          className="flex-1 items-center justify-end bg-black/50"
          onStartShouldSetResponder={() => {
            closeAllDropdowns();
            return false;
          }}>
          <View className="w-full flex-1 rounded-t-3xl bg-background p-6 dark:bg-backgroundDark">
            <View className="mb-6 flex-row items-center justify-between">
              <Title>{isEditMode ? t('appointments.edit') : t('appointments.new')}</Title>
              <Pressable onPress={handleClose}>
                <Label className="text-xl">✕</Label>
              </Pressable>
            </View>

            <ScrollView
              contentContainerStyle={{ paddingBottom: 24 }}
              showsVerticalScrollIndicator
              onScrollBeginDrag={closeAllDropdowns}
              style={{ flex: 1 }}>
              <View style={{ gap: 16 }}>
                <View>
                  <PetAutocomplete
                    label={t('appointments.fields.pet')}
                    value={selectedPet}
                    onSelect={(pet) => {
                      if (isSubmitting) return;
                      closeAllDropdowns();
                      setSelectedPet({ ...pet });
                      setFormField('petId', String(pet.id));
                    }}
                  />
                  {getErrorMessage('petId') && (
                    <Text className="mt-1 text-sm text-red-500">{getErrorMessage('petId')}</Text>
                  )}
                </View>

                <View>
                  <InputSelect
                    label={t('appointments.fields.startTime')}
                    value={formState.startTime}
                    leftIcon="clock"
                    onPress={() => {
                      if (isSubmitting) return;
                      closeAllDropdowns();
                      setShowStartPicker(true);
                    }}
                  />
                  {getErrorMessage('startTime') && (
                    <Text className="mt-1 text-sm text-red-500">
                      {getErrorMessage('startTime')}
                    </Text>
                  )}
                </View>

                <View>
                  <InputSelect
                    label={t('appointments.fields.endTime')}
                    value={formState.endTime}
                    leftIcon="clock"
                    onPress={() => {
                      if (isSubmitting) return;
                      closeAllDropdowns();
                      setShowEndPicker(true);
                    }}
                  />
                  {getErrorMessage('endTime') && (
                    <Text className="mt-1 text-sm text-red-500">{getErrorMessage('endTime')}</Text>
                  )}
                </View>

                <StatusDropdown
                  label={t('appointments.fields.status')}
                  value={formState.status}
                  onSelect={(newStatus) => {
                    if (isSubmitting) return;
                    closeAllDropdowns();
                    setFormField('status', newStatus);
                  }}
                />

                <View>
                  <ServiceDropdown
                    label={t('appointments.fields.service')}
                    value={selectedService}
                    onSelect={(service) => {
                      if (isSubmitting) return;
                      closeAllDropdowns();
                      setSelectedService(service);
                      setFormField('serviceId', String(service.id));
                      setRecommendedPrice(String(service.price));
                      setFormField('finalPrice', String(service.price));
                    }}
                  />
                  {getErrorMessage('serviceId') && (
                    <Text className="mt-1 text-sm text-red-500">
                      {getErrorMessage('serviceId')}
                    </Text>
                  )}
                </View>

                <WorkerDropdown
                  label={t('appointments.fields.worker')}
                  value={selectedWorker}
                  onSelect={(worker) => {
                    if (isSubmitting) return;
                    closeAllDropdowns();
                    setSelectedWorker(worker);
                    setFormField('workerId', worker ? String(worker.id) : '');
                  }}
                />

                <View>
                  <Label className="mb-2 font-semibold">
                    {t('appointments.fields.recommendedPrice')}
                  </Label>
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
                  <Label className="mb-2 font-semibold">
                    {t('appointments.fields.finalPrice')}
                  </Label>
                  <Pressable onPressIn={closeAllDropdowns}>
                    <Input
                      placeholder="0.00"
                      value={formState.finalPrice}
                      editable={!isSubmitting}
                      onChangeText={(v) => setFormField('finalPrice', v)}
                      leftIcon="cash"
                      type="number"
                    />
                  </Pressable>
                  {getErrorMessage('finalPrice') && (
                    <Text className="mt-1 text-sm text-red-500">
                      {getErrorMessage('finalPrice')}
                    </Text>
                  )}
                </View>
              </View>
            </ScrollView>

            <View className="mt-6 flex-row gap-3">
              {isEditMode ? (
                <>
                  <Button
                    onPress={handleDeletePress}
                    icon="trash"
                    className="flex-1"
                    variant="secondary"
                    loading={isDeleting}
                  />
                  <Button
                    onPress={handleClose}
                    icon="close"
                    className="flex-1"
                    disabled={isSubmitting}
                  />
                  <Button
                    onPress={() => handleSubmit(formState, isEditMode, setFormErrors, appointment)}
                    icon="check"
                    className="flex-1"
                    loading={isUpdating}
                  />
                </>
              ) : (
                <>
                  <Button
                    onPress={handleClose}
                    icon="close"
                    className="flex-1"
                    disabled={isSubmitting}
                  />
                  <Button
                    onPress={() => handleSubmit(formState, isEditMode, setFormErrors)}
                    icon="check"
                    className="flex-1"
                    loading={isCreating}
                  />
                </>
              )}
            </View>
          </View>
        </View>
      </Modal>

      <TimePickerModal
        visible={showStartPicker}
        initialHour={parseInt(formState.startTime.split(':')[0])}
        initialMinute={parseInt(formState.startTime.split(':')[1])}
        onClose={() => setShowStartPicker(false)}
        onConfirm={(h, m) => {
          if (isSubmitting) return;
          closeAllDropdowns();
          const formatted = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
          setFormField('startTime', formatted);
          setShowStartPicker(false);
        }}
      />

      <TimePickerModal
        visible={showEndPicker}
        initialHour={parseInt(formState.endTime.split(':')[0])}
        initialMinute={parseInt(formState.endTime.split(':')[1])}
        maxHour={23}
        onClose={() => setShowEndPicker(false)}
        onConfirm={(h, m) => {
          if (isSubmitting) return;
          closeAllDropdowns();
          const formatted = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
          setFormField('endTime', formatted);
          setShowEndPicker(false);
        }}
      />

      <ConfirmModal
        visible={showDeleteConfirm}
        title={t('appointments.delete')}
        message={t('appointments.confirmDelete')}
        isDangerous={true}
        loading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </>
  );
}
