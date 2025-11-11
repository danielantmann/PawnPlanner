import 'reflect-metadata';
import { DataSource } from 'typeorm';
import dotenv from 'dotenv';

import { Pet } from '../../core/pets/domain/Pet';
import { Owner } from '../../core/owners/domain/Owner';
import { Appointment } from '../../core/appointments/domain/Appointment';
import { Service } from '../../core/services/domian/Service';
import { Breed } from '../../core/breeds/domain/Breed';
import { Animal } from '../../core/animals/domain/Animal';

dotenv.config();
export const AppDataSource = new DataSource({
  type: process.env.DB_TYPE as any,
  database: process.env.DB_PATH,
  synchronize: process.env.TYPEORM_SYNC === 'true',
  logging: process.env.TYPEORM_LOGGING === 'true',
  entities: [Pet, Owner, Appointment, Service, Breed, Animal],
});
