import { Router } from 'express';
import { container } from 'tsyringe';
import { GetAllOwnerService } from '../../../application/owners/services/GetAllOwnersService';

const router = Router();

router.get('/', async (_req, res, next) => {
  try {
    const service = container.resolve(GetAllOwnerService);
    const results = await service.execute();
    res.status(200).json(results);
  } catch (error) {
    next(error);
  }
});

export default router;
