import { useState, useMemo } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import Toast from 'react-native-toast-message';

import { Input } from '@/src/ui/components/primitives/Input';
import { Button } from '@/src/ui/components/primitives/Button';
import { ScreenHeader } from '@/src/ui/components/patterns/ScreenHeader';
import { Icon } from '@/src/ui/components/primitives/Icon';
import { toastConfig } from '@/src/ui/components/patterns/ToastConfig';

import { useOwners } from '@/src/modules/owners/hooks/useOwners';
import { useOwnerStore } from '@/src/modules/owners/store/owner.store';
import { OwnerFormModal } from '@/src/modules/owners/components/Modals/OwnerFormModal';
import { OwnerDetailModal } from '@/src/modules/owners/components/Modals/OwnerDetailModal';

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

  const { data: owners, isLoading } = useOwners();

  const filtered = useMemo(() => {
    if (!owners) return [];
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();
    return owners.filter(
      (o) =>
        o.name.toLowerCase().includes(q) ||
        o.phone.includes(q) ||
        (o.email && o.email.toLowerCase().includes(q))
    );
  }, [owners, query]);

  const hasOwners = owners && owners.length > 0;
  const showResults = query.trim().length > 0;

  const handleSelectOwner = (owner: OwnerDTO) => {
    setDetailOwner(owner);
    setDetailVisible(true);
  };

  const handleEditFromDetail = () => {
    setDetailVisible(false);
    openEditModal(detailOwner!);
  };

  const handleAddPetFromDetail = () => {
    setDetailVisible(false);
  };

  return (
    <View className="flex-1 bg-background dark:bg-backgroundDark">
      <ScrollView
        className="flex-1 px-5"
        contentContainerStyle={{ paddingTop: 24, paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag">
        <ScreenHeader title={t('owners.title')} subtitle={t('owners.subtitle')} />

        {/* BÚSQUEDA + BOTÓN */}
        <View className="mb-8 mt-6 flex-row items-center gap-3">
          <View className="flex-1">
            <Input
              placeholder={t('owners.searchPlaceholder')}
              value={query}
              onChangeText={setQuery}
              leftIcon="search"
            />
          </View>
          <Pressable
            onPress={openCreateModal}
            className="items-center justify-center rounded-lg bg-primary active:opacity-70 dark:bg-primaryDark"
            style={{ height: 46, width: 46 }}>
            <Icon name="personAdd" size={20} color="white" fixedColor />
          </Pressable>
        </View>

        {/* LOADING */}
        {isLoading && (
          <View className="items-center py-16">
            <ActivityIndicator size="small" color="#4F46E5" />
          </View>
        )}

        {/* EMPTY STATE — sin owners */}
        {!isLoading && !hasOwners && (
          <View className="flex-1 items-center justify-center py-24" style={{ gap: 16 }}>
            <View className="dark:bg-backgroundAltDark mb-2 h-20 w-20 items-center justify-center rounded-full bg-backgroundAlt">
              <Icon name="people" size={40} color="muted" />
            </View>
            <Text className="text-xl font-bold text-textPrimary dark:text-textPrimaryDark">
              {t('owners.emptyTitle')}
            </Text>
            <Text className="text-center text-textSecondary dark:text-textSecondaryDark">
              {t('owners.emptySubtitle')}
            </Text>
            <Button onPress={openCreateModal} icon="personAdd" className="mt-4 px-8">
              {t('owners.new')}
            </Button>
          </View>
        )}

        {/* HINT — hay owners pero no se está buscando */}
        {!isLoading && hasOwners && !showResults && (
          <View className="items-center py-16" style={{ gap: 12 }}>
            <View className="dark:bg-backgroundAltDark h-16 w-16 items-center justify-center rounded-full bg-backgroundAlt">
              <Icon name="search" size={28} color="muted" />
            </View>
            <Text className="font-semibold text-textPrimary dark:text-textPrimaryDark">
              {t('owners.searchHint')}
            </Text>
            <Text className="text-sm text-textSecondary dark:text-textSecondaryDark">
              {t('owners.totalOwners', { count: owners.length })}
            </Text>
          </View>
        )}

        {/* SIN RESULTADOS */}
        {!isLoading && showResults && filtered.length === 0 && (
          <View className="items-center py-16" style={{ gap: 12 }}>
            <View className="dark:bg-backgroundAltDark h-16 w-16 items-center justify-center rounded-full bg-backgroundAlt">
              <Icon name="person" size={28} color="muted" />
            </View>
            <Text className="font-semibold text-textPrimary dark:text-textPrimaryDark">
              {t('owners.noResults')}
            </Text>
          </View>
        )}

        {/* RESULTADOS */}
        {!isLoading && showResults && filtered.length > 0 && (
          <View style={{ gap: 10 }}>
            {filtered.map((owner) => (
              <Pressable
                key={owner.id}
                onPress={() => handleSelectOwner(owner)}
                className="dark:bg-backgroundAltDark rounded-2xl border border-gray-200 bg-backgroundAlt px-5 py-4 active:opacity-70 dark:border-neutral-700">
                <View className="flex-row items-center gap-4">
                  <View className="h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Icon name="person" size={20} color="primary" />
                  </View>
                  <View style={{ gap: 2, flex: 1 }}>
                    <Text className="font-semibold text-textPrimary dark:text-textPrimaryDark">
                      {owner.name}
                    </Text>
                    <View className="flex-row items-center gap-1">
                      <Icon name="phone" size={12} color="muted" />
                      <Text className="text-sm text-textSecondary dark:text-textSecondaryDark">
                        {owner.phone}
                      </Text>
                    </View>
                    {owner.pets.length > 0 && (
                      <View className="mt-1 flex-row items-center gap-1">
                        <Icon name="paw" size={12} color="muted" />
                        <Text className="text-xs text-textSecondary dark:text-textSecondaryDark">
                          {owner.pets.map((p) => p.name).join(', ')}
                        </Text>
                      </View>
                    )}
                  </View>
                  {owner.pets.length > 0 && (
                    <View className="bg-backgroundAltDarker dark:bg-backgroundAltDarkerDark flex-row items-center gap-1 rounded-full px-3 py-1">
                      <Icon name="paw" size={12} color="muted" />
                      <Text className="text-xs font-medium text-textSecondary dark:text-textSecondaryDark">
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
        onAddPet={handleAddPetFromDetail}
      />

      <OwnerFormModal visible={createModalVisible} onClose={closeCreateModal} />

      <OwnerFormModal
        visible={editModalVisible}
        onClose={closeEditModal}
        owner={selectedOwner}
        isEditMode
      />

      <Toast config={toastConfig} position="top" topOffset={60} />
    </View>
  );
}
