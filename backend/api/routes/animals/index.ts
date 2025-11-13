import { Router } from 'express';
import createRoute from './create';
import updateRoute from './update';
import deleteRoute from './delete';
import getAllRoute from './getAll';
import getByIdRoute from './getById';
import getBySpeciesRoute from './getBySpecies';

const router = Router();

router.use(createRoute);
router.use(updateRoute);
router.use(deleteRoute);
router.use(getAllRoute);
router.use(getByIdRoute);
router.use(getBySpeciesRoute);

export default router;
