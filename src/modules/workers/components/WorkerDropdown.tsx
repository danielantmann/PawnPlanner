import { View, Text, Pressable, ScrollView } from 'react-native';
import { InputSelect } from '@/src/ui/components/primitives/InputSelect';
import { useGetWorkers } from '../hooks/useGetWorkers';
import type { WorkerDTO } from '../types/worker.types';
import { colors } from '@/src/ui/theme/colors';
import { useDropdown } from '@/src/store/useDropdown';

const DROPDOWN_ID = 'worker-dropdown';

type WorkerDropdownProps = {
  label?: string;
  value: WorkerDTO | null;
  onSelect: (worker: WorkerDTO | null) => void;
};

export const WorkerDropdown = ({ label, value, onSelect }: WorkerDropdownProps) => {
  const { data: workers } = useGetWorkers();
  const { isOpen, handleToggle, handleSelect } = useDropdown(DROPDOWN_ID);

  return (
    <View className="relative w-full">
      <InputSelect
        label={label}
        placeholder="Seleccionar trabajador..."
        value={value?.name || 'Sin asignar'}
        leftIcon="person"
        onPress={handleToggle}
      />

      {isOpen && workers && (
        <View
          style={{
            position: 'absolute',
            left: 0,
            top: '100%',
            zIndex: 50,
            width: '100%',
            borderRadius: 8,
            borderWidth: 1,
            borderColor: colors.border,
            backgroundColor: colors.background,
            maxHeight: 240,
            overflow: 'hidden',
          }}
          className="dark:border-neutral-700 dark:bg-neutral-900">
          <ScrollView>
            <Pressable
              onPress={() => handleSelect(() => onSelect(null))}
              style={{
                borderBottomWidth: 1,
                borderBottomColor: colors.border,
                paddingHorizontal: 16,
                paddingVertical: 12,
              }}
              className="dark:border-neutral-700">
              <Text
                style={{
                  fontWeight: '600',
                  color: colors.textPrimary,
                }}
                className="dark:text-gray-100">
                Sin asignar
              </Text>
            </Pressable>

            {workers.map((worker: WorkerDTO) => (
              <Pressable
                key={worker.id}
                onPress={() => handleSelect(() => onSelect(worker))}
                style={{
                  borderBottomWidth: 1,
                  borderBottomColor: colors.border,
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                }}
                className="dark:border-neutral-700">
                <Text
                  style={{
                    fontWeight: '600',
                    color: colors.textPrimary,
                  }}
                  className="dark:text-gray-100">
                  {worker.name}
                </Text>

                {worker.phone && (
                  <Text
                    style={{
                      fontSize: 12,
                      color: colors.textSecondary,
                      marginTop: 4,
                    }}
                    className="dark:text-gray-400">
                    {worker.phone}
                  </Text>
                )}
              </Pressable>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};
