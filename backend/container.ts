// Importar configuradores de contenedores por dominio
import { setupPetContainer } from './container/pet.container';
import { setupBreedContainer } from './container/breed.container';
import { setupAnimalContainer } from './container/animal.container';
import { setupOwnerContainer } from './container/owner.container';
import { setupUserContainer } from './container/user.container';
import { setupAuthContainer } from './container/auth.container';
import { setupServiceContainer } from './container/service.container';
import { setupAppointmentContainer } from './container/appointment.container';
import { AppDataSource } from './infrastructure/orm/data-source';
import { TestDataSource } from './infrastructure/orm/data-source.helper';

// Elegir DataSource según entorno
const dataSource = process.env.NODE_ENV === 'test' ? TestDataSource : AppDataSource;

// Registrar todos los contenedores por dominio
setupPetContainer(dataSource);
setupBreedContainer(dataSource);
setupAnimalContainer(dataSource);
setupOwnerContainer(dataSource);
setupUserContainer(dataSource);
setupAuthContainer();
setupServiceContainer(dataSource);
setupAppointmentContainer(dataSource);
