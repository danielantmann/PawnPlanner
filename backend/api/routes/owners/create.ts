import { Router } from 'express';
import { validationMiddleware } from '../../middlewares/validationMiddleware';
import { CreateOwnerDTO } from '../../../application/owners/dto/CreateOwnerDTO';
import { container } from 'tsyringe';
import { CreateOwnerService } from '../../../application/owners/services/CreateOwnerService';

const router = Router();

router.post('/', validationMiddleware(CreateOwnerDTO), async (req, res, next) => {
  try {
    const service = container.resolve(CreateOwnerService);
    const result = service.execute(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

export default router;
