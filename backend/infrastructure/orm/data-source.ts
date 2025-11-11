import 'reflect-metadata';
import { DataSource } from 'typeorm';

// import { Pet } from '../../core/pets/domain/Pet';
// import { Owner } from '../../core/owners/domain/Owner';
// import { Appointment } from '../../core/appointments/domain/Appointment';
// import { Service } from '../../core/services/domain/Service';
// import { Breed } from '../../core/breeds/domain/Breed';
// import { Animal } from '../../core/animals/domain/Animal';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: 'db.sqlite',
  synchronize: true,
  logging: false,
  //   entities: [Pet, Owner, Appointment, Service, Breed, Animal],
  entities: [],
});
