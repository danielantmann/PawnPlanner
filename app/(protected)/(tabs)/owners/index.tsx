import { useState } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Input } from '@/src/ui/components/primitives/Input';
import { Button } from '@/src/ui/components/primitives/Button';
import { ScreenHeader } from '@/src/ui/components/patterns/ScreenHeader';
import { useSearchOwners } from '@/src/modules/owners/hooks/useSearchOwners';
import { useOwnerStore } from '@/src/modules/owners/store/owner.store';
import { OwnerFormModal } from '@/src/modules/owners/components/Modals/OwnerFormModal';
import { OwnerDetailModal } from '@/src/modules/owners/components/Modals/OwnerDetailModal';
import { Icon } from '@/src/ui/components/primitives/Icon';
import type { OwnerDTO } from '@/src/modules/owners/types/owner.types';

export default function OwnersScreen() {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [detailVisible, setDetailVisible] = useState(false);
  const [detailOwner, setDetailOwner] = useState<OwnerDTO | null>(null);

  const {
    createModalVisible,
    editModalVisible,
    selectedOwner,
    openCreateModal,
    closeCreateModal,
    openEditModal,
    closeEditModal,
  } = useOwnerStore();

  const { data, isLoading } = useSearchOwners(query);

  const handleSelectOwner = (owner: OwnerDTO) => {
    setDetailOwner(owner);
    setDetailVisible(true);
  };

  const handleEditFromDetail = () => {
    setDetailVisible(false);
    openEditModal(detailOwner!);
  };

  return (
    <View className="flex-1 bg-background dark:bg-backgroundDark">
      <ScrollView
        className="flex-1 p-4"
        contentContainerStyle={{ paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled">
        <ScreenHeader title={t('owners.title')} subtitle={t('owners.subtitle')} />

        {/* Búsqueda + botón crear */}
        <View className="mb-4 flex-row items-center gap-3">
          <View className="flex-1">
            <Input
              placeholder={t('owners.searchPlaceholder')}
              value={query}
              onChangeText={setQuery}
              leftIcon="search"
            />
          </View>
          <Button icon="personAdd" onPress={openCreateModal} />
        </View>

        {/* Hint inicial */}
        {query.length <= 1 && (
          <View className="items-center py-12">
            <Icon name="search" size={32} color="muted" />
            <Text className="mt-3 text-center text-textSecondary dark:text-textSecondaryDark">
              {t('owners.searchHint')}
            </Text>
          </View>
        )}

        {/* Cargando */}
        {isLoading && query.length > 1 && (
          <View className="items-center py-8">
            <ActivityIndicator size="small" color="#4F46E5" />
          </View>
        )}

        {/* Sin resultados */}
        {!isLoading && query.length > 1 && data?.length === 0 && (
          <View className="items-center py-8">
            <Icon name="person" size={32} color="muted" />
            <Text className="mt-3 text-center text-textSecondary dark:text-textSecondaryDark">
              {t('owners.noResults')}
            </Text>
          </View>
        )}

        {/* Lista de resultados */}
        {!isLoading && data && data.length > 0 && (
          <View style={{ gap: 8 }}>
            {data.map((owner) => (
              <Pressable
                key={owner.id}
                onPress={() => handleSelectOwner(owner)}
                className="rounded-xl border border-gray-200 bg-backgroundAlt px-4 py-3 active:opacity-70 dark:border-neutral-700 dark:bg-backgroundDarkAlt">
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center gap-3">
                    <Icon name="person" size={20} color="muted" />
                    <View>
                      <Text className="font-semibold text-textPrimary dark:text-textPrimaryDark">
                        {owner.name}
                      </Text>
                      <Text className="text-sm text-textSecondary dark:text-textSecondaryDark">
                        {owner.phone}
                      </Text>
                    </View>
                  </View>
                  {owner.pets.length > 0 && (
                    <View className="flex-row items-center gap-1">
                      <Icon name="paw" size={14} color="muted" />
                      <Text className="text-sm text-textSecondary dark:text-textSecondaryDark">
                        {owner.pets.length}
                      </Text>
                    </View>
                  )}
                </View>
              </Pressable>
            ))}
          </View>
        )}
      </ScrollView>

      <OwnerDetailModal
        visible={detailVisible}
        owner={detailOwner}
        onClose={() => setDetailVisible(false)}
        onEdit={handleEditFromDetail}
      />

      <OwnerFormModal visible={createModalVisible} onClose={closeCreateModal} />

      <OwnerFormModal
        visible={editModalVisible}
        onClose={closeEditModal}
        owner={selectedOwner}
        isEditMode
      />
    </View>
  );
}
