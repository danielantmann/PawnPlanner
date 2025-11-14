import { Router } from 'express';
import { validationMiddleware } from '../../middlewares/validationMiddleware';
import { UpdateAnimalDTO } from '../../../application/animals/dto/UpdateAnimalDTO';
import { container } from 'tsyringe';
import { UpdateAnimalService } from '../../../application/animals/services/UpdateAnimalService';
import { NotFoundError } from '../../../shared/errors/NotFoundError';
import { ValidationError } from '../../../shared/errors/ValidationError';

const router = Router();

router.put('/:id', validationMiddleware(UpdateAnimalDTO), async (req, res) => {
  try {
    const service = container.resolve(UpdateAnimalService);
    const id = Number(req.params.id);
    const animal = await service.execute(id, req.body);
    res.status(200).json(animal);
  } catch (error) {
    if (error instanceof NotFoundError) {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
