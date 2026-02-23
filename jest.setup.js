/* eslint-disable no-undef */

//  Mock axios COMPLETO
jest.mock('axios', () => {
  const mockAxios = {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    create: jest.fn(function () {
      return mockAxios;
    }),
    isAxiosError: (error) => !!error?.isAxiosError,
    interceptors: {
      request: { use: () => {} },
      response: { use: () => {} },
    },
  };
  return mockAxios;
});

//  Mock expo-localization
jest.mock('expo-localization', () => ({
  getLocales: () => [{ languageCode: 'es' }],
}));

//  Mock async-storage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

//  Mock NativeEventEmitter
jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter', () => {
  const EventEmitter = require('events');
  return {
    __esModule: true,
    default: class MockNativeEventEmitter extends EventEmitter {
      addListener() {
        return { remove: () => {} };
      }
      removeAllListeners() {}
    },
  };
});

//  Mock i18n (CON TUS TRADUCCIONES)
jest.mock('@/src/i18n', () => ({
  __esModule: true,
  default: {
    language: 'es',
    t: (key) => {
      const translations = {
        'errors.network': 'Sin conexión a internet. Verifica tu conexión.',
        'errors.timeout': 'La solicitud tardó demasiado. Intenta de nuevo.',
        'errors.unauthorized': 'Tu sesión expiró. Inicia sesión de nuevo.',
        'errors.forbidden': 'No tienes permiso para esta acción.',
        'errors.notFound': 'Recurso no encontrado.',
        'errors.conflict': 'Esta acción no puede realizarse ahora.',
        'errors.serverError': 'Error del servidor. Intenta de nuevo más tarde.',
        'errors.serviceUnavailable': 'Servicio no disponible. Intenta de nuevo más tarde.',
        'errors.validationError': 'Revisa los campos marcados.',
        'errors.unknownError': 'Algo salió mal. Intenta de nuevo.',
      };
      return translations[key] || key;
    },
  },
}));

//  Mock react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

//  React Query v5 cleanup fix
afterAll(() => {
  const events = ['visibilitychange', 'focus', 'online', 'offline'];
  events.forEach((event) => {
    try {
      // @ts-ignore
      window.removeEventListener(event, () => {});
    } catch {}
  });
});
