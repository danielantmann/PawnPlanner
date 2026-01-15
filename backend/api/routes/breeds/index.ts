import { Router } from 'express';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { validationMiddleware } from '../../middlewares/validationMiddleware';
import { CreateBreedDTO } from '../../../application/breeds/dto/CreateBreedDTO';
import { UpdateBreedDTO } from '../../../application/breeds/dto/UpdateBreedDTO';

import { createBreed } from '../../controllers/breeds/create';
import { updateBreed } from '../../controllers/breeds/update';
import { deleteBreed } from '../../controllers/breeds/delete';
import { getAllBreeds } from '../../controllers/breeds/getAll';
import { getBreedById } from '../../controllers/breeds/getById';
import { getBreedByName } from '../../controllers/breeds/getByName';
import { getBreedsByAnimal } from '../../controllers/breeds/getByAnimal';

const router = Router();

router.use(authMiddleware);

router.post('/', validationMiddleware(CreateBreedDTO), createBreed);
router.put('/:id', validationMiddleware(UpdateBreedDTO), updateBreed);
router.delete('/:id', deleteBreed);

router.get('/', getAllBreeds);
router.get('/:id', getBreedById);
router.get('/name/:name', getBreedByName);
router.get('/animal/:animalId', getBreedsByAnimal);

export default router;
