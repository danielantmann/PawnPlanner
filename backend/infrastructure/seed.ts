import 'reflect-metadata';
import { AppDataSource } from './orm/data-source';

import { OwnerEntity } from './orm/entities/OwnerEntity';
import { AnimalEntity } from './orm/entities/AnimalEntity';
import { BreedEntity } from './orm/entities/BreedEntity';
import { PetEntity } from './orm/entities/PetEntity';
import { UserEntity } from './orm/entities/UserEntity';
import { ServiceEntity } from './orm/entities/ServiceEntity';
import { AppointmentEntity } from './orm/entities/AppointmentEntity';
import { WorkerEntity } from './orm/entities/WorkerEntity';

import * as bcrypt from 'bcrypt';

async function seed() {
  await AppDataSource.initialize();
  console.log('📦 Database connected for seeding');

  await AppDataSource.getRepository(AppointmentEntity).clear();
  await AppDataSource.getRepository(ServiceEntity).clear();
  await AppDataSource.getRepository(PetEntity).clear();
  await AppDataSource.getRepository(BreedEntity).clear();
  await AppDataSource.getRepository(AnimalEntity).clear();
  await AppDataSource.getRepository(OwnerEntity).clear();
  await AppDataSource.getRepository(WorkerEntity).clear();
  await AppDataSource.getRepository(UserEntity).clear();
  console.log('🧹 All tables cleared');

  const hashedPassword = await bcrypt.hash('Daniel123!', 10);
  const user = AppDataSource.getRepository(UserEntity).create({
    firstName: 'Daniel',
    lastName: 'User',
    secondLastName: '',
    email: 'daniel123@example.com',
    passwordHash: hashedPassword,
  });
  await AppDataSource.getRepository(UserEntity).save(user);

  const workerRepo = AppDataSource.getRepository(WorkerEntity);
  const worker = workerRepo.create({
    userId: user.id,
    name: 'Daniel User',
    phone: '+34666666666',
    isActive: true,
    maxSimultaneous: null,
  });
  await workerRepo.save(worker);

  const ownerRepo = AppDataSource.getRepository(OwnerEntity);
  const ownersData = [
    { name: 'Carlos Pérez', email: 'carlos@example.com', phone: '+34111111111' },
    { name: 'María López', email: 'maria@example.com', phone: '+34222222222' },
    { name: 'Juan García', email: 'juan@example.com', phone: '+34333333333' },
  ];

  const owners: OwnerEntity[] = [];
  for (const o of ownersData) {
    const owner = ownerRepo.create({ ...o, userId: user.id });
    owners.push(await ownerRepo.save(owner));
  }

  const animalRepo = AppDataSource.getRepository(AnimalEntity);
  const animals: AnimalEntity[] = [];
  for (const a of [{ species: 'dog' }, { species: 'cat' }]) {
    const animal = animalRepo.create({ ...a, userId: null });
    animals.push(await animalRepo.save(animal));
  }

  const [dog, cat] = animals;

  const breedRepo = AppDataSource.getRepository(BreedEntity);
  const breedsData = [
    { name: 'labrador', animal: dog },
    { name: 'golden retriever', animal: dog },
    { name: 'bulldog', animal: dog },
    { name: 'siamese', animal: cat },
    { name: 'persian', animal: cat },
    { name: 'maine coon', animal: cat },
  ];

  const breeds: BreedEntity[] = [];
  for (const b of breedsData) {
    const breed = breedRepo.create({ ...b, userId: null });
    breeds.push(await breedRepo.save(breed));
  }

  const petRepo = AppDataSource.getRepository(PetEntity);
  const petsData = [
    { name: 'Firulais', owner: owners[0], breed: breeds[0] },
    { name: 'Toby', owner: owners[0], breed: breeds[1] },
    { name: 'Luna', owner: owners[1], breed: breeds[3] },
    { name: 'Misu', owner: owners[1], breed: breeds[4] },
    { name: 'Rocky', owner: owners[2], breed: breeds[2] },
    { name: 'Nina', owner: owners[2], breed: breeds[5] },
    { name: 'Max', owner: owners[0], breed: breeds[0] },
  ];

  const pets: PetEntity[] = [];
  for (const p of petsData) {
    const pet = petRepo.create({ ...p, userId: user.id });
    pets.push(await petRepo.save(pet));
  }

  const serviceRepo = AppDataSource.getRepository(ServiceEntity);
  const servicesData = [
    { name: 'bath', price: 15 },
    { name: 'haircut', price: 20 },
    { name: 'nail trimming', price: 10 },
    { name: 'ear cleaning', price: 12 },
    { name: 'full grooming', price: 35 },
    { name: 'teeth cleaning', price: 18 },
    { name: 'deshedding', price: 25 },
  ];

  const services: ServiceEntity[] = [];
  for (const s of servicesData) {
    const service = serviceRepo.create({
      name: s.name,
      price: s.price,
      createdByUser: null,
    });
    services.push(await serviceRepo.save(service));
  }

  const [bath, haircut, nailTrim, earClean, fullGroom, teethClean, deshedding] = services;

  const appointmentRepo = AppDataSource.getRepository(AppointmentEntity);

  const today = new Date();
  today.setHours(9, 0, 0, 0);

  const appointmentsData = [
    { date: new Date(today), pet: pets[0], owner: owners[0], service: bath, status: 'completed' },
    {
      date: new Date(today.getTime() + 1 * 3600000),
      pet: pets[1],
      owner: owners[0],
      service: haircut,
      status: 'no-show',
    },
    {
      date: new Date(today.getTime() + 2 * 3600000),
      pet: pets[2],
      owner: owners[1],
      service: fullGroom,
      status: 'completed',
    },
    {
      date: new Date(today.getTime() + 3 * 3600000),
      pet: pets[3],
      owner: owners[1],
      service: nailTrim,
      status: 'cancelled',
    },
    {
      date: new Date(today.getTime() + 4 * 3600000),
      pet: pets[4],
      owner: owners[2],
      service: earClean,
      status: 'completed',
    },

    {
      date: new Date(today.getTime() - 2 * 86400000),
      pet: pets[5],
      owner: owners[2],
      service: deshedding,
      status: 'completed',
    },
    {
      date: new Date(today.getTime() + 2 * 86400000),
      pet: pets[6],
      owner: owners[0],
      service: teethClean,
      status: 'no-show',
    },

    {
      date: new Date(today.getFullYear(), today.getMonth(), 5, 11),
      pet: pets[1],
      owner: owners[0],
      service: fullGroom,
      status: 'completed',
    },
    {
      date: new Date(today.getFullYear(), today.getMonth(), 12, 15),
      pet: pets[2],
      owner: owners[1],
      service: bath,
      status: 'completed',
    },

    {
      date: new Date(today.getFullYear(), 1, 10, 10),
      pet: pets[3],
      owner: owners[1],
      service: haircut,
      status: 'completed',
    },
    {
      date: new Date(today.getFullYear(), 3, 22, 14),
      pet: pets[4],
      owner: owners[2],
      service: deshedding,
      status: 'completed',
    },

    {
      date: new Date(today.getTime() + 10 * 86400000),
      pet: pets[0],
      owner: owners[0],
      service: fullGroom,
      status: 'completed',
    },
    {
      date: new Date(today.getTime() + 20 * 86400000),
      pet: pets[2],
      owner: owners[1],
      service: bath,
      status: 'no-show',
    },
  ];

  for (const a of appointmentsData) {
    const start = a.date;
    const end = new Date(start.getTime() + 60 * 60 * 1000);

    const appointment = appointmentRepo.create({
      userId: user.id,
      petId: a.pet.id,
      ownerId: a.owner.id,
      serviceId: a.service.id,
      workerId: worker.id,

      petName: a.pet.name,
      breedName: a.pet.breed.name,
      ownerName: a.owner.name,
      ownerPhone: a.owner.phone,

      serviceName: a.service.name,
      workerName: worker.name,
      estimatedPrice: a.service.price,
      finalPrice: a.service.price,

      startTime: start,
      endTime: end,
      durationMinutes: 60,

      status: a.status as 'completed' | 'no-show' | 'cancelled',
      reminderSent: false,
    });

    await appointmentRepo.save(appointment);
  }

  console.log('✅ Seed data inserted successfully');
  await AppDataSource.destroy();
}

seed().catch((err) => {
  console.error('❌ Error seeding database:', err);
});
