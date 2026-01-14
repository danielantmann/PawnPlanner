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

  // Crear usuario inicial (admin)
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const user1 = AppDataSource.getRepository(User).create({
    firstName: 'Admin',
    lastName: 'User',
    secondLastName: '', // opcional
    email: 'admin@example.com',
    passwordHash: hashedPassword,
  });
  await AppDataSource.getRepository(User).save(user1);

  // Crear Owner ligado al User
  const owner1 = AppDataSource.getRepository(Owner).create({
    name: 'daniel',
    email: 'daniel@example.com',
    phone: '+34123456789',
    userId: user1.id, // 👈 relación con el User creado
  });
  await AppDataSource.getRepository(Owner).save(owner1);

  // Insertar Animals globales (userId = NULL)
  const animalDog = AppDataSource.getRepository(Animal).create({
    species: 'dog',
  });
  const animalCat = AppDataSource.getRepository(Animal).create({
    species: 'cat',
  });
  await AppDataSource.getRepository(Animal).save([animalDog, animalCat]);

  // Insertar Breeds globales (userId = NULL)
  const breedLabrador = AppDataSource.getRepository(Breed).create({
    name: 'labrador',
    animal: animalDog,
  });
  const breedSiamese = AppDataSource.getRepository(Breed).create({
    name: 'siamese',
    animal: animalCat,
  });
  await AppDataSource.getRepository(Breed).save([breedLabrador, breedSiamese]);

  // Insertar Pets ligados al Owner y al User
  const pet1 = AppDataSource.getRepository(Pet).create({
    name: 'firulais',
    owner: owner1,
    breed: breedLabrador,
    userId: user1.id,
  });
  const pet2 = AppDataSource.getRepository(Pet).create({
    name: 'luna',
    owner: owner1,
    breed: breedSiamese,
    userId: user1.id,
  });
  await AppDataSource.getRepository(Pet).save([pet1, pet2]);

  console.log('✅ Seed data inserted');
  await AppDataSource.destroy();
}

seed().catch((err) => {
  console.error('❌ Error seeding database:', err);
});
