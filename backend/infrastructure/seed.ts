import 'reflect-metadata';
import { AppDataSource } from './orm/data-source';
import { Owner } from '../core/owners/domain/Owner';
import { Animal } from '../core/animals/domain/Animal';
import { Breed } from '../core/breeds/domain/Breed';
import { Pet } from '../core/pets/domain/Pet';

async function seed() {
  await AppDataSource.initialize();
  console.log('📦 Database connected for seeding');

  // Limpieza total de tablas
  await AppDataSource.getRepository(Pet).clear();
  await AppDataSource.getRepository(Breed).clear();
  await AppDataSource.getRepository(Animal).clear();
  await AppDataSource.getRepository(Owner).clear();
  console.log('🧹 All tables cleared');

  // Insertar datos iniciales
  const owner1 = AppDataSource.getRepository(Owner).create({
    name: 'Daniel',
    email: 'daniel@example.com',
    phone: '+34123456789',
  });
  await AppDataSource.getRepository(Owner).save(owner1);

  const animalDog = AppDataSource.getRepository(Animal).create({ species: 'Dog' });
  const animalCat = AppDataSource.getRepository(Animal).create({ species: 'Cat' });
  await AppDataSource.getRepository(Animal).save([animalDog, animalCat]);

  const breedLabrador = AppDataSource.getRepository(Breed).create({
    name: 'Labrador',
    animal: animalDog,
  });
  const breedSiamese = AppDataSource.getRepository(Breed).create({
    name: 'Siamese',
    animal: animalCat,
  });
  await AppDataSource.getRepository(Breed).save([breedLabrador, breedSiamese]);

  const pet1 = AppDataSource.getRepository(Pet).create({
    name: 'Firulais',
    owner: owner1,
    breed: breedLabrador,
  });
  const pet2 = AppDataSource.getRepository(Pet).create({
    name: 'Luna',
    owner: owner1,
    breed: breedSiamese,
  });
  await AppDataSource.getRepository(Pet).save([pet1, pet2]);

  console.log('✅ Seed data inserted');
  await AppDataSource.destroy();
}

seed().catch((err) => {
  console.error('❌ Error seeding database:', err);
});
