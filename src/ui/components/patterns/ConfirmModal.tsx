import { Modal, View } from 'react-native';
import { Button } from '@/src/ui/components/primitives/Button';
import { Title } from '@/src/ui/components/primitives/Title';
import { BodyText } from '@/src/ui/components/primitives/BodyText';
import { cn } from '@/src/utils/cn';

interface ConfirmModalProps {
  visible: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDangerous?: boolean;
  loading?: boolean;
}

export function ConfirmModal({
  visible,
  title,
  message,
  onConfirm,
  onCancel,
  isDangerous = false,
  loading = false,
}: ConfirmModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 items-center justify-center bg-black/50">
        <View className="w-11/12 rounded-2xl bg-background p-6 dark:bg-backgroundDark">
          <Title className="mb-2">{title}</Title>
          <BodyText className="mb-6 text-textSecondary dark:text-textSecondaryDark">
            {message}
          </BodyText>

          <View className="flex-row gap-3">
            <Button
              onPress={onCancel}
              icon="close"
              className="flex-1"
              variant="secondary"
              iconColor="white"
              disabled={loading}
            />
            <Button
              onPress={onConfirm}
              icon={isDangerous ? 'trash' : 'check'}
              className={cn('flex-1', isDangerous && 'bg-red-500')}
              variant="secondary"
              iconColor="white"
              loading={loading}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}
