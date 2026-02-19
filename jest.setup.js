/* eslint-disable no-undef */
jest.mock('axios', () => ({
  isAxiosError: (error) => !!error?.isAxiosError,
}));

jest.mock('expo-localization', () => ({
  getLocales: () => [{ languageCode: 'es' }],
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter', () => ({
  __esModule: true,
  default: class NativeEventEmitter {},
}));

// ⭐ Mock i18next
jest.mock('@/src/i18n', () => ({
  __esModule: true,
  default: {
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
