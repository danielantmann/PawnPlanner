import { Router } from 'express';
import { validationMiddleware } from '../../middlewares/validationMiddleware';
import { UpdateAnimalDTO } from '../../../application/animals/dto/UpdateAnimalDTO';
import { container } from 'tsyringe';
import { UpdateAnimalService } from '../../../application/animals/services/UpdateAnimalService';
import { NotFoundError } from '../../../shared/errors/NotFoundError';
import { ValidationError } from '../../../shared/errors/ValidationError';

const router = Router();

router.put('/:id', validationMiddleware(UpdateAnimalDTO), async (req, res, next) => {
  try {
    const service = container.resolve(UpdateAnimalService);
    const id = Number(req.params.id);

    const animal = await service.execute(id, req.body as UpdateAnimalDTO);
    res.status(200).json(animal);
  } catch (error) {
    next(error);
  }
});

export default router;
