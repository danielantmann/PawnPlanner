import { Router } from 'express';
import { container } from 'tsyringe';
import { GetAnimalByIdService } from '../../../application/animals/services/GetAnimalByIdService';
import { NotFoundError } from '../../../shared/errors/NotFoundError';

const router = Router();

router.get('/:id', async (req, res) => {
  try {
    const service = container.resolve(GetAnimalByIdService);
    const animal = await service.execute(Number(req.params.id));
    res.status(200).json(animal);
  } catch (error) {
    if (error instanceof NotFoundError) {
      res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
