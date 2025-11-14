import { Router } from 'express';
import createRoute from './create';
import updateRoute from './update';
import deleteRoute from './delete';
import getAllRoute from './getAll';
import getByIdRoute from './getById';
import getByEmailRoute from './getByEmail';
import getByNameRoute from './getByName';

const router = Router();

router.use(createRoute);
router.use(updateRoute);
router.use(deleteRoute);
router.use(getAllRoute);
router.use(getByIdRoute);
router.use(getByEmailRoute);
router.use(getByNameRoute);

export default router;
