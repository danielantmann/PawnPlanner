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

// -------------------- ANIMAL --------------------
import { AnimalRepository } from './infrastructure/repositories/AnimalRepository';
import { IAnimalRepository } from './core/animals/domain/IAnimalRepository';
import { CreateAnimalService } from './application/animals/services/CreateAnimalService';
import { UpdateAnimalService } from './application/animals/services/UpdateAnimalService';
import { DeleteAnimalService } from './application/animals/services/DeleteAnimalService';
import { GetAllAnimalsService } from './application/animals/services/GetAllAnimalsService';
import { GetAnimalByIdService } from './application/animals/services/GetAnimalByIdService';
import { GetAnimalBySpeciesService } from './application/animals/services/GetAnimalBySpeciesService';

// -------------------- OWNER --------------------
import { OwnerRepository } from './infrastructure/repositories/OwnerRepository';
import { IOwnerRepository } from './core/owners/domain/IOwnerRepository';
import { CreateOwnerService } from './application/owners/services/CreateOwnerService';
import { UpdateOwnerService } from './application/owners/services/UpdateOwnerService';
import { DeleteOwnerService } from './application/owners/services/DeleteOwnerService';
import { GetAllOwnersService } from './application/owners/services/GetAllOwnersService';
import { GetOwnerByIdService } from './application/owners/services/GetOwnerByIdService';
import { GetOwnerByEmailService } from './application/owners/services/GetOwnerByEmailService';
import { GetOwnerByNameService } from './application/owners/services/GetOwnerByNameService';

// -------------------- USER --------------------
import { UserRepository } from './infrastructure/repositories/UserRepository';
import { IUserRepository } from './core/users/domain/IUserRepository';
import { GetUserByIdService } from './application/users/services/GetUserByIdService';
import { UpdateUserService } from './application/users/services/UpdateUserService';
import { DeleteUserService } from './application/users/services/DeleteUserService';

// -------------------- AUTH --------------------
import { RegisterUserService } from './application/auth/services/RegisterUserService';
import { LoginUserService } from './application/auth/services/LoginUserService';
import { RefreshTokenService } from './application/auth/services/RefreshTokenService';
import { ForgotPasswordService } from './application/auth/services/ForgotPasswordService';
import { ResetPasswordService } from './application/auth/services/ResetPasswordService';
import { ChangePasswordService } from './application/auth/services/ChangePasswordService';

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

// Animal
container.register<IAnimalRepository>('AnimalRepository', { useClass: AnimalRepository });
container.register(CreateAnimalService, { useClass: CreateAnimalService });
container.register(UpdateAnimalService, { useClass: UpdateAnimalService });
container.register(DeleteAnimalService, { useClass: DeleteAnimalService });
container.register(GetAllAnimalsService, { useClass: GetAllAnimalsService });
container.register(GetAnimalByIdService, { useClass: GetAnimalByIdService });
container.register(GetAnimalBySpeciesService, { useClass: GetAnimalBySpeciesService });

// Owner
container.register<IOwnerRepository>('OwnerRepository', { useClass: OwnerRepository });
container.register(CreateOwnerService, { useClass: CreateOwnerService });
container.register(UpdateOwnerService, { useClass: UpdateOwnerService });
container.register(DeleteOwnerService, { useClass: DeleteOwnerService });
container.register(GetAllOwnersService, { useClass: GetAllOwnersService });
container.register(GetOwnerByIdService, { useClass: GetOwnerByIdService });
container.register(GetOwnerByEmailService, { useClass: GetOwnerByEmailService });
container.register(GetOwnerByNameService, { useClass: GetOwnerByNameService });

// User
container.register<IUserRepository>('UserRepository', { useClass: UserRepository });
container.register(GetUserByIdService, { useClass: GetUserByIdService });
container.register(UpdateUserService, { useClass: UpdateUserService });
container.register(DeleteUserService, { useClass: DeleteUserService });

// Auth
container.register(RegisterUserService, { useClass: RegisterUserService });
container.register(LoginUserService, { useClass: LoginUserService });
container.register(RefreshTokenService, { useClass: RefreshTokenService });
container.register(ForgotPasswordService, { useClass: ForgotPasswordService });
container.register(ResetPasswordService, { useClass: ResetPasswordService });
container.register(ChangePasswordService, { useClass: ChangePasswordService });
