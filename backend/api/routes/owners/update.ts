import { Router } from 'express';
import { validationMiddleware } from '../../middlewares/validationMiddleware';
import { UpdateOwnerDTO } from '../../../application/owners/dto/UpdateOwnerDTO';
import { container } from 'tsyringe';
import { UpdateOwnerService } from '../../../application/owners/services/UpdateOwnerService';

const router = Router();

router.put('/:id', validationMiddleware(UpdateOwnerDTO), async (req, res, next) => {
  try {
    const service = container.resolve(UpdateOwnerService);
    const result = await service.execute(Number(req.params.id), req.body);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

export default router;
