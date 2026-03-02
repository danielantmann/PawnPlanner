import { Modal, View, ScrollView, Pressable, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';

import { Button } from '@/src/ui/components/primitives/Button';
import { Input } from '@/src/ui/components/primitives/Input';
import { Title } from '@/src/ui/components/primitives/Title';
import { ConfirmModal } from '@/src/ui/components/patterns/ConfirmModal';
import { StepIndicator } from '@/src/ui/components/patterns/StepIndicator';

import { useOwnerForm } from '../../hooks/useOwnerForm';
import { usePetForm } from '@/src/modules/pets/hooks/usePetForm';

import { AnimalDropdown } from '@/src/modules/animals/components/AnimalDropdown';
import { BreedDropdown } from '@/src/modules/breeds/components/BreedDropdown';

import { useCreateOwner } from '../../hooks/useCreateOwner';
import { useUpdateOwner } from '../../hooks/useUpdateOwner';
import { useDeleteOwner } from '../../hooks/useDeleteOwner';

import { validateOwnerForm } from '../../schemas/owner.schema';
import { validatePetForm } from '@/src/modules/pets/schemas/pet.schema';

import { DatePickerModal } from '@/src/ui/components/patterns/DatePickerModal';

import type { OwnerDTO } from '../../types/owner.types';

export function OwnerFormModal({
  visible,
  onClose,
  owner,
  isEditMode = false,
}: {
  visible: boolean;
  onClose: () => void;
  owner?: OwnerDTO | null;
  isEditMode?: boolean;
}) {
  const { t } = useTranslation();

  const [step, setStep] = useState(0);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const { formState, formErrors, setFormField, setFormErrors, resetForm } = useOwnerForm({
    owner,
    isEditMode,
    visible,
  });

  const { petState, petErrors, setPetField, setPetErrors, resetPetForm } = usePetForm();

  const { mutateAsync: createOwner, isPending: isCreating } = useCreateOwner();
  const { mutateAsync: updateOwner, isPending: isUpdating } = useUpdateOwner();
  const { mutateAsync: deleteOwner, isPending: isDeleting } = useDeleteOwner();

  const isSubmitting = isCreating || isUpdating || isDeleting;

  const getError = (field: string) => formErrors[field]?.[0] || undefined;

  const getPetError = (field: keyof typeof petState) => {
    const key = petErrors[field]?.[0];
    return key ? t(key) : undefined;
  };

  const handleClose = () => {
    if (isSubmitting) return;
    resetForm();
    resetPetForm();
    setStep(0);
    onClose();
  };

  const handleNext = () => {
    const result = validateOwnerForm(formState);
    if (!result.success) {
      setFormErrors(result.errors as Record<string, string[]>);
      return;
    }
    setStep(1);
  };

  const handleSkip = async () => {
    await createOwner({ owner: formState });
    resetForm();
    resetPetForm();
    setStep(0);
    onClose();
  };

  const handleSubmit = async () => {
    const result = validatePetForm(petState);
    if (!result.success) {
      setPetErrors(result.errors as Record<string, string[]>);
      return;
    }

    await createOwner({
      owner: formState,
      pet: {
        animalId: petState.animalId,
        breedId: petState.breedId,
        name: petState.name,
        birthDate: petState.birthDate,
        importantNotes: petState.importantNotes,
        quickNotes: petState.quickNotes,
      },
    });

    resetForm();
    resetPetForm();
    setStep(0);
    onClose();
  };

  const handleConfirmDelete = async () => {
    if (!owner) return;
    try {
      await deleteOwner(owner.id);
      setShowDeleteConfirm(false);
      resetForm();
      onClose();
    } catch {
      setShowDeleteConfirm(false);
    }
  };

  return (
    <>
      <Modal visible={visible} animationType="slide" transparent>
        <View className="flex-1 items-center justify-end bg-black/50">
          <View className="w-full flex-1 rounded-t-3xl bg-background p-6 dark:bg-backgroundDark">
            {/* HEADER */}
            <View className="mb-6 flex-row items-center justify-between">
              <Title>{isEditMode ? t('owners.edit') : t('owners.new')}</Title>
              <Pressable onPress={handleClose}>
                <Text className="text-xl text-textSecondary dark:text-textSecondaryDark">✕</Text>
              </Pressable>
            </View>

            {/* STEP INDICATOR */}
            {!isEditMode && <StepIndicator step={step} />}

            {/* CONTENT */}
            <ScrollView
              contentContainerStyle={{ paddingBottom: 24 }}
              showsVerticalScrollIndicator={false}
              style={{ flex: 1 }}>
              {/* STEP 0 — OWNER */}
              {step === 0 && (
                <View style={{ gap: 16 }}>
                  <Input
                    label={t('owners.fields.name')}
                    placeholder={t('owners.fields.namePlaceholder')}
                    value={formState.name}
                    onChangeText={(v) => setFormField('name', v)}
                    leftIcon="person"
                    editable={!isSubmitting}
                    error={getError('name')}
                  />

                  <Input
                    label={t('owners.fields.email')}
                    placeholder={t('owners.fields.emailPlaceholder')}
                    value={formState.email}
                    onChangeText={(v) => setFormField('email', v)}
                    leftIcon="mail"
                    type="email"
                    editable={!isSubmitting}
                    error={getError('email')}
                  />

                  <Input
                    label={t('owners.fields.phone')}
                    placeholder={t('owners.fields.phonePlaceholder')}
                    value={formState.phone}
                    onChangeText={(v) => setFormField('phone', v)}
                    leftIcon="phone"
                    type="phone"
                    editable={!isSubmitting}
                    error={getError('phone')}
                  />
                </View>
              )}

              {/* STEP 1 — PET */}
              {step === 1 && (
                <View style={{ gap: 16 }}>
                  <Text className="text-gray-500 dark:text-gray-300">
                    {t('pets.optionalMessage')}
                  </Text>

                  {/* Dropdowns SIN iconos externos */}
                  <AnimalDropdown
                    label={t('pets.fields.animalType')}
                    value={petState.animal}
                    onSelect={(animal) => {
                      setPetField('animal', animal);
                      setPetField('animalId', animal.id);
                      setPetField('breed', null);
                      setPetField('breedId', null);
                    }}
                  />

                  <BreedDropdown
                    label={t('pets.fields.breed')}
                    value={petState.breed}
                    animalId={petState.animalId}
                    onSelect={(breed) => {
                      setPetField('breed', breed);
                      setPetField('breedId', breed.id);
                    }}
                  />

                  <Input
                    label={t('pets.fields.name')}
                    value={petState.name}
                    onChangeText={(v) => setPetField('name', v)}
                    error={getPetError('name')}
                    leftIcon="pawPrint"
                  />

                  {/* Fecha con DatePicker */}
                  <Input
                    label={t('pets.fields.birthDate')}
                    value={petState.birthDate ?? ''}
                    onPressIn={() => setShowDatePicker(true)}
                    leftIcon="calendar"
                    editable={false}
                    error={getPetError('birthDate')}
                  />

                  <Input
                    label={t('pets.fields.importantNotes')}
                    value={petState.importantNotes}
                    onChangeText={(v) => setPetField('importantNotes', v)}
                    error={getPetError('importantNotes')}
                    leftIcon="documentText"
                  />

                  <Input
                    label={t('pets.fields.quickNotes')}
                    value={petState.quickNotes}
                    onChangeText={(v) => setPetField('quickNotes', v)}
                    error={getPetError('quickNotes')}
                    leftIcon="documentText"
                  />
                </View>
              )}
            </ScrollView>

            {/* FOOTER BUTTONS */}
            <View className="mt-6 flex-row gap-3">
              {isEditMode ? (
                <>
                  <Button
                    onPress={() => setShowDeleteConfirm(true)}
                    icon="trash"
                    className="flex-1"
                    variant="secondary"
                    loading={isDeleting}
                    disabled={isSubmitting}
                  />
                  <Button
                    onPress={handleClose}
                    icon="close"
                    className="flex-1"
                    disabled={isSubmitting}
                  />
                  <Button
                    onPress={() => updateOwner({ id: owner!.id, payload: formState })}
                    icon="check"
                    className="flex-1"
                    loading={isUpdating}
                    disabled={isSubmitting}
                  />
                </>
              ) : step === 0 ? (
                <>
                  <Button onPress={handleClose} icon="close" className="flex-1" />
                  <Button onPress={handleNext} icon="chevronRight" className="flex-1" />
                </>
              ) : (
                <>
                  <Button onPress={() => setStep(0)} icon="chevronLeft" className="flex-1" />
                  <Button onPress={handleSkip} icon="close" className="flex-1" />
                  <Button
                    onPress={handleSubmit}
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

      {/* DELETE CONFIRM */}
      <ConfirmModal
        visible={showDeleteConfirm}
        title={t('owners.delete')}
        message={t('owners.confirmDelete')}
        isDangerous
        loading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />

      {/* DATE PICKER */}
      <DatePickerModal
        visible={showDatePicker}
        initialDay={1}
        initialMonth={1}
        initialYear={2000}
        onClose={() => setShowDatePicker(false)}
        onConfirm={(d, m, y) => {
          setPetField(
            'birthDate',
            `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`
          );
          setShowDatePicker(false);
        }}
      />
    </>
  );
}
