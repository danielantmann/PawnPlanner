import { container } from 'tsyringe';

// -------------------- PET --------------------
import { PetRepository } from './infrastructure/repositories/PetRepository';
import { IPetRepository } from './core/pets/domain/IPetRepository';
import { CreatePetService } from './application/pets/services/CreatePetService';
import { UpdatePetService } from './application/pets/services/UpdatePetService';
import { DeletePetService } from './application/pets/services/DeletePetService';
import { GetAllPetsService } from './application/pets/services/GetAllPetsService';
import { GetPetByIdService } from './application/pets/services/GetPetByIdService';
import { GetPetByNameService } from './application/pets/services/GetPetByNameService';
import { GetPetByBreedService } from './application/pets/services/GetPetByBreedService';

// -------------------- BREED --------------------
import { BreedRepository } from './infrastructure/repositories/BreedRepository';
import { IBreedRepository } from './core/breeds/domain/IBreedRepository';
import { CreateBreedService } from './application/breeds/services/CreateBreedService';
import { UpdateBreedService } from './application/breeds/services/UpdateBreedService';
import { DeleteBreedService } from './application/breeds/services/DeleteBreedService';
import { GetAllBreedsService } from './application/breeds/services/GetAllBreedsService';
import { GetBreedByIdService } from './application/breeds/services/GetBreedByIdService';
import { GetBreedByNameService } from './application/breeds/services/GetBreedByNameService';
import { GetBreedsByAnimalService } from './application/breeds/services/GetBreedsByAnimalService';

// -------------------- REGISTER --------------------

// Pet
container.register<IPetRepository>('PetRepository', { useClass: PetRepository });
container.register(CreatePetService, { useClass: CreatePetService });
container.register(UpdatePetService, { useClass: UpdatePetService });
container.register(DeletePetService, { useClass: DeletePetService });
container.register(GetAllPetsService, { useClass: GetAllPetsService });
container.register(GetPetByIdService, { useClass: GetPetByIdService });
container.register(GetPetByNameService, { useClass: GetPetByNameService });
container.register(GetPetByBreedService, { useClass: GetPetByBreedService });

// Breed
container.register<IBreedRepository>('BreedRepository', { useClass: BreedRepository });
container.register(CreateBreedService, { useClass: CreateBreedService });
container.register(UpdateBreedService, { useClass: UpdateBreedService });
container.register(DeleteBreedService, { useClass: DeleteBreedService });
container.register(GetAllBreedsService, { useClass: GetAllBreedsService });
container.register(GetBreedByIdService, { useClass: GetBreedByIdService });
container.register(GetBreedByNameService, { useClass: GetBreedByNameService });
container.register(GetBreedsByAnimalService, { useClass: GetBreedsByAnimalService });
