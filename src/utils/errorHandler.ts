import { isAxiosError } from 'axios';
import i18next from '@/src/i18n';

export interface AppError {
  code: string;
  message: string;
  status?: number;
  originalError?: any;
}

const resolveConflictMessage = (message: string): string => {
  const t = i18next.t.bind(i18next);
  const lower = message.toLowerCase();
  if (lower.includes('phone')) return t('errors.phoneConflict');
  if (lower.includes('email')) return t('errors.emailConflict');
  return t('errors.conflict');
};

export const getErrorMessage = (error: any): string => {
  const t = i18next.t.bind(i18next);

  if (isAxiosError(error)) {
    const status = error.response?.status;
    const data = error.response?.data as any;

    if (status === 409) {
      return resolveConflictMessage(data?.message ?? '');
    }

    if (data?.message) {
      return data.message;
    }

    switch (status) {
      case 400:
        return t('errors.validationError');
      case 401:
        return t('errors.unauthorized');
      case 403:
        return t('errors.forbidden');
      case 404:
        return t('errors.notFound');
      case 500:
        return t('errors.serverError');
      case 503:
        return t('errors.serviceUnavailable');
      default:
        break;
    }

    if (error.code === 'ERR_NETWORK') return t('errors.network');
    if (error.code === 'ECONNABORTED') return t('errors.timeout');
  }

  if (error instanceof Error) return error.message;

  return t('errors.unknownError');
};

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

export const isRecoverableError = (error: any): boolean => {
  if (isAxiosError(error)) {
    const status = error.response?.status;
    return (
      !status || status >= 500 || error.code === 'ERR_NETWORK' || error.code === 'ECONNABORTED'
    );
  }
  return false;
};

export const getErrorCode = (error: any): string => {
  if (isAxiosError(error)) {
    return `HTTP_${error.response?.status}` || 'HTTP_ERROR';
  }
  return 'UNKNOWN_ERROR';
};

export const logError = (error: any, context: string = 'Unknown'): void => {
  const parsed = parseError(error);
  console.error(`[${context}] ${parsed.code}: ${parsed.message}`, {
    status: parsed.status,
    originalError: parsed.originalError,
    timestamp: new Date().toISOString(),
  });
};
