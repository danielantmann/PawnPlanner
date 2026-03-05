import { Modal, View, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import Toast from 'react-native-toast-message';

import { Button } from '@/src/ui/components/primitives/Button';
import { ModalHeader } from '@/src/ui/components/patterns/ModalHeader';
import { ErrorBanner } from '@/src/ui/components/patterns/ErrorBanner';
import { StepIndicator } from '@/src/ui/components/patterns/StepIndicator';
import { DatePickerModal } from '@/src/ui/components/patterns/DatePickerModal';

import { useOwnerForm } from '../../hooks/useOwnerForm';
import { usePetForm } from '@/src/modules/pets/hooks/usePetForm';
import { useCreateOwner } from '../../hooks/useCreateOwner';
import { useUpdateOwner } from '../../hooks/useUpdateOwner';

import { OwnerFormStep } from '../OwnerFormStep';
import { PetFormStep } from '@/src/modules/pets/components/PetFormStep';

import { normalizeOptional } from '@/src/utils/normalizeOptional';
import { formatDateStorage } from '@/src/utils/formatDate';
import { getErrorMessage } from '@/src/utils/errorHandler';

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
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [errorBanner, setErrorBanner] = useState<string | null>(null);

  const { form: ownerForm } = useOwnerForm({ owner, isEditMode, visible });
  const { form: petForm, petUI, selectAnimal, selectBreed, resetPetForm } = usePetForm();

  const { mutateAsync: createOwner, isPending: isCreating } = useCreateOwner();
  const { mutateAsync: updateOwner, isPending: isUpdating } = useUpdateOwner();

  const isSubmitting = isCreating || isUpdating;

  const showSuccess = (text1: string) => {
    setTimeout(() => Toast.show({ type: 'success', text1, position: 'top', topOffset: 80 }), 300);
  };

  const showErrorBanner = (msg: string) => {
    setErrorBanner(msg);
    setTimeout(() => setErrorBanner(null), 4000);
  };

  const buildOwnerPayload = (values: { name: string; email?: string; phone: string }) => ({
    name: values.name,
    phone: values.phone.trim(),
    email: normalizeOptional(values.email),
  });

  const closeAndReset = () => {
    ownerForm.reset();
    resetPetForm();
    setStep(0);
    setErrorBanner(null);
    onClose();
  };

  const handleClose = () => {
    if (isSubmitting) return;
    closeAndReset();
  };

  const handleNext = ownerForm.handleSubmit(() => {
    setErrorBanner(null);
    setStep(1);
  });

  const handleSkip = ownerForm.handleSubmit(async (values) => {
    try {
      setErrorBanner(null);
      await createOwner({ owner: buildOwnerPayload(values) });
      closeAndReset();
      showSuccess(t('owners.created'));
    } catch (e) {
      showErrorBanner(getErrorMessage(e));
    }
  });

  const handleSubmit = ownerForm.handleSubmit((ownerValues) =>
    petForm.handleSubmit(async (petValues) => {
      try {
        setErrorBanner(null);
        await createOwner({
          owner: buildOwnerPayload(ownerValues),
          pet: {
            breedId: petValues.breedId!,
            name: petValues.name,
            birthDate: petValues.birthDate,
            importantNotes: petValues.importantNotes,
            quickNotes: petValues.quickNotes,
          },
        });
        closeAndReset();
        showSuccess(t('owners.created'));
      } catch (e) {
        showErrorBanner(getErrorMessage(e));
      }
    })()
  );

  const handleUpdate = ownerForm.handleSubmit(async (values) => {
    try {
      setErrorBanner(null);
      await updateOwner({ id: owner!.id, payload: buildOwnerPayload(values) });
      closeAndReset();
      showSuccess(t('owners.updated'));
    } catch (e) {
      showErrorBanner(getErrorMessage(e));
    }
  });

  const birthDate = petForm.watch('birthDate');
  const today = new Date();
  const pickerDay = birthDate ? parseInt(birthDate.split('-')[2]) : today.getDate();
  const pickerMonth = birthDate ? parseInt(birthDate.split('-')[1]) : today.getMonth() + 1;
  const pickerYear = birthDate ? parseInt(birthDate.split('-')[0]) : today.getFullYear();

  return (
    <>
      <Modal visible={visible} animationType="slide" transparent>
        <View className="flex-1 items-center justify-end bg-black/50">
          <View className="w-full flex-1 rounded-t-3xl bg-background p-6 dark:bg-backgroundDark">
            <ModalHeader
              title={isEditMode ? t('owners.edit') : step === 0 ? t('owners.new') : t('pets.new')}
              onClose={handleClose}
            />

            {!isEditMode && <StepIndicator step={step} />}

            <ErrorBanner message={errorBanner} />

            <ScrollView
              contentContainerStyle={{ paddingBottom: 24 }}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              style={{ flex: 1 }}>
              {step === 0 && (
                <OwnerFormStep control={ownerForm.control} isSubmitting={isSubmitting} />
              )}
              {step === 1 && (
                <PetFormStep
                  control={petForm.control}
                  errors={petForm.formState.errors}
                  petUI={petUI}
                  selectAnimal={selectAnimal}
                  selectBreed={selectBreed}
                  onOpenDatePicker={() => setShowDatePicker(true)}
                />
              )}
            </ScrollView>

            <View className="mt-6 flex-row gap-3">
              {isEditMode ? (
                <>
                  <Button
                    onPress={handleClose}
                    icon="close"
                    className="flex-1"
                    disabled={isSubmitting}
                  />
                  <Button
                    onPress={handleUpdate}
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
                  <Button onPress={() => setStep(0)} icon="chevronLeft" />
                  <Button
                    onPress={handleSkip}
                    variant="secondary"
                    className="flex-1"
                    disabled={isSubmitting}
                    loading={isCreating}>
                    {t('owners.skipPet')}
                  </Button>
                  <Button
                    onPress={handleSubmit}
                    icon="check"
                    disabled={isSubmitting}
                    loading={isCreating}
                  />
                </>
              )}
            </View>
          </View>
        </View>
      </Modal>

      <DatePickerModal
        visible={showDatePicker}
        initialDay={pickerDay}
        initialMonth={pickerMonth}
        initialYear={pickerYear}
        onClose={() => setShowDatePicker(false)}
        onConfirm={(d: number, m: number, y: number) => {
          petForm.setValue('birthDate', formatDateStorage(d, m, y), { shouldValidate: true });
          setShowDatePicker(false);
        }}
      />
    </>
  );
}
