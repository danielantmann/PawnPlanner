import { View, Text, Pressable } from 'react-native';
import { Title } from '../primitives/Title';

interface ModalHeaderProps {
  title: string;
  onClose: () => void;
}

export function ModalHeader({ title, onClose }: ModalHeaderProps) {
  return (
    <View className="mb-6 flex-row items-center justify-between">
      <Title>{title}</Title>
      <Pressable onPress={onClose}>
        <Text className="text-xl text-textSecondary dark:text-textSecondaryDark">✕</Text>
      </Pressable>
    </View>
  );
}
