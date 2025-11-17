import { Router } from 'express';
import { validationMiddleware } from '../../middlewares/validationMiddleware';
import { CreateAnimalDTO } from '../../../application/animals/dto/CreateAnimalDTO';
import { UpdateAnimalDTO } from '../../../application/animals/dto/UpdateAnimalDTO';

import { createAnimal } from '../../controllers/animals/create';
import { updateAnimal } from '../../controllers/animals/update';
import { deleteAnimal } from '../../controllers/animals/delete';
import { getAllAnimals } from '../../controllers/animals/getAll';
import { getAnimalById } from '../../controllers/animals/getById';
import { getAnimalBySpecies } from '../../controllers/animals/getBySpecies';

const router = Router();

router.post('/', validationMiddleware(CreateAnimalDTO), createAnimal);
router.put('/:id', validationMiddleware(UpdateAnimalDTO), updateAnimal);
router.delete('/:id', deleteAnimal);

router.get('/', getAllAnimals);
router.get('/:id', getAnimalById);
router.get('/species/:species', getAnimalBySpecies);

export default router;
