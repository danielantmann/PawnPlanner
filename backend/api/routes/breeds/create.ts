import { Router } from 'express';
import { validationMiddleware } from '../../middlewares/validationMiddleware';
import { CreateBreedDTO } from '../../../application/breeds/dto/CreateBreedDTO';
import { container } from 'tsyringe';
import { CreateBreedService } from '../../../application/breeds/services/CreateBreedService';

const router = Router();

router.post('/', validationMiddleware(CreateBreedDTO), async (req, res, next) => {
  try {
    const service = container.resolve(CreateBreedService);
    const breed = await service.execute(req.body);
    res.status(201).json(breed);
  } catch (error) {
    next(error);
  }
});

export default router;
