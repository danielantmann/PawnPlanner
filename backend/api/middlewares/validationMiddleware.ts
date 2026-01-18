import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { Request, Response, NextFunction } from 'express';

export function validationMiddleware(type: any) {
  return async (req: Request, _res: Response, next: NextFunction) => {
    const dto = plainToInstance(type, req.body);

    const errors = await validate(dto, {
      whitelist: true,
      forbidNonWhitelisted: true,
      skipMissingProperties: false,
    });

    if (errors.length > 0) {
      return next(errors); // 🔥 PASA EL ERROR AL MIDDLEWARE GLOBAL
    }

    req.body = dto;
    next();
  };
}
