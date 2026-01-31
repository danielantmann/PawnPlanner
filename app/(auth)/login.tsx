import { View, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { AuthForm } from '@/src/modules/auth/components/AuthForm';
import { AuthFooter } from '@/src/modules/auth/components/AuthFooter';

export default function LoginScreen() {
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View className="flex-1 bg-white dark:bg-black">
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 24,
            paddingTop: 80,
            paddingBottom: 200,
          }}>
          <AuthForm mode="login" />
          <AuthFooter mode="login" />
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}
