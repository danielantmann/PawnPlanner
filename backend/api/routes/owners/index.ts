import { Router } from 'express';
import { validationMiddleware } from '../../middlewares/validationMiddleware';
import { CreateOwnerDTO } from '../../../application/owners/dto/CreateOwnerDTO';
import { UpdateOwnerDTO } from '../../../application/owners/dto/UpdateOwnerDTO';

import { createOwner } from '../../controllers/owners/create';
import { updateOwner } from '../../controllers/owners/update';
import { deleteOwner } from '../../controllers/owners/delete';
import { getAllOwners } from '../../controllers/owners/getAll';
import { getOwnerById } from '../../controllers/owners/getById';
import { getOwnerByEmail } from '../../controllers/owners/getByEmail';
import { getOwnerByName } from '../../controllers/owners/getByName';

const router = Router();

router.post('/', validationMiddleware(CreateOwnerDTO), createOwner);
router.put('/:id', validationMiddleware(UpdateOwnerDTO), updateOwner);
router.delete('/:id', deleteOwner);

router.get('/', getAllOwners);
router.get('/:id', getOwnerById);
router.get('/email/:email', getOwnerByEmail);
router.get('/name/:name', getOwnerByName);

export default router;
