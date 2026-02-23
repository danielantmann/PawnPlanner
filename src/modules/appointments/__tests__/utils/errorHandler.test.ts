import {
  getErrorMessage,
  parseError,
  isRecoverableError,
  getErrorCode,
} from '@/src/utils/errorHandler';

describe('Error Handler', () => {
  describe('getErrorMessage', () => {
    it('should return network error message for ERR_NETWORK', () => {
      const error = {
        isAxiosError: true,
        code: 'ERR_NETWORK',
        message: 'Network Error',
        response: undefined,
      };
      const message = getErrorMessage(error);
      expect(message).toBe('Sin conexión a internet. Verifica tu conexión.');
    });

    it('should return timeout message for ECONNABORTED', () => {
      const error = {
        isAxiosError: true,
        code: 'ECONNABORTED',
        message: 'timeout',
        response: undefined,
      };
      const message = getErrorMessage(error);
      expect(message).toBe('La solicitud tardó demasiado. Intenta de nuevo.');
    });

    it('should return HTTP 401 message', () => {
      const error = {
        isAxiosError: true,
        response: { status: 401 },
      };
      const message = getErrorMessage(error);
      expect(message).toBe('Tu sesión expiró. Inicia sesión de nuevo.');
    });

    it('should return HTTP 403 message', () => {
      const error = {
        isAxiosError: true,
        response: { status: 403 },
      };
      const message = getErrorMessage(error);
      expect(message).toBe('No tienes permiso para esta acción.');
    });

    it('should return HTTP 404 message', () => {
      const error = {
        isAxiosError: true,
        response: { status: 404 },
      };
      const message = getErrorMessage(error);
      expect(message).toBe('Recurso no encontrado.');
    });

    it('should return HTTP 500 message', () => {
      const error = {
        isAxiosError: true,
        response: { status: 500 },
      };
      const message = getErrorMessage(error);
      expect(message).toBe('Error del servidor. Intenta de nuevo más tarde.');
    });

    it('should return backend error message if available', () => {
      const error = {
        isAxiosError: true,
        response: {
          status: 400,
          data: { message: 'Custom backend error' },
        },
      };
      const message = getErrorMessage(error);
      expect(message).toBe('Custom backend error');
    });

    it('should return unknown error message for unknown errors', () => {
      const error = new Error('Unknown');
      const message = getErrorMessage(error);
      expect(message).toBe('Unknown');
    });

    it('should return default message for non-Error objects', () => {
      const message = getErrorMessage(null);
      expect(message).toBe('Algo salió mal. Intenta de nuevo.');
    });
  });

  describe('parseError', () => {
    it('should parse Axios error', () => {
      const error = {
        isAxiosError: true,
        response: { status: 401 },
      };
      const parsed = parseError(error);
      expect(parsed.code).toBe('HTTP_401');
      expect(parsed.status).toBe(401);
    });

    it('should parse Error object', () => {
      const error = new Error('Test error');
      const parsed = parseError(error);
      expect(parsed.code).toBe('UNKNOWN_ERROR');
      expect(parsed.message).toBe('Test error');
    });
  });

  describe('isRecoverableError', () => {
    it('should return true for 5xx errors', () => {
      const error = { isAxiosError: true, response: { status: 500 } };
      expect(isRecoverableError(error)).toBe(true);
    });

    it('should return true for network errors', () => {
      const error = { isAxiosError: true, code: 'ERR_NETWORK' };
      expect(isRecoverableError(error)).toBe(true);
    });

    it('should return true for timeout errors', () => {
      const error = { isAxiosError: true, code: 'ECONNABORTED' };
      expect(isRecoverableError(error)).toBe(true);
    });

    it('should return false for 4xx errors', () => {
      const error = { isAxiosError: true, response: { status: 400 } };
      expect(isRecoverableError(error)).toBe(false);
    });

    it('should return true for no response status', () => {
      const error = { isAxiosError: true, code: 'ERR_UNKNOWN', response: undefined };
      expect(isRecoverableError(error)).toBe(true);
    });
  });

  describe('getErrorCode', () => {
    it('should return HTTP code for Axios errors', () => {
      const error = { isAxiosError: true, response: { status: 404 } };
      expect(getErrorCode(error)).toBe('HTTP_404');
    });

    it('should return UNKNOWN_ERROR for non-Axios errors', () => {
      const error = new Error('Unknown');
      expect(getErrorCode(error)).toBe('UNKNOWN_ERROR');
    });
  });
});
