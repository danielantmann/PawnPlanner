import { Router } from 'express';
import { GetOwnerByNameService } from '../../../application/owners/services/GetOwnerByNameService';
import { container } from 'tsyringe';

const router = Router();

router.get('/name/:name', async (req, res, next) => {
  try {
    const service = container.resolve(GetOwnerByNameService);
    const result = await service.execute(req.params.name);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

export default router;
