import { Modal, View, ScrollView, Pressable, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Title } from '@/src/ui/components/primitives/Title';
import { BodyText } from '@/src/ui/components/primitives/BodyText';
import { Button } from '@/src/ui/components/primitives/Button';
import { Icon } from '@/src/ui/components/primitives/Icon';
import type { OwnerDTO } from '../../types/owner.types';

interface OwnerDetailModalProps {
  visible: boolean;
  onClose: () => void;
  owner: OwnerDTO | null;
  onEdit: () => void;
  onAddPet: () => void;
}

export function OwnerDetailModal({
  visible,
  onClose,
  owner,
  onEdit,
  onAddPet,
}: OwnerDetailModalProps) {
  const { t } = useTranslation();

  if (!owner) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View className="flex-1 items-center justify-end bg-black/50">
        <View
          className="w-full rounded-t-3xl bg-background p-6 dark:bg-backgroundDark"
          style={{ maxHeight: '80%' }}>
          {/* HEADER */}
          <View className="mb-6 flex-row items-center justify-between">
            <Title>{owner.name}</Title>
            <Pressable onPress={onClose}>
              <Text className="text-xl text-textSecondary dark:text-textSecondaryDark">✕</Text>
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* DATOS DE CONTACTO */}
            <View style={{ gap: 12 }} className="mb-6">
              {owner.email && (
                <View className="flex-row items-center gap-3">
                  <Icon name="mail" size={18} color="muted" />
                  <BodyText>{owner.email}</BodyText>
                </View>
              )}
              <View className="flex-row items-center gap-3">
                <Icon name="phone" size={18} color="muted" />
                <BodyText>{owner.phone}</BodyText>
              </View>
            </View>

            {/* CABECERA MASCOTAS */}
            <View className="mb-3 flex-row items-center justify-between">
              <Text className="text-xs font-semibold uppercase text-textSecondary dark:text-textSecondaryDark">
                {t('owners.pets')} ({owner.pets.length})
              </Text>
              <Pressable
                onPress={onAddPet}
                className="flex-row items-center gap-1 active:opacity-70">
                <Icon name="add" size={16} color="primary" />
                <Text className="text-sm font-medium text-primary">{t('owners.addPet')}</Text>
              </Pressable>
            </View>

            {/* LISTA MASCOTAS */}
            {owner.pets.length === 0 ? (
              <BodyText className="text-textSecondary dark:text-textSecondaryDark">
                {t('owners.noPets')}
              </BodyText>
            ) : (
              <View style={{ gap: 8 }}>
                {owner.pets.map((pet) => (
                  <View
                    key={pet.id}
                    className="flex-row items-center rounded-lg border border-gray-200 px-4 py-3 dark:border-neutral-700">
                    <Icon name="paw" size={16} color="muted" />
                    <Text className="ml-3 font-medium text-textPrimary dark:text-textPrimaryDark">
                      {pet.name}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </ScrollView>

          {/* FOOTER */}
          <View className="mt-6 flex-row gap-3">
            <Button onPress={onClose} icon="close" className="flex-1" variant="secondary" />
            <Button onPress={onEdit} icon="edit" className="flex-1" />
          </View>
        </View>
      </View>
    </Modal>
  );
}
