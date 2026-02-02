import { useAuthStore } from '@/src/modules/auth/store/auth.store';
import { useTranslation } from 'react-i18next';
import i18n from '@/src/i18n';

export function useHomeUtils() {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const locale = i18n.language;

  // Fecha formateada
  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
  const formatted = capitalize(
    new Date().toLocaleDateString(locale === 'es' ? 'es-ES' : 'en-US', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    })
  );

  return {
    user,
    formatted,
    t,
  };
}
