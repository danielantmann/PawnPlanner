import { Router } from 'express';
import create from './create';
import update from './update';
import del from './delete';
import getAll from './getAll';
import getById from './getById';
import getByName from './getByName';
import getByAnimal from './getByAnimal';

const router = Router();

router.use('/', create);
router.use('/', update);
router.use('/', del);
router.use('/', getAll);
router.use('/', getById);
router.use('/', getByName);
router.use('/', getByAnimal);

export default router;
