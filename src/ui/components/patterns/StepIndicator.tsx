import { View } from 'react-native';

interface StepIndicatorProps {
  step: number;
}

export const StepIndicator = ({ step }: StepIndicatorProps) => (
  <View className="mb-4 flex-row justify-center">
    <View
      className={`mx-1 h-3 w-3 rounded-full ${
        step === 0 ? 'bg-primary' : 'bg-gray-400 dark:bg-gray-600'
      }`}
    />
    <View
      className={`mx-1 h-3 w-3 rounded-full ${
        step === 1 ? 'bg-primary' : 'bg-gray-400 dark:bg-gray-600'
      }`}
    />
  </View>
);
