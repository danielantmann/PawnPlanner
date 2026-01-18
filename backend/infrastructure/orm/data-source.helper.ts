import 'reflect-metadata';
import { DataSource } from 'typeorm';

import { Pet } from '../../core/pets/domain/Pet';
import { Owner } from '../../core/owners/domain/Owner';
import { Appointment } from '../../core/appointments/domain/Appointment';
import { Service } from '../../core/services/domain/Service';
import { Breed } from '../../core/breeds/domain/Breed';
import { Animal } from '../../core/animals/domain/Animal';
import { User } from '../../core/users/domain/User';

export const TestDataSource = new DataSource({
  type: 'sqlite',
  database: ':memory:',
  synchronize: true,
  dropSchema: true,
  entities: [Pet, Owner, Appointment, Service, Breed, Animal, User],
});
