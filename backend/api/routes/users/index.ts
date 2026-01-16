// api/routes/users/index.ts
import { Router } from 'express';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { getMyProfile } from '../../controllers/users/getMyProfile';
import { updateMyProfile } from '../../controllers/users/updateMyProfile';
import { deleteMyAccount } from '../../controllers/users/deleteMyAccount';
import { UpdateUserDTO } from '../../../application/users/dto/UpdateUserDTO';
import { validationMiddleware } from '../../middlewares/validationMiddleware';

const router = Router();

router.use(authMiddleware);

router.get('/me', getMyProfile);
router.put('/me', validationMiddleware(UpdateUserDTO), updateMyProfile);
router.delete('/me', deleteMyAccount);

export default router;
