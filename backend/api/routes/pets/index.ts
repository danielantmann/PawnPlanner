import { Router } from 'express';

import createRoute from './create';
import updateRoute from './update';
import deleteRoute from './delete';
import getAllRoute from './getAll';
import getByIdRoute from './getById';
import getByNameRoute from './getByName';
import getByBreedRoute from './getByBreed';

const router = Router();

router.use('/', createRoute);
router.use('/', updateRoute);
router.use('/', deleteRoute);
router.use('/', getAllRoute);
router.use('/', getByIdRoute);
router.use('/', getByNameRoute);
router.use('/', getByBreedRoute);

export default router;
