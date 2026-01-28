import 'reflect-metadata';
import { AppDataSource } from './orm/data-source';

import { OwnerEntity } from './orm/entities/OwnerEntity';
import { AnimalEntity } from './orm/entities/AnimalEntity';
import { BreedEntity } from './orm/entities/BreedEntity';
import { PetEntity } from './orm/entities/PetEntity';
import { UserEntity } from './orm/entities/UserEntity';
import { ServiceEntity } from './orm/entities/ServiceEntity';
import { AppointmentEntity } from './orm/entities/AppointmentEntity';

import * as bcrypt from 'bcrypt';

async function seed() {
  await AppDataSource.initialize();
  console.log('📦 Database connected for seeding');

  // Limpieza total
  await AppDataSource.getRepository(AppointmentEntity).clear();
  await AppDataSource.getRepository(ServiceEntity).clear();
  await AppDataSource.getRepository(PetEntity).clear();
  await AppDataSource.getRepository(BreedEntity).clear();
  await AppDataSource.getRepository(AnimalEntity).clear();
  await AppDataSource.getRepository(OwnerEntity).clear();
  await AppDataSource.getRepository(UserEntity).clear();
  console.log('🧹 All tables cleared');

  // Crear usuario principal
  const hashedPassword = await bcrypt.hash('Daniel123!', 10);
  const user = AppDataSource.getRepository(UserEntity).create({
    firstName: 'Daniel',
    lastName: 'User',
    secondLastName: '',
    email: 'daniel123@example.com',
    passwordHash: hashedPassword,
  });
  await AppDataSource.getRepository(UserEntity).save(user);

  // Owners
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

  // Animals globales
  const animalRepo = AppDataSource.getRepository(AnimalEntity);
  const animals: AnimalEntity[] = [];
  for (const a of [{ species: 'dog' }, { species: 'cat' }]) {
    const animal = animalRepo.create({ ...a, userId: null });
    animals.push(await animalRepo.save(animal));
  }

  const [dog, cat] = animals;

  // Breeds globales
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

  // Pets
  const petRepo = AppDataSource.getRepository(PetEntity);
  const petsData = [
    { name: 'Firulais', owner: owners[0], breed: breeds[0] },
    { name: 'Toby', owner: owners[0], breed: breeds[1] },
    { name: 'Luna', owner: owners[1], breed: breeds[3] },
    { name: 'Misu', owner: owners[1], breed: breeds[4] },
    { name: 'Rocky', owner: owners[2], breed: breeds[2] },
  ];

  const pets: PetEntity[] = [];
  for (const p of petsData) {
    const pet = petRepo.create({ ...p, userId: user.id });
    pets.push(await petRepo.save(pet));
  }

  // Services globales (createdByUser: null)
  const serviceRepo = AppDataSource.getRepository(ServiceEntity);
  const servicesData = [
    { name: 'bath', price: 15 },
    { name: 'haircut', price: 20 },
    { name: 'nail trimming', price: 10 },
    { name: 'ear cleaning', price: 12 },
    { name: 'full grooming', price: 35 },
  ];

  const services: ServiceEntity[] = [];
  for (const s of servicesData) {
    const service = serviceRepo.create({
      name: s.name,
      price: s.price,
      createdByUser: null, // ← CORRECTO
    });
    services.push(await serviceRepo.save(service));
  }

  const [bath, haircut, nailTrim, earClean, fullGroom] = services;

  // Appointments realistas
  const appointmentRepo = AppDataSource.getRepository(AppointmentEntity);
  const appointmentsData = [
    { date: new Date('2024-01-10T10:00:00'), pet: pets[0], owner: owners[0], service: bath },
    { date: new Date('2024-02-05T11:00:00'), pet: pets[1], owner: owners[0], service: fullGroom },
    { date: new Date('2024-03-12T09:30:00'), pet: pets[2], owner: owners[1], service: haircut },
    { date: new Date('2024-04-01T15:00:00'), pet: pets[3], owner: owners[1], service: nailTrim },
    { date: new Date('2024-05-20T13:00:00'), pet: pets[4], owner: owners[2], service: earClean },
  ];

  for (const a of appointmentsData) {
    const start = a.date;
    const end = new Date(start.getTime() + 60 * 60 * 1000);
    const durationMinutes = 60;

    const appointment = appointmentRepo.create({
      userId: user.id,

      petId: a.pet.id,
      ownerId: a.owner.id,
      serviceId: a.service.id,

      petName: a.pet.name,
      breedName: a.pet.breed.name,
      ownerName: a.owner.name,
      ownerPhone: a.owner.phone,

      serviceName: a.service.name,
      estimatedPrice: a.service.price,
      finalPrice: a.service.price,

      startTime: start,
      endTime: end,
      durationMinutes,

      status: 'completed',
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
