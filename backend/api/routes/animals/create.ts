import { Router } from 'express';
import { validationMiddleware } from '../../middlewares/validationMiddleware';
import { CreateAnimalDTO } from '../../../application/animals/dto/CreateAnimalDTO';
import { container } from 'tsyringe';
import { CreateAnimalService } from '../../../application/animals/services/CreateAnimalService';
import { ValidationError } from '../../../shared/errors/ValidationError';
import { ConflictError } from '../../../shared/errors/ConflictError';

const router = Router();

router.post('/', validationMiddleware(CreateAnimalDTO), async (req, res, next) => {
  try {
    const service = container.resolve(CreateAnimalService);
    const animal = await service.execute(req.body);
    res.status(201).json(animal);
  } catch (error) {
    next(error);
  }
});

export default router;
