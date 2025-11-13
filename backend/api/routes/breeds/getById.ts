import { Router } from 'express';
import { container } from 'tsyringe';
import { GetBreedByIdService } from '../../../application/breeds/services/GetBreedByIdService';
import { NotFoundError } from '../../../shared/errors/NotFoundError';

const router = Router();

router.get('/:id', async (req, res) => {
  try {
    const service = container.resolve(GetBreedByIdService);
    const breed = await service.execute(Number(req.params.id));
    res.status(200).json(breed);
  } catch (error) {
    if (error instanceof NotFoundError) {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
