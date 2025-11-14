import { Router } from 'express';
import { container } from 'tsyringe';
import { GetOwnerByIdService } from '../../../application/owners/services/GetOwnerByIdService';

const router = Router();

router.get('/:id', async (req, res, next) => {
  try {
    const service = container.resolve(GetOwnerByIdService);
    const result = service.execute(Number(req.params.id));
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

export default router;
