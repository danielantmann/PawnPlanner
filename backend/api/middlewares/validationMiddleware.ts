import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { Request, Response, NextFunction } from 'express';

export function validationMiddleware(type: any) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const dto = plainToInstance(type, req.body);
    console.log('🐛 [validationMiddleware] dto creado:', dto);

    const errors = await validate(dto);
    console.log('🐛 [validationMiddleware] errores:', errors);

    if (errors.length > 0) {
      return res.status(400).json({
        errors: errors.map((err) => ({
          property: err.property,
          constraints: err.constraints,
        })),
      });
    }

    req.body = dto;
    next();
  };
}
