import 'reflect-metadata';
import { DataSource } from 'typeorm';
import dotenv from 'dotenv';

import { PetEntity } from './entities/PetEntity';
import { OwnerEntity } from './entities/OwnerEntity';
import { AppointmentEntity } from './entities/AppointmentEntity';
import { ServiceEntity } from './entities/ServiceEntity';
import { BreedEntity } from './entities/BreedEntity';
import { AnimalEntity } from './entities/AnimalEntity';
import { UserEntity } from './entities/UserEntity';

dotenv.config();
export const AppDataSource = new DataSource({
  type: process.env.DB_TYPE as any,
  database: process.env.DB_PATH,
  synchronize: process.env.TYPEORM_SYNC === 'true',
  logging: process.env.TYPEORM_LOGGING === 'true',
  entities: [
    PetEntity,
    OwnerEntity,
    AppointmentEntity,
    ServiceEntity,
    BreedEntity,
    AnimalEntity,
    UserEntity,
  ],
});
