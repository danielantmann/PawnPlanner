import { Router } from 'express';
import { validationMiddleware } from '../../middlewares/validationMiddleware';
import { authMiddleware } from '../../middlewares/authMiddleware';

import { CreatePetDTO } from '../../../application/pets/dto/CreatePetDTO';
import { UpdatePetDTO } from '../../../application/pets/dto/UpdatePetDTO';

import { createPet } from '../../controllers/pets/create';
import { updatePet } from '../../controllers/pets/update';
import { deletePet } from '../../controllers/pets/delete';
import { getAllPets } from '../../controllers/pets/getAll';
import { getPetById } from '../../controllers/pets/getById';
import { getPetsByName } from '../../controllers/pets/getByName';
import { getPetsByBreed } from '../../controllers/pets/getByBreed';

const router = Router();

// 🔐 PROTEGER TODAS LAS RUTAS
router.use(authMiddleware);

router.post('/', validationMiddleware(CreatePetDTO), createPet);
router.put('/:id', validationMiddleware(UpdatePetDTO), updatePet);
router.delete('/:id', deletePet);

router.get('/', getAllPets);
router.get('/:id', getPetById);
router.get('/name/:name', getPetsByName);
router.get('/breed/:breedId', getPetsByBreed);

export default router;
