import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';

export async function validateDTO<T extends object>(dtoClass: new () => T, body: any): Promise<T> {
  const dto = plainToInstance(dtoClass, body);
  await validateOrReject(dto, { whitelist: true, forbidNonWhitelisted: true });
  return dto;
}
