/* eslint-disable import/no-named-as-default-member */

import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';

import es from './locales/es.json';
import en from './locales/en.json';

const STORAGE_KEY = 'app_language';

const loadLanguage = async () => {
  const saved = await AsyncStorage.getItem(STORAGE_KEY);
  if (saved) return saved;

  const locales = Localization.getLocales();
  const deviceLang = locales[0]?.languageCode || 'es';

  return deviceLang === 'es' ? 'es' : 'en';
};

export const initI18n = async () => {
  const lng = await loadLanguage();

  await i18next.use(initReactI18next).init({
    lng,
    fallbackLng: 'es',
    resources: {
      es: { translation: es },
      en: { translation: en },
    },
    interpolation: {
      escapeValue: false,
    },
  });
};

export const changeLanguage = async (lng: 'es' | 'en') => {
  await AsyncStorage.setItem(STORAGE_KEY, lng);
  i18next.changeLanguage(lng);
};

export default i18next;
