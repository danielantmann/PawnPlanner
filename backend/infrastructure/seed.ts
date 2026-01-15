import 'reflect-metadata';
import { AppDataSource } from './orm/data-source';
import { User } from '../core/users/domain/User';
import { Owner } from '../core/owners/domain/Owner';
import { Animal } from '../core/animals/domain/Animal';
import { Breed } from '../core/breeds/domain/Breed';
import { Pet } from '../core/pets/domain/Pet';
import * as bcrypt from 'bcrypt';

async function seed() {
  await AppDataSource.initialize();
  console.log('📦 Database connected for seeding');

  // Limpieza total de tablas
  await AppDataSource.getRepository(Pet).clear();
  await AppDataSource.getRepository(Breed).clear();
  await AppDataSource.getRepository(Animal).clear();
  await AppDataSource.getRepository(Owner).clear();
  await AppDataSource.getRepository(User).clear();
  console.log('🧹 All tables cleared');

  // Crear usuario principal (Daniel)
  const hashedPassword = await bcrypt.hash('Daniel123!', 10);
  const user = AppDataSource.getRepository(User).create({
    firstName: 'Daniel',
    lastName: 'User',
    secondLastName: '',
    email: 'daniel123@example.com',
    passwordHash: hashedPassword,
  });
  await AppDataSource.getRepository(User).save(user);

  // Crear Owners ligados al usuario
  const owners = [
    { name: 'Carlos Pérez', email: 'carlos@example.com', phone: '+34111111111' },
    { name: 'María López', email: 'maria@example.com', phone: '+34222222222' },
    { name: 'Juan García', email: 'juan@example.com', phone: '+34333333333' },
  ].map((o) => AppDataSource.getRepository(Owner).create({ ...o, userId: user.id }));

  await AppDataSource.getRepository(Owner).save(owners);

  // Insertar Animals globales (userId = null)
  const animals = [{ species: 'dog' }, { species: 'cat' }].map((a) =>
    AppDataSource.getRepository(Animal).create({ ...a, userId: null })
  );

  await AppDataSource.getRepository(Animal).save(animals);

  const [dog, cat] = animals;

  // Insertar Breeds globales
  const breeds = [
    { name: 'labrador', animal: dog },
    { name: 'golden retriever', animal: dog },
    { name: 'bulldog', animal: dog },
    { name: 'siamese', animal: cat },
    { name: 'persian', animal: cat },
    { name: 'maine coon', animal: cat },
  ].map((b) => AppDataSource.getRepository(Breed).create({ ...b, userId: null }));

  await AppDataSource.getRepository(Breed).save(breeds);

  // Insertar Pets ligados a Owners y al User
  const pets = [
    { name: 'Firulais', owner: owners[0], breed: breeds[0] }, // labrador
    { name: 'Toby', owner: owners[0], breed: breeds[1] }, // golden
    { name: 'Luna', owner: owners[1], breed: breeds[3] }, // siamese
    { name: 'Misu', owner: owners[1], breed: breeds[4] }, // persian
    { name: 'Rocky', owner: owners[2], breed: breeds[2] }, // bulldog
  ].map((p) => AppDataSource.getRepository(Pet).create({ ...p, userId: user.id }));

  await AppDataSource.getRepository(Pet).save(pets);

  console.log('✅ Seed data inserted successfully');
  await AppDataSource.destroy();
}

seed().catch((err) => {
  console.error('❌ Error seeding database:', err);
});
