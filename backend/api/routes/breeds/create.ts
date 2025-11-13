import { Router } from 'express';
import { validationMiddleware } from '../../middlewares/validationMiddleware';
import { CreateBreedDTO } from '../../../application/breeds/dto/CreateBreedDTO';
import { container } from 'tsyringe';
import { CreateBreedService } from '../../../application/breeds/services/CreateBreedService';
import { ValidationError } from '../../../shared/errors/ValidationError';

const router = Router();

router.post('/', validationMiddleware(CreateBreedDTO), async (req, res) => {
  try {
    const service = container.resolve(CreateBreedService);
    const breed = await service.execute(req.body);
    res.status(201).json(breed);
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Inernal server error' });
  }
});

export default router;
