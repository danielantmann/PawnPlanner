import { useState } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { router } from 'expo-router';
import { AuthHeader } from '@/src/modules/auth/components/AuthHeader';

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = () => {
    console.log('Recover password for:', email);
    // Aquí luego llamas a tu API real
  };

  return (
    <View className="flex-1 bg-white px-6 pt-20 dark:bg-black">
      {/* LOGO */}
      <View className="mb-10 items-center">
        <AuthHeader />
      </View>

      {/* TITLE */}
      <Text className="mb-8 text-center text-3xl font-bold text-gray-900 dark:text-gray-100">
        Recuperar contraseña
      </Text>

      {/* INPUT */}
      <TextInput
        placeholder="Introduce tu email"
        placeholderTextColor="#999"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        className="mb-6 w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 dark:border-gray-700 dark:text-gray-100"
      />

      {/* BUTTON */}
      <Pressable onPress={handleSubmit} className="bg-primary rounded-lg py-3 active:opacity-80">
        <Text className="text-center text-base font-semibold text-white">Enviar instrucciones</Text>
      </Pressable>

      {/* BACK */}
      <Pressable onPress={() => router.push('/(auth)/login')} className="mt-6">
        <Text className="text-primary text-center underline">Volver al inicio de sesión</Text>
      </Pressable>
    </View>
  );
};

export default ForgotPasswordScreen;
