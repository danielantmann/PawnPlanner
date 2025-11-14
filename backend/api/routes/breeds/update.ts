import { Router } from 'express';
import { validationMiddleware } from '../../middlewares/validationMiddleware';
import { UpdateBreedDTO } from '../../../application/breeds/dto/UpdateBreedDTO';
import { container } from 'tsyringe';
import { UpdateBreedService } from '../../../application/breeds/services/UpdateBreedService';
import { NotFoundError } from '../../../shared/errors/NotFoundError';

const router = Router();

router.put('/:id', validationMiddleware(UpdateBreedDTO), async (req, res) => {
  try {
    const service = container.resolve(UpdateBreedService);
    const id = Number(req.params.id);
    const breed = await service.execute(id, req.body);
    res.status(200).json(breed);
  } catch (error) {
    if (error instanceof NotFoundError) {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
