import 'reflect-metadata';
import { DataSource } from 'typeorm';

import { AnimalEntity } from './entities/AnimalEntity';
import { AppointmentEntity } from './entities/AppointmentEntity';
import { BreedEntity } from './entities/BreedEntity';
import { OwnerEntity } from './entities/OwnerEntity';
import { PetEntity } from './entities/PetEntity';
import { ServiceEntity } from './entities/ServiceEntity';
import { UserEntity } from './entities/UserEntity';

export const TestDataSource = new DataSource({
  type: 'sqlite',
  database: ':memory:',
  synchronize: true,
  dropSchema: true,
  entities: [
    AnimalEntity,
    AppointmentEntity,
    BreedEntity,
    OwnerEntity,
    PetEntity,
    ServiceEntity,
    UserEntity,
  ],
});
