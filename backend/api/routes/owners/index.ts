import { Router } from 'express';
import { validationMiddleware } from '../../middlewares/validationMiddleware';
import { authMiddleware } from '../../middlewares/authMiddleware';

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

// Rutas protegidas por usuario
router.post('/', authMiddleware, validationMiddleware(CreateOwnerDTO), createOwner);
router.put('/:id', authMiddleware, validationMiddleware(UpdateOwnerDTO), updateOwner);
router.delete('/:id', authMiddleware, deleteOwner);

router.get('/', authMiddleware, getAllOwners);
router.get('/:id', authMiddleware, getOwnerById);
router.get('/email/:email', authMiddleware, getOwnerByEmail);
router.get('/name/:name', authMiddleware, getOwnerByName);

export default router;
