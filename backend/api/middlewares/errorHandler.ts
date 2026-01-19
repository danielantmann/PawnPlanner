import { Request, Response, NextFunction } from 'express';
import { ValidationError } from 'class-validator';
import { HttpError } from '../../shared/errors/HttpError';

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  console.error('🔥 Error capturado en middleware:', err);

  function flattenValidationErrors(errors: any[]) {
    const result: any[] = [];

    const recurse = (error: any, parentPath = '') => {
      const field = parentPath ? `${parentPath}.${error.property}` : error.property;

      if (error.constraints) {
        result.push({
          field,
          constraints: error.constraints,
        });
      }

      if (error.children && error.children.length > 0) {
        error.children.forEach((child: any) => recurse(child, field));
      }
    };

    errors.forEach((e) => recurse(e));
    return result;
  }

  if (Array.isArray(err) && err.every((e) => e instanceof ValidationError)) {
    const flatErrors = flattenValidationErrors(err);

    return res.status(400).json({
      status: 400,
      message: 'Validation failed',
      errors: flatErrors,
    });
  }

  if (err instanceof HttpError) {
    return res.status(err.statusCode).json({
      status: err.statusCode,
      message: err.message,
    });
  }

  if (
    err?.code === 'SQLITE_CONSTRAINT' ||
    err?.driverError?.code === 'SQLITE_CONSTRAINT' ||
    (typeof err.message === 'string' && err.message.includes('SQLITE_CONSTRAINT'))
  ) {
    return res.status(409).json({
      status: 409,
      message: 'Duplicate entry violates unique constraint',
    });
  }

  return res.status(500).json({
    status: 500,
    message: 'Internal server error',
  });
}
