import { container } from 'tsyringe';
import { GetOwnerByEmailService } from '../../../application/owners/services/GetOwnerByEmailService';
import { Router } from 'express';

const router = Router();

router.get('/email/:email', async (req, res, next) => {
  try {
    const service = container.resolve(GetOwnerByEmailService);
    const result = await service.execute(req.params.email);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

export default router;
