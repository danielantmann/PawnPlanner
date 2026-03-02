import { Modal, View, ScrollView, Pressable, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { Button } from '@/src/ui/components/primitives/Button';
import { Input } from '@/src/ui/components/primitives/Input';
import { Title } from '@/src/ui/components/primitives/Title';
import { ConfirmModal } from '@/src/ui/components/patterns/ConfirmModal';
import { useOwnerForm } from '../../hooks/useOwnerForm';
import { useCreateOwner } from '../../hooks/useCreateOwner';
import { useUpdateOwner } from '../../hooks/useUpdateOwner';
import { useDeleteOwner } from '../../hooks/useDeleteOwner';
import { validateOwnerForm } from '../../schemas/owner.schema';
import type { OwnerDTO } from '../../types/owner.types';

interface OwnerFormModalProps {
  visible: boolean;
  onClose: () => void;
  owner?: OwnerDTO | null;
  isEditMode?: boolean;
}

export function OwnerFormModal({
  visible,
  onClose,
  owner,
  isEditMode = false,
}: OwnerFormModalProps) {
  const { t } = useTranslation();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const { formState, formErrors, setFormField, setFormErrors, resetForm } = useOwnerForm({
    owner,
    isEditMode,
    visible,
  });

  const { mutateAsync: createOwner, isPending: isCreating } = useCreateOwner();
  const { mutateAsync: updateOwner, isPending: isUpdating } = useUpdateOwner();
  const { mutateAsync: deleteOwner, isPending: isDeleting } = useDeleteOwner();

  const isSubmitting = isCreating || isUpdating || isDeleting;

  const handleClose = () => {
    if (isSubmitting) return;
    resetForm();
    onClose();
  };

  const handleSubmit = async () => {
    const result = validateOwnerForm(formState);
    if (!result.success) {
      setFormErrors(result.errors as Record<string, string[]>);
      return;
    }

    try {
      if (isEditMode && owner) {
        await updateOwner({ id: owner.id, payload: formState });
      } else {
        await createOwner(formState);
      }
      resetForm();
      onClose();
    } catch {
      // el error lo maneja React Query
    }
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

  const getError = (field: string) => formErrors[field]?.[0] || undefined;

  return (
    <>
      <Modal visible={visible} animationType="slide" transparent>
        <View className="flex-1 items-center justify-end bg-black/50">
          <View className="w-full flex-1 rounded-t-3xl bg-background p-6 dark:bg-backgroundDark">
            <View className="mb-6 flex-row items-center justify-between">
              <Title>{isEditMode ? t('owners.edit') : t('owners.new')}</Title>
              <Pressable onPress={handleClose}>
                <Text className="text-xl text-textSecondary dark:text-textSecondaryDark">✕</Text>
              </Pressable>
            </View>

            <ScrollView
              contentContainerStyle={{ paddingBottom: 24 }}
              showsVerticalScrollIndicator={false}
              style={{ flex: 1 }}>
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
                  leftIcon="phone" // era "call"
                  type="phone"
                  editable={!isSubmitting}
                  error={getError('phone')}
                />
              </View>
            </ScrollView>

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
                    onPress={handleSubmit}
                    icon="check"
                    className="flex-1"
                    loading={isUpdating}
                    disabled={isSubmitting}
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
                    onPress={handleSubmit}
                    icon="check"
                    className="flex-1"
                    loading={isCreating}
                    disabled={isSubmitting}
                  />
                </>
              )}
            </View>
          </View>
        </View>
      </Modal>

      <ConfirmModal
        visible={showDeleteConfirm}
        title={t('owners.delete')}
        message={t('owners.confirmDelete')}
        isDangerous
        loading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </>
  );
}
