import { PetRepository } from './infrastructure/repositories';
import { CreatePetService } from './application/pets/CreatePetService';
import { UpdatePetService } from './application/pets/UpdatePetService';

const petRepository = new PetRepository();

export const createPetService = new CreatePetService(petRepository);
export const updatePetService = new UpdatePetService(petRepository);
