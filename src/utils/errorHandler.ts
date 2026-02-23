import { isAxiosError } from 'axios';
import i18next from '@/src/i18n';

export interface AppError {
  code: string;
  message: string;
  status?: number;
  originalError?: any;
}

/**
 * Mapea errores de la API a mensajes claros para el usuario
 * Usa traducciones para mensajes multiidioma
 */
export const getErrorMessage = (error: any): string => {
  const t = i18next.t.bind(i18next);

  // Error de Axios
  if (isAxiosError(error)) {
    const status = error.response?.status;
    const data = error.response?.data as any;

    // Backend retornó un mensaje específico (prioridad 1)
    if (data?.message) {
      return data.message;
    }

    // Errores por status code
    switch (status) {
      case 400:
        return t('errors.validationError');
      case 401:
        return t('errors.unauthorized');
      case 403:
        return t('errors.forbidden');
      case 404:
        return t('errors.notFound');
      case 409:
        return t('errors.conflict');
      case 500:
        return t('errors.serverError');
      case 503:
        return t('errors.serviceUnavailable');
      default:
        break;
    }

    // Error de red
    if (error.code === 'ERR_NETWORK') {
      return t('errors.network');
    }

    // Timeout
    if (error.code === 'ECONNABORTED') {
      return t('errors.timeout');
    }
  }

  // Error genérico
  if (error instanceof Error) {
    return error.message;
  }

  return t('errors.unknownError');
};

/**
 * Parsea error completo para logging/debugging
 */
export const parseError = (error: any): AppError => {
  if (isAxiosError(error)) {
    const status = error.response?.status;

    return {
      code: `HTTP_${status}`,
      message: getErrorMessage(error),
      status,
      originalError: error,
    };
  }

  if (error instanceof Error) {
    return {
      code: 'UNKNOWN_ERROR',
      message: error.message,
      originalError: error,
    };
  }

  return {
    code: 'UNKNOWN_ERROR',
    message: 'Algo salió mal',
    originalError: error,
  };
};

/**
 * Determina si el error es recuperable (se puede reintentar)
 */
export const isRecoverableError = (error: any): boolean => {
  if (isAxiosError(error)) {
    const status = error.response?.status;
    // 5xx, network errors, timeout son recuperables
    return (
      !status || // Sin respuesta del servidor
      status >= 500 || // Errores de servidor
      error.code === 'ERR_NETWORK' ||
      error.code === 'ECONNABORTED'
    );
  }
  return false;
};

/**
 * Obtiene el código de error para analytics/logging
 */
export const getErrorCode = (error: any): string => {
  if (isAxiosError(error)) {
    return `HTTP_${error.response?.status}` || 'HTTP_ERROR';
  }
  return 'UNKNOWN_ERROR';
};

/**
 * Log de error para debugging
 */
export const logError = (error: any, context: string = 'Unknown'): void => {
  const parsed = parseError(error);
  console.error(`[${context}] ${parsed.code}: ${parsed.message}`, {
    status: parsed.status,
    originalError: parsed.originalError,
    timestamp: new Date().toISOString(),
  });
};
