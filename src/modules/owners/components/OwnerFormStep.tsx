import { View } from 'react-native';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import type { Control } from 'react-hook-form';
import { Input } from '@/src/ui/components/primitives/Input';
import type { OwnerFormValues } from '../hooks/useOwnerForm';

interface OwnerFormStepProps {
  control: Control<OwnerFormValues>;
  isSubmitting: boolean;
}

export function OwnerFormStep({ control, isSubmitting }: OwnerFormStepProps) {
  const { t } = useTranslation();
  return (
    <View style={{ gap: 16 }}>
      <Controller
        control={control}
        name="name"
        render={({ field, fieldState }) => (
          <Input
            label={t('owners.fields.name')}
            placeholder={t('owners.fields.namePlaceholder')}
            value={field.value}
            onChangeText={field.onChange}
            leftIcon="person"
            editable={!isSubmitting}
            error={fieldState.error?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="email"
        render={({ field, fieldState }) => (
          <Input
            label={t('owners.fields.email')}
            placeholder={t('owners.fields.emailPlaceholder')}
            value={field.value ?? ''}
            onChangeText={field.onChange}
            leftIcon="mail"
            type="email"
            editable={!isSubmitting}
            error={fieldState.error?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="phone"
        render={({ field, fieldState }) => (
          <Input
            label={t('owners.fields.phone')}
            placeholder={t('owners.fields.phonePlaceholder')}
            value={field.value}
            onChangeText={field.onChange}
            leftIcon="phone"
            type="phone"
            editable={!isSubmitting}
            error={fieldState.error?.message}
          />
        )}
      />
    </View>
  );
}
