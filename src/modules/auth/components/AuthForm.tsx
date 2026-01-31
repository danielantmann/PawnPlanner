import { FC, useEffect, useRef } from 'react';
import { View, Text, Pressable, Animated, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Controller } from 'react-hook-form';

import { Input } from '@/src/ui/components/primitives/Input';
import { Button } from '@/src/ui/components/primitives/Button';

import type { AuthMode } from '../types/auth.types';
import { AuthHeader } from './AuthHeader';
import { useAuthForm } from '../hooks/useAuthForm';

interface AuthFormProps {
  mode: AuthMode;
}

export const AuthForm: FC<AuthFormProps> = ({ mode }) => {
  const { t } = useTranslation();
  const { form, clearLoginError, onValidSubmit, loginMutation, registerMutation, isLogin } =
    useAuthForm(mode);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = form;

  const isLoading = isLogin ? loginMutation.isPending : registerMutation.isPending;

  const logoScale = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(logoScale, {
        toValue: 1.15,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 4,
        tension: 90,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View className="bg-white px-6 dark:bg-black">
      {/* LOGO */}
      <Animated.View style={{ transform: [{ scale: logoScale }] }} className="mb-10 items-center">
        <AuthHeader />
      </Animated.View>

      {/* TITLE */}
      <Text className="mb-6 text-center text-3xl font-bold text-gray-900 dark:text-gray-100">
        {isLogin ? t('auth.loginTitle') : t('auth.registerTitle')}
      </Text>

      {/* FIRST NAME */}
      {!isLogin && (
        <View className="mb-3">
          <Controller
            control={control}
            name="firstName"
            render={({ field }) => (
              <Input
                placeholder={t('auth.firstName')}
                value={field.value ?? ''}
                onChangeText={(value) => {
                  field.onChange(value);
                  clearLoginError();
                }}
                leftIcon="person"
                error={errors.firstName?.message}
              />
            )}
          />
        </View>
      )}

      {/* LAST NAME */}
      {!isLogin && (
        <View className="mb-3">
          <Controller
            control={control}
            name="lastName"
            render={({ field }) => (
              <Input
                placeholder={t('auth.lastName')}
                value={field.value ?? ''}
                onChangeText={(value) => {
                  field.onChange(value);
                  clearLoginError();
                }}
                leftIcon="person"
                error={errors.lastName?.message}
              />
            )}
          />
        </View>
      )}

      {/* EMAIL */}
      <View className="mb-3">
        <Controller
          control={control}
          name="email"
          render={({ field }) => (
            <Input
              placeholder={t('auth.email')}
              value={field.value ?? ''}
              onChangeText={(value) => {
                field.onChange(value);
                clearLoginError();
              }}
              leftIcon="mail"
              type="email"
              error={errors.email?.message}
            />
          )}
        />
      </View>

      {/* PASSWORD */}
      <View className="mb-1">
        <Controller
          control={control}
          name="password"
          render={({ field }) => (
            <Input
              placeholder={t('auth.password')}
              value={field.value ?? ''}
              onChangeText={(value) => {
                field.onChange(value);
                clearLoginError();
              }}
              leftIcon="lock"
              type="password"
              error={errors.password?.message}
            />
          )}
        />
      </View>

      {/* FORGOT PASSWORD */}
      {isLogin && (
        <Pressable onPress={() => router.push('/(auth)/forgot-password')} className="mb-4">
          <Text className="text-primary text-right text-sm">{t('auth.forgotPassword')}</Text>
        </Pressable>
      )}

      {/* SUBMIT BUTTON */}
      <Button
        onPress={handleSubmit(onValidSubmit)}
        className="mt-2 rounded-lg"
        textSize="base"
        disabled={isLoading}
        variant={isLoading ? 'secondary' : 'primary'}>
        {isLoading ? (
          <ActivityIndicator color="white" />
        ) : isLogin ? (
          t('auth.loginButton')
        ) : (
          t('auth.registerButton')
        )}
      </Button>

      {/* LOGIN ERROR */}
      {isLogin && loginMutation.isError && (
        <Text className="mt-3 text-center text-red-500">{t(loginMutation.error.message)}</Text>
      )}
    </View>
  );
};
