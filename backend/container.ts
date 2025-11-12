import { container } from 'tsyringe';

// Repositorio
import { PetRepository } from './infrastructure/repositories/PetRepository';
import { IPetRepository } from './core/pets/domain/IPetRepository';

// Servicios
import { CreatePetService } from './application/pets/services/CreatePetService';
import { UpdatePetService } from './application/pets/services/UpdatePetService';
import { DeletePetService } from './application/pets/services/DeletePetService';
import { GetAllPetService } from './application/pets/services/GetAllPetsService';
import { GetPetByIdService } from './application/pets/services/GetPetByIdService';
import { GetPetByNameService } from './application/pets/services/GetPetByNameService';
import { GetPetByBreedService } from './application/pets/services/GetPetByBreedService';

// Registro del repositorio bajo un token
container.register<IPetRepository>('PetRepository', { useClass: PetRepository });

// Registro explícito de servicios
container.register(CreatePetService, { useClass: CreatePetService });
container.register(UpdatePetService, { useClass: UpdatePetService });
container.register(DeletePetService, { useClass: DeletePetService });
container.register(GetAllPetService, { useClass: GetAllPetService });
container.register(GetPetByIdService, { useClass: GetPetByIdService });
container.register(GetPetByNameService, { useClass: GetPetByNameService });
container.register(GetPetByBreedService, { useClass: GetPetByBreedService });
